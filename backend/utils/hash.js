// utils/hash.js
import bcrypt from "bcryptjs";

/**
 * Hasher un mot de passe
 * @param {String} motDePasse
 */
export const hasherMotDePasse = async (motDePasse) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(motDePasse, salt);
};

/**
 * Comparer mot de passe et hash
 * @param {String} motDePasse
 * @param {String} hash
 */
export const comparerMotDePasse = async (motDePasse, hash) => {
  return await bcrypt.compare(motDePasse, hash);
};
