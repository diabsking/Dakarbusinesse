// routes/upload.routes.js
import express from "express";
import {
  uploadImageProduit,
  uploadImageProfil,
} from "../controllers/upload.controller.js";

import authentification from "../middleware/authentification.middleware.js";
import upload from "../middleware/upload.middleware.js";

const routeur = express.Router();

/**
 * UPLOADS IMAGES
 */

// Upload images produits (jusqu’à 5 fichiers)
routeur.post(
  "/produit",
  authentification,
  upload.array("images", 5),
  uploadImageProduit
);

// Upload image profil vendeur (1 fichier)
routeur.post(
  "/profil",
  authentification,
  upload.single("avatar"),
  uploadImageProfil
);

export default routeur;
