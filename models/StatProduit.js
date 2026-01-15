import mongoose from "mongoose";

const statProduitSchema = new mongoose.Schema(
  {
    produit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Produit",
      unique: true,
      required: true,
    },

    vendeur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendeur",
      required: true,
    },

    /* ===== TRAFIC ===== */
    vuesTotales: { type: Number, default: 0 },
    vuesUniques: { type: Number, default: 0 },

    /* ===== CONVERSION ===== */
    ajoutsPanier: { type: Number, default: 0 },
    commandes: { type: Number, default: 0 },

    /* ===== FINANCE ===== */
    chiffreAffaires: { type: Number, default: 0 },

    /* ===== BOOST ===== */
    boostActif: { type: Boolean, default: false },
    boostUtilisations: { type: Number, default: 0 },

    /* ===== SCORE ===== */
    scorePopularite: { type: Number, default: 0 },
    tauxConversion: { type: Number, default: 0 },
  },
  { timestamps: true }
);

/* ================= CALCULS AUTO ================= */
statProduitSchema.methods.recalculer = function () {
  this.tauxConversion =
    this.vuesTotales > 0
      ? Number(((this.commandes / this.vuesTotales) * 100).toFixed(2))
      : 0;

  this.scorePopularite =
    this.vuesTotales * 1 +
    this.ajoutsPanier * 3 +
    this.commandes * 10 +
    (this.boostActif ? 30 : 0);
};

export default mongoose.model("StatProduit", statProduitSchema);
