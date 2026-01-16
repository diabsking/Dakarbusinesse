import express from "express";
import { getStatistiquesVendeur } from "../controllers/statistique.controller.js";
import authentification from "../middleware/authentification.middleware.js";

const router = express.Router();

/**
 * @route   GET /api/statistiques/vendeur
 * @query   periode = jour | semaine | mois | annee
 * @access  Vendeur (auth)
 */
router.get("/vendeur", authentification, getStatistiquesVendeur);

export default router;
