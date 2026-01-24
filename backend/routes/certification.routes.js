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
router.post("/demande", demandeCertification);

/* =======================
   ROUTE WEBHOOK (PayDunya / Wave)
======================= */
router.post("/webhook", webhookCertification);

/* =======================
   ROUTES ADMIN
======================= */
router.get("/demandes", getDemandesCertification);
router.post("/valider", validerDemandeCertification);
router.post("/refuser", refuserDemandeCertification);

export default router;
