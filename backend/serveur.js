import "./config/env.js";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import cron from "node-cron";
import jwt from "jsonwebtoken";

// Routes
import authRoutes from "./routes/auth.routes.js";
import produitsRoutes from "./routes/produits.routes.js";
import avisRoutes from "./routes/avis.routes.js";
import commandeRoutes from "./routes/commandes.routes.js";
import statistiquesRoutes from "./routes/statistiques.routes.js";
import { genererStatistiquesVendeur } from "./controllers/statistique.service.js";
import paiementsRoutes from "./routes/paiements.routes.js";
import certificationRoutes from "./routes/certification.routes.js";
import vendeurPublicRoutes from "./routes/vendeur.public.routes.js";
import adminRoutes from "./src/admin/routes/index.js";

const app = express();

/* =====================================================
   🔍 LOG DÉMARRAGE
===================================================== */
console.log("🚀 Démarrage serveur Kolwaz...");
console.log("🌍 Environnement :", process.env.NODE_ENV || "development");
console.log("🗄️ Mongo URI :", process.env.MONGO_URI ? "OK" : "❌ MANQUANT");

/* =====================================================
   🔥 MIDDLEWARES
===================================================== */
app.use(express.json({ limit: "10mb" }));

// ✅ CORS compatible Render
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* =====================================================
   🔍 LOG REQUÊTES
===================================================== */
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `📥 ${req.method} ${req.originalUrl} → ${res.statusCode} (${duration}ms)`
    );
  });

  next();
});

/* =====================================================
   ⏰ CRON (⚠️ fiable uniquement en plan payant)
===================================================== */
cron.schedule("0 0 * * *", async () => {
  console.log("📊 [CRON] Génération automatique des statistiques...");
  try {
    await genererStatistiquesVendeur();
    console.log("✅ [CRON] Statistiques générées avec succès");
  } catch (err) {
    console.error("❌ [CRON] Erreur stats :", err.message);
  }
});

/* =====================================================
   🔐 AUTH ADMIN
===================================================== */
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Mot de passe requis",
    });
  }

  if (!process.env.ADMIN_PASSWORD || !process.env.JWT_SECRET) {
    return res.status(500).json({
      success: false,
      message: "Configuration serveur manquante",
    });
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({
      success: false,
      message: "Mot de passe incorrect",
    });
  }

  const token = jwt.sign(
    { role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  res.json({
    success: true,
    token,
  });
});

/* =====================================================
   🛡️ MIDDLEWARE ADMIN
===================================================== */
const adminMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Token manquant",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Accès refusé",
      });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token invalide ou expiré",
    });
  }
};

// Route test admin
app.get("/api/admin/dashboard", adminMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Bienvenue dans le dashboard admin",
  });
});

/* =====================================================
   📌 ROUTES API
===================================================== */
app.use("/api/paiements", paiementsRoutes);
app.use("/api/vendeur/auth", authRoutes);
app.use("/api/produits", produitsRoutes);
app.use("/api/avis", avisRoutes);
app.use("/api/commandes", commandeRoutes);
app.use("/api/statistiques", statistiquesRoutes);
app.use("/api/certification", certificationRoutes);
app.use("/api", vendeurPublicRoutes);
app.use("/api/admin", adminRoutes);

/* =====================================================
   ❌ ROUTE NON TROUVÉE
===================================================== */
app.use((req, res) => {
  res.status(404).json({
    message: "Route non trouvée",
    method: req.method,
    path: req.originalUrl,
  });
});

/* =====================================================
   ❌ GESTION ERREURS GLOBALES
===================================================== */
app.use((err, req, res, next) => {
  console.error("🔥 Erreur serveur :", err.stack);
  res.status(500).json({
    message: "Erreur interne du serveur",
  });
});

/* =====================================================
   🚀 LANCEMENT SERVEUR + MONGODB
===================================================== */
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("🟢 MongoDB connecté avec succès");
    app.listen(PORT, () => {
      console.log(`✅ Serveur Kolwaz lancé sur le port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Erreur connexion MongoDB :", err.message);
    process.exit(1);
  });
