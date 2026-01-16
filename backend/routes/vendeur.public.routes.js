import express from "express";
import { obtenirProfilVendeur } from "../controllers/vendeur.public.controller.js";

const router = express.Router();

/* =====================
   ROUTES PUBLIQUES VENDEUR
===================== */

router.get("/vendeur/:id", (req, res, next) => {
  console.log("📥 ROUTE PUBLIQUE VENDEUR HIT");
  console.log("🆔 ID reçu :", req.params.id);
  next();
}, obtenirProfilVendeur);

export default router;
