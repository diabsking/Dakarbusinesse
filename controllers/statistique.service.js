import mongoose from "mongoose";
import Commande from "../models/Commande.js";
import Statistique from "../models/Statistique.js";
import Produit from "../models/Produit.js";

/* ================= UTILS ================= */

const startOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);

const endOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

const getWeekRange = (date) => {
  const d = new Date(date);
  const day = d.getDay() || 7;

  const debut = new Date(d);
  debut.setDate(d.getDate() - day + 1);
  debut.setHours(0, 0, 0, 0);

  const fin = new Date(debut);
  fin.setDate(debut.getDate() + 6);
  fin.setHours(23, 59, 59, 999);

  return { debut, fin };
};

const getMonthRange = (date) => ({
  debut: new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0),
  fin: new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999),
});

const getYearRange = (date) => ({
  debut: new Date(date.getFullYear(), 0, 1, 0, 0, 0),
  fin: new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999),
});

/* ================= CRON ================= */

export const genererStatistiquesVendeur = async () => {
  console.log("📊 Génération automatique des stats...");
  console.log("🚀 CRON STATS DÉMARRÉ");

  try {
    const vendeurs = await Commande.distinct("produits.vendeur");
    console.log("🧑‍💼 Vendeurs trouvés :", vendeurs);

    const now = new Date();

    for (const vendeurId of vendeurs) {
      console.log("\n==============================");
      console.log("➡️ TRAITEMENT VENDEUR :", vendeurId.toString());

      await genererStats(vendeurId, "jour", {
        debut: startOfDay(now),
        fin: endOfDay(now),
      });

      await genererStats(vendeurId, "semaine", getWeekRange(now));
      await genererStats(vendeurId, "mois", getMonthRange(now));
      await genererStats(vendeurId, "annee", getYearRange(now));
    }

    console.log("✅ CRON STATS TERMINÉ");
  } catch (error) {
    console.error("❌ ERREUR CRON STATS :", error);
  }
};

/* ================= CORE ================= */

const genererStats = async (vendeurId, type, { debut, fin }) => {
  const vendeurObjectId = new mongoose.Types.ObjectId(vendeurId);

  // marge anti-timezone
  const dateDebut = new Date(debut);
  dateDebut.setHours(dateDebut.getHours() - 12);

  const dateFin = new Date(fin);
  dateFin.setHours(dateFin.getHours() + 12);

  console.log(
    `📅 Période ${type.toUpperCase()} :`,
    dateDebut.toISOString(),
    "→",
    dateFin.toISOString()
  );

  console.log("🔍 Recherche commandes...");

  const commandes = await Commande.find({
    createdAt: { $gte: dateDebut, $lte: dateFin },
    produits: {
      $elemMatch: {
        vendeur: vendeurObjectId,
      },
    },
  });

  console.log("📦 Commandes trouvées :", commandes.length);

  let totalCommandes = commandes.length;
  let livrees = 0;
  let annulees = 0;
  let chiffreAffaires = 0;

  const clientsSet = new Set();
  const produitsMap = {};
  let produitsTotaux = 0; // quantité totale vendue

  for (const c of commandes) {
    console.log("🧾 Commande", c._id.toString(), "| status =", c.status);

    if (c.status === "livré") livrees++;
    if (c.status === "annulé") annulees++;

    if (c.status !== "livré") continue;

    const produitsVendeur = c.produits.filter(
      (p) => p.vendeur.toString() === vendeurObjectId.toString()
    );

    for (const p of produitsVendeur) {
      chiffreAffaires += p.prix * p.quantite;

      produitsMap[p.produitId] =
        (produitsMap[p.produitId] || 0) + p.quantite;

      produitsTotaux += p.quantite;
    }

    if (c.client?.telephone) {
      clientsSet.add(c.client.telephone);
    }
  }

  // Produits distincts vendus
  const produitsVendusDistincts = Object.keys(produitsMap).length;

  // Total produits du vendeur
  const totalProduitsVendeur = await Produit.countDocuments({
    vendeur: vendeurObjectId,
  });

  // Produits non vendus
  const produitsNonVendus = Math.max(
    totalProduitsVendeur - produitsVendusDistincts,
    0
  );

  console.log("💰 CA TOTAL :", chiffreAffaires);
  console.log("📦 Commandes livrées :", livrees);
  console.log("🧮 Produits totaux vendus :", produitsTotaux);
  console.log("📉 Produits non vendus :", produitsNonVendus);

  await Statistique.findOneAndUpdate(
    {
      vendeur: vendeurObjectId,
      "periode.type": type,
      "periode.debut": debut,
      "periode.fin": fin,
    },
    {
      vendeur: vendeurObjectId,
      periode: {
        type,
        debut,
        fin,
        jour: debut.getDate(),
        mois: debut.getMonth() + 1,
        annee: debut.getFullYear(),
      },
      commandes: {
        total: totalCommandes,
        livrees,
        annulees,
      },
      produits: {
        totaux: produitsTotaux,
        vendusDistincts: produitsVendusDistincts,
        nonVendus: produitsNonVendus,
      },
      chiffreAffaires,
      clients: {
        total: clientsSet.size,
      },
    },
    { upsert: true, new: true }
  );

  console.log("📝 Statistique sauvegardée");
};
