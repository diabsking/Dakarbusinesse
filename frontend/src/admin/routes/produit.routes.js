import express from "express";
import * as produitController from "../controllers/admin.produit.controller.js";

const router = express.Router();

/**
 * GET /api/admin/produits
 */
router.get("/", produitController.listerProduits);

/**
 * PATCH /api/admin/produits/:id/valider
 */
router.patch(
  "/:id/valider",
  produitController.validerProduit
);

/**
 * PATCH /api/admin/produits/:id/promo
 */
router.patch(
  "/:id/promo",
  produitController.mettreProduitEnPromo
);

/**
 * PATCH /api/admin/produits/:id/suspendre
 */
router.patch("/:id/suspendre", produitController.suspendreProduit);
router.put("/:id/suspendre", produitController.suspendreProduit);


export default router;
