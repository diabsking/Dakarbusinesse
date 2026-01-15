import nodemailer from "nodemailer";

/* =====================================================
   CONFIG SMTP MAILO (SSL 465)
===================================================== */
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

transporter.verify((err, success) => {
  if (err) console.error("❌ SMTP MAILO non prêt :", err);
  else console.log("✅ SMTP MAILO prêt à envoyer des emails");
});

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
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: clientEmail,
      subject: `Confirmation de votre commande ${commande._id}`,
      html: templateClientCommande(commande),
    });
    console.log(`✅ Email client envoyé à ${clientEmail}`);
  } catch (err) {
    console.error("❌ Erreur envoi email client :", err);
  }
};

export const notifierVendeurCommande = async (emailVendeur, commande, vendeurNom, vendeurId) => {
  if (!emailVendeur) return;

  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: emailVendeur,
      subject: `Nouvelle commande n°${commande._id}`,
      html: templateVendeurCommande(commande, vendeurNom, vendeurId),
    });
    console.log(`✅ Email vendeur envoyé à ${emailVendeur}`);
  } catch (err) {
    console.error("❌ Erreur envoi email vendeur :", err);
  }
};
