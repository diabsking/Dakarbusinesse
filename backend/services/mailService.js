import nodemailer from "nodemailer";
import net from "net";

/* =====================================================
   CONFIG MAILO SMTP (SSL 465)
==================================================== */
console.log("📦 Initialisation du service mail (MAILO SSL 465)...");

console.log("🔐 SMTP CONFIG :", {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.SMTP_USER,
  from: process.env.MAIL_FROM,
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: { rejectUnauthorized: false },
  logger: true,
  debug: true,
});

/* =====================================================
   TEST DE CONNECTIVITE SMTP (TCP)
==================================================== */
const testSmtpConnection = () => {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      timeout: 5000,
    });

    socket.on("connect", () => {
      socket.end();
      resolve(true);
    });

    socket.on("error", (err) => {
      reject(err);
    });

    socket.on("timeout", () => {
      socket.destroy();
      reject(new Error("Timeout SMTP connection"));
    });
  });
};

testSmtpConnection()
  .then(() => console.log("✅ SMTP reachable (port ouvert)"))
  .catch((err) =>
    console.error("❌ SMTP non joignable (réseau) :", err.message)
  );

/* =====================================================
   TEMPLATES EMAIL OTP
==================================================== */
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
==================================================== */
const otpStore = {};

export const creerOTP = (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expireAt = Date.now() + 24 * 60 * 60 * 1000;
  otpStore[email] = { otp, expireAt };
  return otp;
};

export const verifierOTP = (email, otp) => {
  const record = otpStore[email];
  if (!record) return false;
  if (Date.now() > record.expireAt) {
    delete otpStore[email];
    return false;
  }
  return record.otp === otp;
};

/* =====================================================
   ENVOI OTP PAR EMAIL
==================================================== */
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
    console.log("➡️ OTP :", otp);

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
