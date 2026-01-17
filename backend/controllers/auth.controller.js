import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary.js";
import Vendeur from "../models/Vendeur.js";
import { genererToken } from "../services/token.service.js";
import { creerOTP, envoyerOTPMail } from "../services/mailService.js";
import {
  validerPhone,
  validerMotDePasse,
  validerNom,
} from "../utils/validations.js";

/* =====================================================
   INSCRIPTION + ENVOI OTP EMAIL
===================================================== */
export const inscriptionVendeur = async (req, res) => {
  try {
    const {
      nomVendeur,
      email,
      telephone,
      password,
      nomBoutique = "",
      typeBoutique = "En ligne",
    } = req.body;

    /* =============================
       VALIDATIONS
    ============================= */
    if (!validerNom(nomVendeur))
      return res.status(400).json({ message: "Nom vendeur invalide" });

    if (!email)
      return res.status(400).json({ message: "Email requis" });

    if (!validerPhone(telephone))
      return res.status(400).json({ message: "Téléphone invalide" });

    if (!validerMotDePasse(password))
      return res.status(400).json({
        message: "Mot de passe trop faible (min 6 caractères)",
      });

    /* =============================
       BLOQUAGE RÉINSCRIPTION < 24H
    ============================= */
    const inscriptionEnCours = req.app.locals.otpInscription;

    if (
      inscriptionEnCours &&
      inscriptionEnCours.data.email === email.toLowerCase() &&
      inscriptionEnCours.expire > Date.now()
    ) {
      return res.status(400).json({
        message:
          "Votre inscription est déjà en cours de validation. " +
          "Pour votre sécurité et afin d’éviter les faux comptes, " +
          "notre équipe est en train de valider votre demande. " +
          "Veuillez vérifier votre email et confirmer votre inscription dans le délai imparti.",
      });
    }

    /* =============================
       VÉRIFICATION EXISTANT
    ============================= */
    const existeTel = await Vendeur.findOne({ telephone });
    if (existeTel)
      return res.status(400).json({ message: "Téléphone déjà utilisé" });

    const existeEmail = await Vendeur.findOne({ email: email.toLowerCase() });
    if (existeEmail)
      return res.status(400).json({ message: "Email déjà utilisé" });

    /* =============================
       GÉNÉRATION OTP
    ============================= */
    const otp = Math.floor(100000 + Math.random() * 900000);

    req.app.locals.otpInscription = {
      otp,
      expire: Date.now() + 24 * 60 * 60 * 1000, // ⏱️ 24 heures
      data: {
        nomVendeur,
        email: email.toLowerCase(),
        telephone,
        password: await bcrypt.hash(password, 10),
        nomBoutique,
        typeBoutique,
      },
    };

    /* =============================
       ENVOI EMAIL OTP
    ============================= */
    await envoyerOTPMail({
      email,
      otp,
      nomVendeur,
      type: "INSCRIPTION",
    });

    res.status(200).json({
      message:
        "Votre demande d’inscription a été prise en compte. " +
        "Pour votre sécurité et afin d’éviter les faux comptes, " +
        "un code de vérification a été envoyé à votre adresse email. " +
        "Veuillez confirmer votre inscription dans les 24 heures.",
    });
  } catch (error) {
    console.error("[REGISTER ERROR]", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* =====================================================
   CONNEXION
===================================================== */
export const connexionVendeur = async (req, res) => {
  try {
    const { telephone, password } = req.body;

    const vendeur = await Vendeur.findOne({ telephone });
    if (!vendeur)
      return res.status(400).json({ message: "Vendeur introuvable" });

    const match = await bcrypt.compare(password, vendeur.password);
    if (!match)
      return res.status(400).json({ message: "Mot de passe incorrect" });

    const token = genererToken(vendeur._id);

    res.json({
      message: "Connexion réussie",
      vendeur: {
        id: vendeur._id,
        nomVendeur: vendeur.nomVendeur,
        email: vendeur.email,
        telephone: vendeur.telephone,
        nomBoutique: vendeur.nomBoutique,
        typeBoutique: vendeur.typeBoutique,
      },
      token,
    });
  } catch (error) {
    console.error("[LOGIN ERROR]", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* =====================================================
   VENDEUR CONNECTÉ
===================================================== */
export const vendeurConnecte = async (req, res) => {
  try {
    const vendeur = await Vendeur.findById(req.vendeur.id).select("-password");
    res.json(vendeur);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* =====================================================
   UPDATE PROFIL VENDEUR
===================================================== */
export const updateProfilVendeur = async (req, res) => {
  try {
    const vendeurId = req.vendeur.id;
    const updates = {};

    if (req.body.nomVendeur)
      updates.nomVendeur = req.body.nomVendeur.trim();

    if (req.body.nomBoutique)
      updates.nomBoutique = req.body.nomBoutique.trim();

    if (req.body.typeBoutique)
      updates.typeBoutique = req.body.typeBoutique;

    if (req.body.adresseBoutique)
      updates.adresseBoutique = req.body.adresseBoutique.trim();

    if (req.body.description)
      updates.description = req.body.description.trim();

    if (req.body.email)
      updates.email = req.body.email.toLowerCase().trim();

    if (req.file?.path) {
      updates.avatar = req.file.path;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "Aucune donnée valide à mettre à jour",
      });
    }

    const vendeur = await Vendeur.findByIdAndUpdate(
      vendeurId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      message: "Profil mis à jour",
      vendeur,
    });
  } catch (error) {
    console.error("[UPDATE PROFIL VENDEUR ERROR]", error);
    res.status(500).json({
      message: "Erreur serveur",
    });
  }
};

/* =====================================================
   SUPPRIMER AVATAR
===================================================== */
export const supprimerAvatar = async (req, res) => {
  try {
    const vendeur = await Vendeur.findById(req.vendeur.id);
    if (!vendeur)
      return res.status(404).json({ message: "Vendeur introuvable" });

    if (!vendeur.avatar)
      return res.json({ message: "Aucun avatar à supprimer", vendeur });

    const publicId = vendeur.avatar.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`avatars/${publicId}`);

    vendeur.avatar = null;
    await vendeur.save();

    res.json({ message: "Avatar supprimé", vendeur });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* =====================================================
   PROFIL VENDEUR PUBLIC PAR ID
===================================================== */
export const obtenirProfilVendeurParId = async (req, res) => {
  try {
    const vendeur = await Vendeur.findById(req.params.id).select(
      "nomBoutique nomVendeur avatar email description adresseBoutique typeBoutique telephone"
    );

    if (!vendeur) {
      return res.status(404).json({
        message: "Vendeur introuvable",
      });
    }

    res.status(200).json(vendeur);
  } catch (error) {
    console.error("❌ Erreur profil vendeur public :", error);
    res.status(500).json({
      message: "Erreur serveur",
    });
  }
};

/* =====================================================
   SUPPRIMER / SUSPENDRE COMPTE
===================================================== */
export const supprimerCompte = async (req, res) => {
  try {
    const vendeurId = req.vendeur.id;

    const vendeur = await Vendeur.findById(vendeurId);
    if (!vendeur) {
      return res.status(404).json({
        message: "Compte introuvable",
      });
    }

    // ❌ Suppression définitive
    await Vendeur.findByIdAndDelete(vendeurId);

    res.json({
      message:
        "Compte supprimé définitivement. Vous pouvez recréer un compte avec les mêmes informations.",
    });
  } catch (error) {
    console.error("[SUPPRESSION DEFINITIVE ERROR]", error);
    res.status(500).json({
      message: "Erreur serveur",
    });
  }
};

// ======================
// MOT DE PASSE OUBLIÉ : ENVOI OTP
// ======================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("[FORGOT PASSWORD] Requête reçue :", email);

    if (!email) {
      return res.status(400).json({ message: "Email requis" });
    }

    const vendeur = await Vendeur.findOne({ email });
    if (!vendeur) {
      console.log("[FORGOT PASSWORD] Email introuvable :", email);
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000);
    const resetCodeExpire = new Date(Date.now() + 24 * 60 * 60 * 1000);

    vendeur.resetCode = resetCode;
    vendeur.resetCodeExpire = resetCodeExpire;
    await vendeur.save();

    console.log("[FORGOT PASSWORD] Code généré :", resetCode);

    // ✅ ENVOI EMAIL
    await envoyerOTPMail({
      email: vendeur.email,
      otp: resetCode,
      type: "RESET_PASSWORD",
    });

    console.log("[FORGOT PASSWORD] Email envoyé avec succès");

    res.status(200).json({
      message: "Code de réinitialisation envoyé",
    });
  } catch (error) {
    console.error("[FORGOT PASSWORD ERROR]", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};


// ======================
// VERIFIER CODE OTP
// ======================
export const verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code)
      return res.status(400).json({ message: "Email et code requis" });

    const isValid = verifierOTP(email, code);
    if (!isValid) return res.status(400).json({ message: "Code invalide ou expiré" });

    res.json({ message: "Code validé" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ======================
// RESET MOT DE PASSE
// ======================

export const resetPassword = async (req, res) => {
  try {
    const { email, code, nouveauPassword } = req.body;

    if (!email || !code || !nouveauPassword) {
      return res.status(400).json({ message: "Champs manquants" });
    }

    const vendeur = await Vendeur.findOne({ email });
    if (!vendeur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // 🔹 Vérification code + expiration 24h
    if (
      !vendeur.resetCode ||
      !vendeur.resetCodeExpire ||
      vendeur.resetCode !== Number(code) ||
      vendeur.resetCodeExpire < new Date()
    ) {
      return res.status(400).json({ message: "Code incorrect ou expiré" });
    }

    // 🔹 Hash du nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    vendeur.password = await bcrypt.hash(nouveauPassword, salt);

    // 🔹 Nettoyage
    vendeur.resetCode = null;
    vendeur.resetCodeExpire = null;

    await vendeur.save();

    res.status(200).json({
      message: "Mot de passe réinitialisé avec succès",
    });
  } catch (error) {
    console.error("Erreur reset-password:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};


/* =====================================================
   VERIFIER OTP EMAIL
===================================================== */

export const verifierOTP = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        message: "Email ou code manquant",
      });
    }

    const inscription = req.app.locals.otpInscription;

    if (!inscription) {
      return res.status(400).json({
        message: "Aucune inscription en cours",
      });
    }

    // 🔒 Vérifie que l’email correspond à l’inscription
    if (inscription.data.email !== email) {
      return res.status(400).json({
        message: "Email incorrect pour ce code",
      });
    }

    if (inscription.expire < Date.now()) {
      req.app.locals.otpInscription = null;
      return res.status(400).json({
        message: "Code expiré",
      });
    }

    if (String(inscription.otp) !== String(code)) {
      return res.status(400).json({
        message: "Code incorrect",
      });
    }

    // ✅ CRÉATION DÉFINITIVE DU COMPTE
    const vendeur = await Vendeur.create({
      ...inscription.data,
      emailVerifie: true,
    });

    // 🧹 nettoyage
    req.app.locals.otpInscription = null;

    const token = genererToken(vendeur._id);

    res.status(201).json({
      message: "Compte créé avec succès",
      vendeur: {
        id: vendeur._id,
        nomVendeur: vendeur.nomVendeur,
        email: vendeur.email,
      },
      token,
    });
  } catch (error) {
    console.error("[VERIFY OTP ERROR]", error);
    res.status(500).json({
      message: "Erreur serveur",
    });
  }
};


/* =====================================================
   RENVOYER OTP EMAIL
===================================================== */
export const renvoyerOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email requis",
      });
    }

    const vendeur = await Vendeur.findOne({ email });

    if (!vendeur) {
      return res.status(404).json({
        message: "Compte introuvable",
      });
    }

    // Générer nouveau OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    vendeur.otp = otp;
    vendeur.otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    vendeur.emailVerifie = false;

    await vendeur.save();

    await envoyerOTPMail(email, otp);

    res.json({
      message: "Nouveau code envoyé par email",
    });
  } catch (error) {
    console.error("[RESEND OTP ERROR]", error);
    res.status(500).json({
      message: "Erreur serveur",
    });
  }
};


