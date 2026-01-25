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
// POST /api/certification/demande
router.post("/demande", demandeCertification);

/* =======================
   ROUTES ADMIN
======================= */
// GET /api/certification/demandes
router.get("/demandes", getDemandesCertification);

// POST /api/certification/valider/:id
router.post("/valider/:id", validerDemandeCertification);

// POST /api/certification/refuser/:id
router.post("/refuser/:id", refuserDemandeCertification);

export default router;
