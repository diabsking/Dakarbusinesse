// utils/response.js

/**
 * Réponse succès
 * @param {Object} res - Response Express
 * @param {Number} code - Code HTTP (default 200)
 * @param {String} message
 * @param {Object} data - Données optionnelles
 */
export const reussite = (res, message, data = {}, code = 200) => {
  return res.status(code).json({
    success: true,
    message,
    data,
  });
};

/**
 * Réponse erreur
 * @param {Object} res - Response Express
 * @param {String} message
 * @param {Number} code - Code HTTP (default 500)
 */
export const erreur = (res, message, code = 500) => {
  return res.status(code).json({
    success: false,
    message,
  });
};

/**
 * Réponse validation
 * @param {Object} res - Response Express
 * @param {Array} erreurs - Tableau des messages d'erreur
 */
export const validation = (res, erreurs) => {
  return res.status(400).json({
    success: false,
    message: "Validation échouée",
    erreurs,
  });
};
