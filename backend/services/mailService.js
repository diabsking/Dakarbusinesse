import SibApiV3Sdk from "sib-api-v3-sdk";

/* =====================================================
   Initialisation Sendinblue API
==================================================== */
console.log("📦 Initialisation du service mail (Sendinblue API)...");

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.SENDINBLUE_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

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
   ENVOI OTP PAR EMAIL (Sendinblue API)
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

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.sender = {
      email: process.env.MAIL_FROM,
      name: process.env.MAIL_FROM_NAME || "Kolwaz",
    };
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("📤 MAIL SENT INFO :", response);
    console.log(`✅ Email OTP envoyé à ${email}`);
  } catch (error) {
    console.error("❌ ERREUR ENVOI EMAIL OTP :", error);
    throw new Error("Impossible d'envoyer l'OTP par email");
  }
};
