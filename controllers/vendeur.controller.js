import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Vendeur from "../models/Vendeur.js";

/**
 * =====================
 * PROFIL PUBLIC VENDEUR
 * =====================
 */
export const obtenirVendeurParID = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID vendeur invalide" });
    }

    const vendeur = await Vendeur.findById(id)
      .select(
        "nomVendeur nomBoutique email telephone adresseBoutique avatar typeBoutique description certifie actif createdAt"
      )
      .lean();

    if (!vendeur) {
      return res.status(404).json({ message: "Vendeur introuvable" });
    }

    res.status(200).json(vendeur);
  } catch (error) {
    console.error("Erreur obtenirVendeurParID :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * =====================
 * PROFIL VENDEUR CONNECTÉ
 * =====================
 */
export const obtenirMonProfil = async (req, res) => {
  try {
    const vendeur = await Vendeur.findById(req.vendeur.id)
      .select("-password -otp -otpExpire")
      .lean();

    if (!vendeur) {
      return res.status(404).json({ message: "Vendeur introuvable" });
    }

    res.json(vendeur);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * =====================
 * MODIFIER PROFIL VENDEUR
 * =====================
 */
export const modifierProfilVendeur = async (req, res) => {
  try {
    const updates = {};
    const champsAutorises = [
      "nomVendeur",
      "nomBoutique",
      "email",
      "adresseBoutique",
      "description",
      "typeBoutique",
    ];

    champsAutorises.forEach((champ) => {
      if (req.body[champ] !== undefined) {
        updates[champ] = req.body[champ];
      }
    });

    if (req.file?.path) {
      updates.avatar = req.file.path;
    }

    const vendeur = await Vendeur.findByIdAndUpdate(
      req.vendeur.id,
      updates,
      { new: true }
    ).select("-password");

    if (!vendeur) {
      return res.status(404).json({ message: "Vendeur introuvable" });
    }

    res.json({
      message: "Profil mis à jour",
      vendeur,
    });
  } catch (error) {
    console.error("Erreur modifierProfilVendeur :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * =====================
 * SUPPRIMER COMPTE VENDEUR
 * =====================
 */
export const supprimerMonCompte = async (req, res) => {
  try {
    const vendeurId = req.vendeur.id;

    const vendeur = await Vendeur.findByIdAndDelete(vendeurId);

    if (!vendeur) {
      return res.status(404).json({ message: "Vendeur introuvable" });
    }

    res.json({
      message: "Compte vendeur supprimé définitivement",
    });
  } catch (error) {
    console.error("Erreur suppression compte vendeur :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * =====================
 * CHANGER MOT DE PASSE
 * =====================
 */
export const changerMotDePasse = async (req, res) => {
  try {
    const { ancienPassword, nouveauPassword } = req.body;

    if (!ancienPassword || !nouveauPassword) {
      return res.status(400).json({ message: "Champs requis manquants" });
    }

    const vendeur = await Vendeur.findById(req.vendeur.id);
    if (!vendeur) {
      return res.status(404).json({ message: "Vendeur introuvable" });
    }

    const match = await bcrypt.compare(ancienPassword, vendeur.password);
    if (!match) {
      return res.status(400).json({ message: "Ancien mot de passe incorrect" });
    }

    vendeur.password = await bcrypt.hash(nouveauPassword, 10);
    await vendeur.save();

    res.json({ message: "Mot de passe modifié avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * =====================
 * CERTIFIER COMPTE VENDEUR
 * =====================
 * (Admin / Back-office)
 */
export const certifierVendeur = async (req, res) => {
  try {
    const vendeur = await Vendeur.findByIdAndUpdate(
      req.params.id,
      { certifie: true },
      { new: true }
    ).select("nomVendeur certifie");

    if (!vendeur) {
      return res.status(404).json({ message: "Vendeur introuvable" });
    }

    res.json({
      message: "Compte vendeur certifié",
      vendeur,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * =====================
 * DÉCONNEXION
 * =====================
 */
export const deconnexionVendeur = async (req, res) => {
  try {
    // JWT = stateless → logout côté client
    res.json({ message: "Déconnexion réussie" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
