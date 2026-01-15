// services/token.service.js
import jwt from "jsonwebtoken";

/**
 * Générer un token JWT pour un vendeur
 * @param {Object} vendeur - Document Mongoose vendeur
 * @returns {string} token JWT
 */
export const genererToken = (vendeur) => {
  if (!vendeur || !vendeur._id) {
    throw new Error("Vendeur invalide pour génération de token");
  }

  const payload = {
    id: vendeur._id.toString(),
    isAdmin: vendeur.isAdmin || false,
    isCertified: vendeur.isCertified || false,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || "7d", // configurable via .env
  });

  console.log(`[TOKEN SERVICE] Token généré pour vendeur ${vendeur._id}`);
  return token;
};

/**
 * Vérifier un token JWT
 * @param {string} token - Token JWT à vérifier
 * @returns {Object|null} payload si valide, null sinon
 */
export const verifierToken = (token) => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`[TOKEN SERVICE] Token valide pour vendeur ${payload.id}`);
    return payload;
  } catch (erreur) {
    console.warn(`[TOKEN SERVICE] Token JWT invalide : ${erreur.message}`);
    return null;
  }
};

/**
 * Extraire le token depuis l’en-tête Authorization
 * @param {string} authorizationHeader - Exemple : "Bearer <token>"
 * @returns {string|null} token pur ou null
 */
export const extraireToken = (authorizationHeader) => {
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return null;
  }
  return authorizationHeader.split(" ")[1];
};

// Export global
export default {
  genererToken,
  verifierToken,
  extraireToken,
};
