import express from "express";
import {
  demandeCertification,
  getDemandesCertification,
  validerDemandeCertification,
  refuserDemandeCertification,
  webhookCertification,
} from "../controllers/certification.controller.js";

const router = express.Router();

/* =======================
   ROUTES VENDEUR
======================= */
// Faire une demande de certification
router.post("/demande", demandeCertification);

/* =======================
   ROUTE WEBHOOK (PayDunya / Wave)
======================= */
router.post("/webhook", webhookCertification);

/* =======================
   ROUTES ADMIN
======================= */
// Récupérer toutes les demandes de certification
router.get("/demandes", getDemandesCertification);

// Valider une demande
router.post("/valider", validerDemandeCertification);

// Refuser une demande
router.post("/refuser", refuserDemandeCertification);

export default router;
