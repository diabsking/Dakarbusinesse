// utils/constantes.js

// Statuts de commande
export const STATUT_COMMANDE = {
  EN_COURS: "en cours",
  LIVRE: "livré",
  ANNULE: "annulé",
};

// Rôles utilisateurs
export const ROLE = {
  VENDEUR: "vendeur",
  VENDEUR_CERTIFIE: "vendeur_certifie",
  ADMIN: "admin",
};

// Taille maximale upload (en octets)
export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB

// Types fichiers autorisés pour upload
export const FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Durée OTP en millisecondes
export const OTP_EXPIRE = 10 * 60 * 1000; // 10 minutes

// Durée JWT
export const JWT_EXPIRE = "7d";

// Préfixe WhatsApp Cloud API
export const WHATSAPP_PREFIX = "+221"; // Sénégal
