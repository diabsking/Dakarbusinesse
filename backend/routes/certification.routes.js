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
router.post("/certification/valider/:id", validerDemandeCertification);
router.post("/certification/refuser/:id", refuserDemandeCertification);


export default router;
