import express from "express";
import {
  ajouterAvis,
  obtenirAvisProduit,
} from "../controllers/avis.controller.js";

const router = express.Router();

// ➕ Ajouter un avis
router.post("/", ajouterAvis);

// 📄 Avis d’un produit
router.get("/produit/:id", obtenirAvisProduit);

export default router;
