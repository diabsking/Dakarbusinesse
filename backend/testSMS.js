import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Vendor from "./models/Vendeur.js"; // chemin vers ton modèle Vendeur
import { envoyerOTPSMS } from "./services/orangeService.js"; // ton service SMS

// =====================
// Connexion MongoDB
// =====================
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/kolwaz";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("🟢 MongoDB connecté"))
  .catch((err) => console.error("❌ Erreur MongoDB :", err));

// =====================
// Fonction test SMS
// =====================
const testSMS = async (telephone) => {
  try {
    // Récupérer le vendeur avec ou sans préfixe
    let vendeur = await Vendor.findOne({ telephone });
    
    // Si pas trouvé, essayer avec 221 en préfixe
    if (!vendeur) {
      const telephoneAvec221 = telephone.startsWith("221") ? telephone : "221" + telephone;
      vendeur = await Vendor.findOne({ telephone: telephoneAvec221 });

      if (vendeur) {
        console.log(`⚡ Numéro trouvé avec ajout du préfixe 221 : ${telephoneAvec221}`);
        telephone = telephoneAvec221; // pour l'envoi du SMS
      }
    }

    if (!vendeur) {
      console.log("❌ Vendeur introuvable :", telephone);
      return;
    }

    // Génération OTP 6 chiffres
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Sauvegarde OTP dans la DB
    vendeur.otp = otp;
    vendeur.otpExpire = Date.now() + 10 * 60 * 1000; // 10 min
    await vendeur.save();

    // Envoi SMS
    const smsEnvoye = await envoyerOTPSMS(telephone, otp);

    console.log(
      smsEnvoye
        ? `✅ SMS envoyé avec succès à ${telephone}. OTP=${otp}`
        : `❌ Échec envoi SMS à ${telephone}`
    );

    process.exit(0); // fermer Node après test
  } catch (err) {
    console.error("🔥 Erreur testSMS :", err);
    process.exit(1);
  }
};

// =====================
// UTILISATION
// =====================

// Remplace par le numéro de ton vendeur existant (même sans 221)
const numeroTest = "+221789024121";
testSMS(numeroTest);
