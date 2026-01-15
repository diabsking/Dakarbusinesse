// routes/promotions.routes.js
import express from "express";
import {
  creerPromotion,
  obtenirToutesPromotions,
  obtenirPromotionsVendeur,
  modifierPromotion,
  supprimerPromotion,
} from "../controllers/promotion.controller.js";

import authentification from "../middleware/authentification.middleware.js";
import vendeurCertifie from "../middleware/vendeurCertifie.middleware.js";

const routeur = express.Router();

/**
 * PROMOTIONS
 */

// Créer une promo (vendeur connecté et certifié)
routeur.post(
  "/",
  authentification,
  vendeurCertifie,
  creerPromotion
);

// Obtenir toutes les promotions (publiques)
routeur.get("/", obtenirToutesPromotions);

// Obtenir promotions d’un vendeur
routeur.get("/vendeur/:id", obtenirPromotionsVendeur);

// Modifier promotion
routeur.put(
  "/:id",
  authentification,
  vendeurCertifie,
  modifierPromotion
);

// Supprimer promotion
routeur.delete(
  "/:id",
  authentification,
  vendeurCertifie,
  supprimerPromotion
);

export default routeur;
