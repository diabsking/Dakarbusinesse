import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";

// Import des routeurs
import authRoutes from "./routes/auth.routes.js";
import produitsRoutes from "./routes/produits.routes.js";
import avisRoutes from "./routes/avis.routes.js";



const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ⚠️ Les routes Auth doivent être **avant le middleware 404**
app.use("/api/vendeur/auth", authRoutes);
app.use("/api/produits", produitsRoutes);
app.use("/api/avis", avisRoutes);

// Route test simple
app.get("/test-app", (req, res) => res.send("APP OK"));

// Health check
app.get("/api/health", (req, res) => res.json({ status: "OK", message: "API Kolwaz opérationnelle" }));

// Middleware 404 en dernier
app.use((req, res) => res.status(404).json({ error: "Route non trouvée" }));

export default app;
