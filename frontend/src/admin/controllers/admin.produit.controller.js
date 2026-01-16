import mongoose from "mongoose";
import Produit from "../../../models/Produit.js";

/**
 * ===========================
 * LISTER TOUS LES PRODUITS (ADMIN)
 * ===========================
 */
export const listerProduits = async (req, res) => {
  try {
    const produits = await Produit.find()
      .select(
        `
        nom
        prix
        prixActuel
        images
        image
        valide
        actif
        enPromotion
        createdAt
        vendeur
        `
      )
      .populate({
        path: "vendeur",
        select: `
          nomBoutique
          nomVendeur
          avatar
          email
          telephone
        `,
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: produits,
      total: produits.length,
    });
  } catch (error) {
    console.error("❌ Erreur listerProduits :", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

/**
 * ===========================
 * VALIDER / REFUSER UN PRODUIT
 * ===========================
 */
export const validerProduit = async (req, res) => {
  try {
    const { id } = req.params;
    const { valide } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID produit invalide",
      });
    }

    if (typeof valide !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Valeur de validation invalide",
      });
    }

    const produit = await Produit.findByIdAndUpdate(
      id,
      { valide },
      { new: true }
    );

    if (!produit) {
      return res.status(404).json({
        success: false,
        message: "Produit introuvable",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        valide: produit.valide,
      },
      message: valide
        ? "Produit validé avec succès"
        : "Produit refusé avec succès",
    });
  } catch (error) {
    console.error("❌ Erreur validerProduit :", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

/**
 * ===========================
 * METTRE UN PRODUIT EN PROMOTION
 * ===========================
 */
export const mettreProduitEnPromo = async (req, res) => {
  try {
    const { id } = req.params;
    const { prixPromo } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID produit invalide",
      });
    }

    if (typeof prixPromo !== "number" || prixPromo <= 0) {
      return res.status(400).json({
        success: false,
        message: "Prix promotion invalide",
      });
    }

    const produit = await Produit.findById(id);

    if (!produit) {
      return res.status(404).json({
        success: false,
        message: "Produit introuvable",
      });
    }

    if (!produit.valide) {
      return res.status(400).json({
        success: false,
        message: "Produit non validé",
      });
    }

    if (prixPromo >= produit.prix) {
      return res.status(400).json({
        success: false,
        message:
          "Le prix promotion doit être inférieur au prix normal",
      });
    }

    produit.enPromotion = true;
    produit.prixActuel = prixPromo;
    await produit.save();

    return res.status(200).json({
      success: true,
      data: {
        enPromotion: produit.enPromotion,
        prixActuel: produit.prixActuel,
      },
      message: "Produit mis en promotion",
    });
  } catch (error) {
    console.error("❌ Erreur mettreProduitEnPromo :", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

/**
 * ===========================
 * SUSPENDRE / RÉACTIVER UN PRODUIT
 * ===========================
 */
export const suspendreProduit = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier ID Mongo
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID produit invalide",
      });
    }

    // Supprimer le produit
    const produit = await Produit.findByIdAndDelete(id);

    if (!produit) {
      return res.status(404).json({
        success: false,
        message: "Produit introuvable",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Produit supprimé définitivement avec succès",
      data: {
        id: produit._id,
        nom: produit.nom,
      },
    });
  } catch (error) {
    console.error("❌ Erreur suspendreProduit :", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};
