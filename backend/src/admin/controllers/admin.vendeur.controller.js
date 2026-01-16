import mongoose from "mongoose";
import Vendeur from "../../../models/Vendeur.js";
import Produit from "../../../models/Produit.js";
import Commande from "../../../models/Commande.js";

/**
 * ===========================
 * LISTER TOUS LES VENDEURS (ADMIN)
 * ===========================
 */
export const listerVendeurs = async (req, res) => {
  try {
    const vendeurs = await Vendeur.find()
      .select(
        "nomBoutique telephone actif certifie createdAt +email +avatar"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: vendeurs,
      total: vendeurs.length,
    });
  } catch (error) {
    console.error("❌ Erreur listerVendeurs :", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

/**
 * ===========================
 * ACTIVER / SUSPENDRE UN VENDEUR
 * ===========================
 */
export const changerStatutVendeur = async (req, res) => {
  try {
    const { id } = req.params;
    const { actif } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID vendeur invalide",
      });
    }

    if (typeof actif !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Valeur actif invalide",
      });
    }

    const vendeur = await Vendeur.findByIdAndUpdate(
      id,
      { actif },
      { new: true }
    );

    if (!vendeur) {
      return res.status(404).json({
        success: false,
        message: "Vendeur introuvable",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        actif: vendeur.actif,
      },
      message: vendeur.actif
        ? "Vendeur activé avec succès"
        : "Vendeur suspendu avec succès",
    });
  } catch (error) {
    console.error("❌ Erreur changerStatutVendeur :", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

/**
 * ===========================
 * CERTIFIER / RETIRER CERTIFICATION D'UN VENDEUR
 * ===========================
 */
export const changerCertificationVendeur = async (req, res) => {
  try {
    const { id } = req.params;
    const { certifie } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID vendeur invalide",
      });
    }

    if (typeof certifie !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Valeur de certification invalide",
      });
    }

    const vendeur = await Vendeur.findByIdAndUpdate(
      id,
      { certifie },
      { new: true }
    );

    if (!vendeur) {
      return res.status(404).json({
        success: false,
        message: "Vendeur introuvable",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        certifie: vendeur.certifie,
      },
      message: vendeur.certifie
        ? "Vendeur certifié avec succès"
        : "Certification du vendeur retirée",
    });
  } catch (error) {
    console.error("❌ Erreur changerCertificationVendeur :", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

/**
 * ===========================
 * STATISTIQUES D'UN VENDEUR (ADMIN)
 * ===========================
 */
export const statsVendeur = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID vendeur invalide",
      });
    }

    const totalProduits = await Produit.countDocuments({
      vendeur: id,
    });

    const ventes = await Commande.aggregate([
      {
        $match: {
          vendeur: new mongoose.Types.ObjectId(id),
          status: { $ne: "annulée" },
        },
      },
      {
        $group: {
          _id: null,
          totalVentes: { $sum: "$total" },
          totalCommandes: { $sum: 1 },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalProduits,
        totalCommandes: ventes[0]?.totalCommandes || 0,
        totalVentes: ventes[0]?.totalVentes || 0,
        noteMoyenne: null,
      },
    });
  } catch (error) {
    console.error("❌ Erreur statsVendeur :", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};
