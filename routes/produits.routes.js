import express from "express";

/* ===== Controllers ===== */
import {
  ajouterProduit,
  obtenirTousProduits,
  obtenirProduitParID,
  modifierProduit,
  supprimerProduit,
  obtenirProduitsDuVendeurConnecte,
  obtenirProduitsEnPromotion,
  obtenirProduitsBoostes,
  obtenirProduitsPlusCommandes,
  produitsSimilaires,
  incrementerVuesProduit,
} from "../controllers/produit.controller.js";

/* ===== Middlewares ===== */
import authentification from "../middleware/authentification.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

/* =====================================================
   TEST NAVIGATEUR
===================================================== */
router.get("/test", (req, res) => {
  res.json({
    status: "OK",
    module: "PRODUITS",
    message: "Routes produits fonctionnelles",
  });
});

/* =====================================================
   ROUTES PUBLIQUES
===================================================== */
router.get("/", obtenirTousProduits); // tous les produits
router.get("/promotions", obtenirProduitsEnPromotion); // produits en promotion
router.get("/boostes", obtenirProduitsBoostes); // produits boostés
router.get("/top-commandes", obtenirProduitsPlusCommandes); // top commandes
router.get("/similaires/:id", produitsSimilaires); // produits similaires
router.put("/vue/:id", incrementerVuesProduit); // incrémenter vues

/* =====================================================
   ROUTES PROTÉGÉES VENDEUR
===================================================== */
router.get(
  "/mes-produits",
  authentification,
  obtenirProduitsDuVendeurConnecte
);

router.post(
  "/",
  authentification,
  upload.array("images", 6),
  ajouterProduit
);

router.put(
  "/:id",
  authentification,
  upload.array("images", 6),
  modifierProduit
);

router.delete(
  "/:id",
  authentification,
  supprimerProduit
);

/* =====================================================
   ROUTE DYNAMIQUE : produit par ID (TOUJOURS À LA FIN)
===================================================== */
router.get("/:id", obtenirProduitParID);

export default router;
