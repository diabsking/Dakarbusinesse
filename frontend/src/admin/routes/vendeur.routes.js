import express from "express";
import * as vendeurController from "../controllers/admin.vendeur.controller.js";

const router = express.Router();

/**
 * GET /api/admin/vendeurs
 */
router.get("/", vendeurController.listerVendeurs);

/**
 * PATCH /api/admin/vendeurs/:id/statut
 */
router.patch(
  "/:id/statut",
  vendeurController.changerStatutVendeur
);

/**
 * PATCH /api/admin/vendeurs/:id/certification
 */
router.patch(
  "/:id/certification",
  vendeurController.changerCertificationVendeur
);

/**
 * GET /api/admin/vendeurs/:id/stats
 */
router.get(
  "/:id/stats",
  vendeurController.statsVendeur
);

export default router;
