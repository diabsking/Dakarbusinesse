// routes/tableauDeBord.routes.js
import express from "express";
import {
  statsVendeur,
  statsAdmin,
} from "../controllers/tableauDeBord.controller.js";

import authentification from "../middleware/authentification.middleware.js";
import admin from "../middleware/admin.middleware.js";

const routeur = express.Router();

/**
 * TABLEAU DE BORD
 */

// Statistiques vendeur (ventes, produits, commandes, promos)
routeur.get("/vendeur/:id", authentification, statsVendeur);

// Statistiques globales admin
routeur.get("/admin", authentification, admin, statsAdmin);

export default routeur;
