import express from "express";
console.log("✅ auth.routes.js chargé");

import {
  inscriptionVendeur,
  connexionVendeur,
  vendeurConnecte,
  supprimerCompte,
  updateProfilVendeur,
  supprimerAvatar,
  obtenirProfilVendeurParId,
  verifierOTP,
  renvoyerOTP,      
  forgotPassword,          // ✅ AJOUTÉ
  verifyResetCode,         // ✅ AJOUTÉ
  resetPassword,           // ✅ AJOUTÉ
} from "../controllers/auth.controller.js";

import authentification from "../middleware/authentification.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

/* =====================
   LOG ROUTER (DEBUG)
===================== */
router.use((req, res, next) => {
  console.log(`[AUTH] ${req.method} ${req.originalUrl}`);
  next();
});

/* =====================
   ROUTES TEST
===================== */
router.get("/test", (req, res) => {
  res.json({
    status: "OK",
    module: "AUTH",
    message: "Auth routes fonctionnelles",
  });
});

/* =====================
   AUTH PUBLIC
===================== */
router.post("/register", inscriptionVendeur);
router.post("/login", connexionVendeur);

/* =====================
   OTP EMAIL
===================== */
router.post("/verify-otp", verifierOTP);     // validation du code
router.post("/resend-otp", renvoyerOTP);     // bouton "Renvoyer le code"

/* =====================
   MOT DE PASSE OUBLIÉ
===================== */
router.post("/forgot-password", forgotPassword);      // envoi du code
router.post("/verify-reset-code", verifyResetCode);   // vérification code OTP
router.post("/reset-password", resetPassword);        // réinitialisation mot de passe

/* =====================
   VENDEUR CONNECTÉ
===================== */
router.get("/me", authentification, vendeurConnecte);

/* =====================
   PROFIL (PRIVÉ)
===================== */
router.put(
  "/profile",
  authentification,
  upload.single("avatar"),
  updateProfilVendeur
);

/* =====================
   PROFIL VENDEUR PUBLIC
===================== */
router.get("/public/vendeur/:id", obtenirProfilVendeurParId);

/* =====================
   COMPTE
===================== */
router.delete("/delete", authentification, supprimerCompte);
router.delete("/avatar", authentification, supprimerAvatar);

/* =====================
   BLOQUAGE GET NAVIGATEUR
===================== */
router.get("/register", (_, res) =>
  res.status(405).json({ message: "Utiliser POST" })
);
router.get("/login", (_, res) =>
  res.status(405).json({ message: "Utiliser POST" })
);
router.get("/verify-otp", (_, res) =>
  res.status(405).json({ message: "Utiliser POST" })
);
router.get("/resend-otp", (_, res) =>
  res.status(405).json({ message: "Utiliser POST" })
);

export default router;
