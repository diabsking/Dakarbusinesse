import Statistique from "../models/Statistique.js";

export const getStatistiquesVendeur = async (req, res) => {
  try {
    const vendeurId = req.vendeur?.id || req.vendeur?._id;
    const periodeType = req.query.periode || "jour";

    if (!vendeurId) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const periodesAutorisees = ["jour", "semaine", "mois", "annee"];
    if (!periodesAutorisees.includes(periodeType)) {
      return res.status(400).json({ message: "Période invalide" });
    }

    // 🔹 Dernière stat de la période
    const stats = await Statistique.findOne({
      vendeur: vendeurId,
      "periode.type": periodeType,
    })
      .sort({ "periode.fin": -1 })
      .lean();

    if (!stats) {
      return res.status(404).json({ message: "Aucune statistique trouvée" });
    }

    // 🔹 Sécurisation des nouveaux champs
    const response = {
      periode: stats.periode,
      commandes: {
        total: stats.commandes?.total || 0,
        livrees: stats.commandes?.livrees || 0,
        annulees: stats.commandes?.annulees || 0,
      },
      produits: {
        totaux: stats.produits?.totaux || 0,
        vendusDistincts: stats.produits?.vendusDistincts || 0,
        nonVendus: stats.produits?.nonVendus || 0,
      },
      chiffreAffaires: stats.chiffreAffaires || 0,
      clients: {
        total: stats.clients?.total || 0,
      },
      updatedAt: stats.updatedAt,
    };

    return res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("❌ getStatistiquesVendeur :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
