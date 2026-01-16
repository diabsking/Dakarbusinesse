import express from "express";
import { statsGlobales } from "../controllers/admin.commande.controller.js";

const router = express.Router();

/**
 * GET /api/admin/stats
 */
router.get("/", statsGlobales);

export default router;
