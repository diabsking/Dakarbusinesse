// controllers/upload.controller.js
import fs from "fs";
import path from "path";

/**
 * Upload image produit
 */
export const uploadImageProduit = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Aucune image fournie" });
    }

    const fichiers = req.files.map(file => file.filename);

    res.status(201).json({
      message: "Images produit uploadées avec succès",
      fichiers,
    });
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Upload image profil vendeur
 */
export const uploadImageProfil = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Aucune image fournie" });
    }

    res.status(201).json({
      message: "Image profil uploadée avec succès",
      fichier: req.file.filename,
    });
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
