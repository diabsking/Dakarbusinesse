import express from "express";
import authentification from "../middleware/authentification.middleware.js";
import {
  payerCertification,
  webhookCertification,
} from "../controllers/certification.controller.js";

const router = express.Router();

router.post("/payer", authentification, payerCertification);
router.post("/webhook", webhookCertification);

export default router;
