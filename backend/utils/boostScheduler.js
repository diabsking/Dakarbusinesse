import cron from "node-cron";
import Produit from "../models/Produit.js";
import StatProduit from "../models/StatProduit.js";

/**
 * Vérifie toutes les minutes si des boosts ont expiré
 * et les désactive automatiquement.
 */
export const startBoostScheduler = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const maintenant = new Date();

      const produitsBoostes = await Produit.find({
        estBooster: true,
        dateFinBoost: { $lte: maintenant },
      });

      if (!produitsBoostes.length) return;

      for (const produit of produitsBoostes) {
        produit.estBooster = false;
        produit.dateDebutBoost = null;
        produit.dateFinBoost = null;
        await produit.save();

        const stat = await StatProduit.findOne({ produit: produit._id });
        if (stat) {
          stat.boostActif = false;
          await stat.save();
        }
      }

      console.log(`✅ Boosts expirés désactivés : ${produitsBoostes.length}`);
    } catch (err) {
      console.error("❌ Erreur scheduler boost:", err.message);
    }
  });
};
