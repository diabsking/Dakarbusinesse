import express from "express";
import {
  passerCommande,
  obtenirCommandesVendeur,
  modifierStatutCommande,
  obtenirCommandesClient,
  historiqueCommandes,
} from "../controllers/commande.controller.js";

import authentification from "../middleware/authentification.middleware.js";

const router = express.Router();

/* ================= COMMANDES CLIENT ================= */

// Passer commande (client – sans auth)
router.post("/", passerCommande);

// Obtenir commandes d’un client par téléphone
router.get("/client/:telephone", obtenirCommandesClient);

/* ================= COMMANDES VENDEUR ================= */

// Obtenir commandes du vendeur connecté
router.get("/vendeur", authentification, obtenirCommandesVendeur);

// Modifier statut d’une commande (vendeur connecté)
router.put("/:id/statut", authentification, modifierStatutCommande);

/* ================= ADMIN / HISTORIQUE ================= */

// Historique des commandes (admin ou client)
router.get("/historique", authentification, historiqueCommandes);

export default router;
