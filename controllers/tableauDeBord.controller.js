// controllers/tableauDeBord.controller.js
import Produit from "../models/Produit.js";
import Commande from "../models/Commande.js";
import Promotion from "../models/Promotion.js";

/**
 * Statistiques pour un vendeur
 */
export const statsVendeur = async (req, res) => {
  try {
    const vendeurId = req.params.id;

    const totalProduits = await Produit.countDocuments({ vendeur: vendeurId });
    const totalPromotions = await Promotion.countDocuments({ vendeur: vendeurId });
    const commandes = await Commande.find({ "produits.vendeur": vendeurId });

    const totalCommandes = commandes.length;
    const totalVentes = commandes.reduce((acc, commande) => {
      const montant = commande.produits
        .filter(p => p.vendeur.toString() === vendeurId)
        .reduce((sum, p) => sum + p.quantite * p.prix, 0);
      return acc + montant;
    }, 0);

    res.json({
      totalProduits,
      totalPromotions,
      totalCommandes,
      totalVentes,
    });
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Statistiques globales pour admin
 */
export const statsAdmin = async (req, res) => {
  try {
    const totalProduits = await Produit.countDocuments();
    const totalPromotions = await Promotion.countDocuments();
    const totalCommandes = await Commande.countDocuments();

    const commandes = await Commande.find();
    const totalVentes = commandes.reduce((acc, commande) => {
      const montant = commande.produits.reduce((sum, p) => sum + p.quantite * p.prix, 0);
      return acc + montant;
    }, 0);

    res.json({
      totalProduits,
      totalPromotions,
      totalCommandes,
      totalVentes,
    });
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
