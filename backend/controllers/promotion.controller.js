// controllers/promotion.controller.js
import Promotion from "../models/Promotion.js";
import Produit from "../models/Produit.js";

/**
 * Créer une promotion (vendeur certifié)
 */
export const creerPromotion = async (req, res) => {
  try {
    const { produitId, pourcentage, dateDebut, dateFin } = req.body;

    // Vérifier le produit
    const produit = await Produit.findById(produitId);
    if (!produit) return res.status(404).json({ message: "Produit non trouvé" });

    // Vérifier que le vendeur est propriétaire
    if (req.vendeur.id !== produit.vendeur.toString()) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const promotion = await Promotion.create({
      produit: produitId,
      vendeur: req.vendeur.id,
      pourcentage,
      dateDebut,
      dateFin,
    });

    res.status(201).json({ message: "Promotion créée", promotion });
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Obtenir toutes les promotions actives
 */
export const obtenirToutesPromotions = async (req, res) => {
  try {
    const maintenant = new Date();
    const promotions = await Promotion.find({
      dateDebut: { $lte: maintenant },
      dateFin: { $gte: maintenant },
    }).populate("produit", "nom prix images").populate("vendeur", "nom shopName");

    res.json({ promotions });
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Obtenir promotions d’un vendeur
 */
export const obtenirPromotionsVendeur = async (req, res) => {
  try {
    const promotions = await Promotion.find({ vendeur: req.params.id })
      .populate("produit", "nom prix images");
    res.json({ promotions });
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Modifier promotion
 */
export const modifierPromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) return res.status(404).json({ message: "Promotion non trouvée" });

    // Vérifier que le vendeur connecté est propriétaire
    if (req.vendeur.id !== promotion.vendeur.toString()) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const { pourcentage, dateDebut, dateFin } = req.body;
    if (pourcentage) promotion.pourcentage = pourcentage;
    if (dateDebut) promotion.dateDebut = dateDebut;
    if (dateFin) promotion.dateFin = dateFin;

    await promotion.save();

    res.json({ message: "Promotion mise à jour", promotion });
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Supprimer promotion
 */
export const supprimerPromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) return res.status(404).json({ message: "Promotion non trouvée" });

    // Vérifier que le vendeur connecté est propriétaire
    if (req.vendeur.id !== promotion.vendeur.toString()) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    await promotion.deleteOne();

    res.json({ message: "Promotion supprimée" });
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
