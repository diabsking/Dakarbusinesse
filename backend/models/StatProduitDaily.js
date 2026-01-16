import mongoose from "mongoose";

const statProduitDailySchema = new mongoose.Schema(
  {
    produit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Produit",
      required: true,
      index: true,
    },

    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },

    vues: { type: Number, default: 0 },
    ajoutsPanier: { type: Number, default: 0 },
    commandes: { type: Number, default: 0 },
    chiffreAffaires: { type: Number, default: 0 },
  },
  { timestamps: true }
);

statProduitDailySchema.index({ produit: 1, date: 1 }, { unique: true });

export default mongoose.model("StatProduitDaily", statProduitDailySchema);
