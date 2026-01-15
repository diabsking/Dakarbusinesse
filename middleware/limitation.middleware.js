// middleware/limitation.middleware.js
import rateLimit from "express-rate-limit";

/**
 * Limitation générale pour toute l'API
 */
export const limiteGenerale = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,                 // 200 requêtes max par IP
  message: {
    message: "Trop de requêtes. Veuillez réessayer plus tard.",
  },
  standardHeaders: true,  // envoie les headers RateLimit dans la réponse
  legacyHeaders: false,   // désactive les anciens headers
});

/**
 * Limitation stricte pour OTP / Auth
 */
export const limiteOTP = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,                   // 5 tentatives max par IP
  message: {
    message: "Trop de tentatives. Réessayez dans 10 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
