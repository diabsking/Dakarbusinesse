import Avis from "../models/Avis.js";

/**
 * ➕ Ajouter un avis
 */
export const ajouterAvis = async (req, res) => {
  try {
    const { produit, clientNom, clientPhone, note, commentaire } = req.body;

    if (!produit || !clientNom || !clientPhone || !note) {
      return res.status(400).json({ message: "Champs obligatoires manquants" });
    }

    const avis = await Avis.create({
      produit,
      clientNom,
      clientPhone,
      note,
      commentaire,
    });

    res.status(201).json({ avis });
  } catch (err) {
    console.error("❌ Erreur ajout avis :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * 📄 Avis d’un produit
 */
export const obtenirAvisProduit = async (req, res) => {
  try {
    const avis = await Avis.find({ produit: req.params.id }).sort({ createdAt: -1 });
    res.json(avis);
  } catch (err) {
    console.error("❌ Erreur récupération avis :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
