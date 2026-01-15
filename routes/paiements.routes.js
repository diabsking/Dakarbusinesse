import express from "express";
import authentification from "../middleware/authentification.middleware.js";
import {
  creerPaiementBoost,
  callbackPaydunya,
} from "../controllers/paiements.controller.js";

const router = express.Router();

/**
 * 💳 Création paiement boost produit (Wave via PayDunya)
 */
router.post(
  "/booster-produit",
  authentification,
  creerPaiementBoost
);

/**
 * 🔔 Callback PayDunya (confirmation paiement)
 */
router.post(
  "/paydunya/callback",
  callbackPaydunya
);

export default router;
