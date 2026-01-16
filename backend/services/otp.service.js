// services/otp.service.js
import crypto from "crypto";
import Vendor from "../models/Vendeur.js";
import { envoyerOTPSMS } from "./orangeService.js"; // Utilisation du service Orange

/**
 * Générer un code OTP à 6 chiffres
 * @returns {string} code OTP
 */
export const genererOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Créer et sauvegarder un OTP pour un vendeur
 * @param {string} phone - Numéro du vendeur
 * @returns {string} code OTP non hashé (à envoyer par SMS)
 * @throws {Error} si vendeur introuvable
 */
export const creerOTP = async (phone) => {
  const vendeur = await Vendor.findOne({ phone });
  if (!vendeur) {
    throw new Error("Vendeur introuvable");
  }

  const code = genererOTP();

  // Hash du code pour sécuriser la base
  const hash = crypto.createHash("sha256").update(code).digest("hex");

  vendeur.resetCode = hash;
  vendeur.resetCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await vendeur.save();

  // Envoi du code OTP par SMS via Orange
  const smsEnvoye = await envoyerOTPSMS(phone, code);
  if (smsEnvoye) {
    console.log(`[OTP SERVICE] OTP envoyé à ${phone}`);
  } else {
    console.warn(`[OTP SERVICE] Échec envoi OTP à ${phone}`);
  }

  return code; // utile pour logs ou tests
};

/**
 * Vérifier un code OTP pour un vendeur
 * @param {string} phone
 * @param {string} code - Code fourni par l’utilisateur
 * @returns {object} vendeur si OTP valide
 * @throws {Error} si code invalide, expiré ou vendeur introuvable
 */
export const verifierOTP = async (phone, code) => {
  const vendeur = await Vendor.findOne({ phone });
  if (!vendeur || !vendeur.resetCode) {
    throw new Error("Code invalide ou introuvable");
  }

  if (vendeur.resetCodeExpires < Date.now()) {
    throw new Error("Code expiré");
  }

  const hash = crypto.createHash("sha256").update(code).digest("hex");
  if (hash !== vendeur.resetCode) {
    throw new Error("Code incorrect");
  }

  return vendeur;
};

/**
 * Supprimer l’OTP après utilisation
 * @param {string} phone - Numéro du vendeur
 * @returns {boolean}
 */
export const supprimerOTP = async (phone) => {
  const vendeur = await Vendor.findOne({ phone });
  if (!vendeur) {
    throw new Error("Vendeur introuvable");
  }

  vendeur.resetCode = null;
  vendeur.resetCodeExpires = null;
  await vendeur.save();

  console.log(`[OTP SERVICE] OTP supprimé pour ${phone}`);
  return true;
};
