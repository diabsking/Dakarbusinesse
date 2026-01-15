import mongoose from "mongoose";
import Commande from "./models/Commande.js";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/kolwaz";

const supprimerCommandesAnciennes = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    // 📅 Date limite : commandes passées il y a 30 jours ou plus
    const dateLimite = new Date();
    dateLimite.setDate(dateLimite.getDate() - 30);

    const result = await Commande.deleteMany({
      createdAt: { $lte: dateLimite }, // 👈 COMMANDE ≥ 30 jours
    });

    console.log(
      `🧹 ${result.deletedCount} commandes (≥ 30 jours) supprimées`
    );

    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Erreur suppression commandes :", error);
    process.exit(1);
  }
};

// ▶️ Exécution
supprimerCommandesAnciennes();
