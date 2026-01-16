import express from "express";
import {
  vueProduit,
  ajoutPanier,
  commandeProduit,
} from "../controllers/statProduit.controller.js";
import { getProduitEvents } from "../controllers/statController.js";

const router = express.Router();

/* =====================================================
   📊 Statistiques et événements produit
===================================================== */

// ======= Création d'événements =======

// Enregistrer une vue sur un produit
// POST /api/statistiques/produits/:produitId/vue
router.post("/produits/:produitId/vue", vueProduit);

// Ajouter un produit au panier
// POST /api/statistiques/produits/:produitId/ajout-panier
router.post("/produits/:produitId/ajout-panier", ajoutPanier);

// Ajouter une commande pour un produit
// POST /api/statistiques/produits/:produitId/commande
router.post("/produits/:produitId/commande", commandeProduit);

// ======= Récupération des événements =======

// Récupérer tous les événements d'un produit
// GET /api/statistiques/produits/:produitId/events
router.get("/produits/:produitId/events", getProduitEvents);

export default router;
