import express from "express";
import {
  demandeCertification,
  getDemandesCertification,
  validerDemandeCertification,
  refuserDemandeCertification,
} from "../controllers/certification.controller.js";

const router = express.Router();

/* =======================
   ROUTES VENDEUR
======================= */
router.post("/demande", demandeCertification);

/* =======================
   ROUTES ADMIN
======================= */
router.get("/demandes", getDemandesCertification);
router.post("/valider", validerDemandeCertification);
router.post("/refuser", refuserDemandeCertification);

export default router;
