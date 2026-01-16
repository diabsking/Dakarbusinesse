import mongoose from "mongoose";
import Commande from "../../../models/Commande.js";

/**
 * ===========================
 * LISTER TOUTES LES COMMANDES (ADMIN)
 * ===========================
 */
export const toutesCommandes = async (req, res) => {
  try {
    const commandes = await Commande.find()
      .populate("produits.vendeur", "nomBoutique telephone certification")
      .sort({ createdAt: -1 });

    res.status(200).json(commandes);
  } catch (error) {
    console.error("❌ Erreur toutesCommandes :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * ===========================
 * MODIFIER LE STATUT D'UNE COMMANDE (ADMIN)
 * ===========================
 */
export const modifierCommandeAdmin = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de commande invalide",
      });
    }

    const statutsAutorises = [
      "en cours",
      "en préparation",
      "livrée",
      "annulée",
    ];

    if (!statutsAutorises.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Statut invalide",
      });
    }

    const commande = await Commande.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!commande) {
      return res.status(404).json({
        success: false,
        message: "Commande introuvable",
      });
    }

    return res.status(200).json({
      success: true,
      data: commande,
      message: "Statut mis à jour",
    });
  } catch (error) {
    console.error("❌ Erreur modifierCommandeAdmin :", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

/**
 * ===========================
 * STATS ADMIN
 * ===========================
 */
export const statsGlobales = async (req, res) => {
  try {
    const totalCommandes = await Commande.countDocuments();
    const commandesAnnulees = await Commande.countDocuments({
      status: "annulée",
    });
    const commandesLivrees = await Commande.countDocuments({
      status: "livrée",
    });

    const ventes = await Commande.aggregate([
      { $match: { status: { $ne: "annulée" } } },
      {
        $group: {
          _id: null,
          totalVentes: { $sum: "$total" },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalCommandes,
        totalVentes: ventes[0]?.totalVentes || 0,
        commandesLivrees,
        commandesAnnulees,
      },
    });
  } catch (error) {
    console.error("❌ Erreur statsGlobales :", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};
