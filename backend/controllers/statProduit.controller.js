import StatProduit from "../models/StatProduit.js";
import StatProduitDaily from "../models/StatProduitDaily.js";
import StatProduitEvent from "../models/StatProduitEvent.js";

/* ================= UTILS ================= */
const today = () => new Date().toISOString().slice(0, 10);

/* ================= MÉTHODE GÉNÉRIQUE ================= */
const enregistrerStat = async ({ produitId, type, montant = 0, req }) => {
  // 1️⃣ Récupérer stats globales
  const stat = await StatProduit.findOne({ produit: produitId });
  if (!stat) throw new Error("Produit non trouvé");

  // 2️⃣ Mettre à jour stats globales
  switch (type) {
    case "VIEW":
      stat.vuesTotales = (stat.vuesTotales || 0) + 1;
      break;
    case "PANIER":
      stat.ajoutsPanier = (stat.ajoutsPanier || 0) + 1;
      break;
    case "COMMANDE":
      stat.commandes = (stat.commandes || 0) + 1;
      stat.chiffreAffaires = (stat.chiffreAffaires || 0) + montant;
      break;
    default:
      break;
  }

  // 3️⃣ Recalculer score/popularité si nécessaire
  if (typeof stat.recalculer === "function") stat.recalculer();
  await stat.save();

  // 4️⃣ Stats journalières
  const dailyUpdate = {};
  if (type === "VIEW") dailyUpdate.vues = 1;
  if (type === "PANIER") dailyUpdate.ajoutsPanier = 1;
  if (type === "COMMANDE") {
    dailyUpdate.commandes = 1;
    dailyUpdate.chiffreAffaires = montant;
  }

  await StatProduitDaily.findOneAndUpdate(
    { produit: produitId, date: today() },
    { $inc: dailyUpdate },
    { upsert: true }
  );

  // 5️⃣ Journal des événements
  await StatProduitEvent.create({
    produit: produitId,
    type,
    montant: type === "COMMANDE" ? montant : undefined,
    user: req.user?.id,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });
};

/* ================= VUE PRODUIT ================= */
export const vueProduit = async (req, res) => {
  try {
    const { produitId } = req.params;
    await enregistrerStat({ produitId, type: "VIEW", req });
    res.sendStatus(200);
  } catch (err) {
    console.error("Erreur vueProduit :", err);
    res.status(500).json({ message: err.message || "Erreur serveur" });
  }
};

/* ================= AJOUT PANIER ================= */
export const ajoutPanier = async (req, res) => {
  try {
    const { produitId } = req.params;
    await enregistrerStat({ produitId, type: "PANIER", req });
    res.sendStatus(200);
  } catch (err) {
    console.error("Erreur ajoutPanier :", err);
    res.status(500).json({ message: err.message || "Erreur serveur" });
  }
};

/* ================= COMMANDE ================= */
export const commandeProduit = async (req, res) => {
  try {
    const { produitId } = req.params;
    const { montant } = req.body;

    if (typeof montant !== "number" || montant < 0)
      return res.status(400).json({ message: "Montant invalide" });

    await enregistrerStat({ produitId, type: "COMMANDE", montant, req });
    res.sendStatus(200);
  } catch (err) {
    console.error("Erreur commandeProduit :", err);
    res.status(500).json({ message: err.message || "Erreur serveur" });
  }
};
