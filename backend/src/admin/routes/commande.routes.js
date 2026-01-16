import express from "express";
import * as commandeController from "../controllers/admin.commande.controller.js";

const router = express.Router();

/**
 * GET /api/admin/commandes
 */
router.get(
  "/",
  commandeController.toutesCommandes
);

/**
 * PATCH /api/admin/commandes/:id/status
 */
router.patch(
  "/:id/status",
  commandeController.modifierCommandeAdmin
);

export default router;
