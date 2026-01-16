import express from "express";

// sous-routes admin
import vendeurRoutes from "./vendeur.routes.js";
import produitRoutes from "./produit.routes.js";
import commandeRoutes from "./commande.routes.js";
import statsRoutes from "./stats.routes.js";

const router = express.Router();

/* =========================
   ROUTES ADMIN (SANS MIDDLEWARE)
========================= */

// VENDEURS
router.use("/vendeurs", vendeurRoutes);

// PRODUITS
router.use("/produits", produitRoutes);

// COMMANDES
router.use("/commandes", commandeRoutes);

// STATS
router.use("/stats", statsRoutes);

export default router;
