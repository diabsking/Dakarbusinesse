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

/* =====================================================
   TEMPLATES EMAIL BOOST
==================================================== */
const templateBoostValide = ({ nomProduit }) => `
  <div style="font-family:Arial;padding:20px">
    <h2>Boost validé 🎉</h2>
    <p>Bonjour,</p>
    <p>Votre demande de boost pour le produit <strong>${nomProduit}</strong> a été <strong>VALIDÉE</strong>.</p>
    <p>Le boost est désormais actif sur votre produit.</p>
    <p>Merci pour votre confiance.</p>
  </div>
`;

const templateBoostRefuse = ({ nomProduit }) => `
  <div style="font-family:Arial;padding:20px">
    <h2>Boost refusé ❌</h2>
    <p>Bonjour,</p>
    <p>Votre demande de boost pour le produit <strong>${nomProduit}</strong> a été <strong>REFUSÉE</strong>.</p>
    <p>Si vous souhaitez plus d'informations, contactez le support.</p>
  </div>
`;

/* =====================================================
   ENVOI MAIL BOOST (Sendinblue API)
==================================================== */
export const envoyerMailBoost = async ({
  email,
  type = "VALIDEE",
  produitNom,
}) => {
  try {
    const subject =
      type === "REFUSEE"
        ? "Votre boost a été refusé ❌"
        : "Votre boost a été validé 🎉";

    const html =
      type === "REFUSEE"
        ? templateBoostRefuse({ nomProduit: produitNom })
        : templateBoostValide({ nomProduit: produitNom });

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.sender = {
      email: process.env.MAIL_FROM,
      name: process.env.MAIL_FROM_NAME || "Kolwaz",
    };
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("📤 MAIL BOOST SENT INFO :", response);
    console.log(`✅ Email boost envoyé à ${email}`);
  } catch (error) {
    console.error("❌ ERREUR ENVOI EMAIL BOOST :", error);
    throw new Error("Impossible d'envoyer l'email de boost");
  }
};

/* =====================================================
   TEMPLATES EMAIL CERTIFICATION
==================================================== */
const templateCertificationValidee = ({ nomVendeur }) => `
  <div style="font-family:Arial;padding:20px">
    <h2>Certification validée 🎉</h2>
    <p>Bonjour <strong>${nomVendeur}</strong>,</p>
    <p>Votre demande de certification a été <strong>VALIDÉE</strong>.</p>
    <p>Vous êtes désormais un vendeur certifié sur notre plateforme.</p>
    <p>Merci pour votre confiance !</p>
  </div>
`;

const templateCertificationRefusee = ({ nomVendeur, commentaire }) => `
  <div style="font-family:Arial;padding:20px">
    <h2>Certification refusée ❌</h2>
    <p>Bonjour <strong>${nomVendeur}</strong>,</p>
    <p>Votre demande de certification a été <strong>REFUSÉE</strong>.</p>
    ${
      commentaire
        ? `<p>Commentaire du support : <em>${commentaire}</em></p>`
        : ""
    }
    <p>Si vous souhaitez plus d'informations, contactez notre support.</p>
  </div>
`;

/* =====================================================
   ENVOI MAIL CERTIFICATION
==================================================== */
export const envoyerMailCertification = async ({
  email,
  type = "VALIDEE",
  nomVendeur,
  commentaire = "",
}) => {
  try {
    const subject =
      type === "REFUSEE"
        ? "Votre certification a été refusée ❌"
        : "Votre certification a été validée 🎉";

    const html =
      type === "REFUSEE"
        ? templateCertificationRefusee({ nomVendeur, commentaire })
        : templateCertificationValidee({ nomVendeur });

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.sender = {
      email: process.env.MAIL_FROM,
      name: process.env.MAIL_FROM_NAME || "Kolwaz",
    };
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("📤 MAIL CERTIFICATION SENT INFO :", response);
    console.log(`✅ Email certification ${type} envoyé à ${email}`);
  } catch (error) {
    console.error("❌ ERREUR ENVOI EMAIL CERTIFICATION :", error);
    throw new Error("Impossible d'envoyer l'email de certification");
  }
};

