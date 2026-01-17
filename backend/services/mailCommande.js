import SibApiV3Sdk from "sib-api-v3-sdk";

/* =====================================================
   CONFIG SENDINBLUE (API)
===================================================== */
console.log("📦 Initialisation du service mail (Sendinblue API)...");

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.SENDINBLUE_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

/* =====================================================
   TEMPLATES EMAIL
===================================================== */
const templateClientCommande = (commande) => `
  <div style="font-family:Arial;padding:20px">
    <h2>Votre commande a été validée ✅</h2>
    <p>Bonjour ${commande.client.nom},</p>
    <p>Nous avons bien reçu votre commande n° <strong>${commande._id}</strong>.</p>
    <p>Total : ${commande.total.toLocaleString()} FCFA</p>
    <p>Merci de votre confiance !</p>
  </div>
`;

const templateVendeurCommande = (commande, vendeurNom, vendeurId) => `
  <div style="font-family:Arial;padding:20px">
    <h2>Nouvelle commande reçue</h2>
    <p>Bonjour ${vendeurNom || "vendeur"},</p>
    <p>Vous avez reçu une nouvelle commande n° <strong>${commande._id}</strong> :</p>
    <ul>
      ${commande.produits
        .filter(p => p.vendeur.toString() === vendeurId)
        .map(p => `<li>${p.nom} x${p.quantite} - ${p.prix.toLocaleString()} FCFA</li>`)
        .join("")}
    </ul>
    <p>Total : ${commande.total.toLocaleString()} FCFA</p>
    <p>Merci de traiter cette commande rapidement.</p>
  </div>
`;

/* =====================================================
   FONCTIONS D'ENVOI EMAIL
===================================================== */
export const notifierClientCommande = async (clientEmail, commande) => {
  if (!clientEmail) return;

  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.to = [{ email: clientEmail }];
    sendSmtpEmail.sender = {
      email: process.env.MAIL_FROM,
      name: process.env.MAIL_FROM_NAME || "Kolwaz",
    };
    sendSmtpEmail.subject = `Confirmation de votre commande ${commande._id}`;
    sendSmtpEmail.htmlContent = templateClientCommande(commande);

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("📤 Email client envoyé :", response);
  } catch (err) {
    console.error("❌ Erreur envoi email client :", err);
  }
};

export const notifierVendeurCommande = async (emailVendeur, commande, vendeurNom, vendeurId) => {
  if (!emailVendeur) return;

  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.to = [{ email: emailVendeur }];
    sendSmtpEmail.sender = {
      email: process.env.MAIL_FROM,
      name: process.env.MAIL_FROM_NAME || "Kolwaz",
    };
    sendSmtpEmail.subject = `Nouvelle commande n°${commande._id}`;
    sendSmtpEmail.htmlContent = templateVendeurCommande(commande, vendeurNom, vendeurId);

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("📤 Email vendeur envoyé :", response);
  } catch (err) {
    console.error("❌ Erreur envoi email vendeur :", err);
  }
};
