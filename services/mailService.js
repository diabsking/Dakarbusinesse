import nodemailer from "nodemailer";

/* =====================================================
   CONFIG MAILO SMTP (SSL 465)
===================================================== */
console.log("📦 Initialisation du service mail (MAILO SSL 465)...");

console.log("🔐 SMTP CONFIG :", {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.SMTP_USER,
  from: process.env.MAIL_FROM,
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,          // ex: smtp.mailo.com
  port: Number(process.env.SMTP_PORT),  // ex: 465
  secure: true,                         // SSL
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: { rejectUnauthorized: false },
  logger: true,
  debug: true,
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP MAILO NON prêt :", error);
  } else {
    console.log("✅ SMTP MAILO prêt à envoyer des emails");
  }
});

/* =====================================================
   TEMPLATES EMAIL OTP
===================================================== */
const templateInscriptionOTP = ({ nomVendeur, otp }) => `
  <div style="font-family:Arial;padding:20px">
    <h2>Vérification de votre compte</h2>
    <p>Bonjour <strong>${nomVendeur || ""}</strong>,</p>
    <p>Votre code de vérification est :</p>
    <h1 style="letter-spacing:6px">${otp}</h1>
    <p>Ce code est valable 24 heures.</p>
  </div>
`;

const templateResetPasswordOTP = ({ otp }) => `
  <div style="font-family:Arial;padding:20px">
    <h2>Réinitialisation du mot de passe</h2>
    <p>Votre code est :</p>
    <h1 style="letter-spacing:6px">${otp}</h1>
    <p>Ce code est valable 24 heures.</p>
  </div>
`;

/* =====================================================
   STOCKAGE OTP EN MÉMOIRE
===================================================== */
const otpStore = {}; // Structure : { email: { otp: "123456", expireAt: timestamp } }

/**
 * Génère un OTP 6 chiffres pour un email et le stocke avec expiration 24h
 */
export const creerOTP = (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expireAt = Date.now() + 24 * 60 * 60 * 1000; // 24h en ms
  otpStore[email] = { otp, expireAt };
  return otp;
};

/**
 * Vérifie un OTP pour un email.
 * Retourne true si correct et non expiré, sinon false.
 */
export const verifierOTP = (email, otp) => {
  const record = otpStore[email];
  if (!record) return false;
  if (Date.now() > record.expireAt) {
    delete otpStore[email]; // Supprime si expiré
    return false;
  }
  return record.otp === otp;
};

/* =====================================================
   ENVOI OTP PAR EMAIL
===================================================== */
export const envoyerOTPMail = async ({
  email,
  otp,
  nomVendeur = "",
  type = "INSCRIPTION",
}) => {
  try {
    console.log("📨 Tentative envoi OTP");
    console.log("➡️ Destinataire :", email);
    console.log("➡️ Type :", type);
    console.log("➡️ OTP :", otp); // ❗ debug temporaire

    const subject =
      type === "RESET_PASSWORD"
        ? "Code de réinitialisation du mot de passe"
        : "Votre code de vérification";

    const html =
      type === "RESET_PASSWORD"
        ? templateResetPasswordOTP({ otp })
        : templateInscriptionOTP({ nomVendeur, otp });

    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject,
      html,
    });

    console.log("📤 MAIL SENT INFO :", {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
    });

    console.log(`✅ Email OTP envoyé à ${email}`);
  } catch (error) {
    console.error("❌ ERREUR ENVOI EMAIL OTP :", error);
    throw new Error("Impossible d'envoyer l'OTP par email");
  }
};

