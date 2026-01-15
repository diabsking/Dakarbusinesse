import mongoose from "mongoose";

const periodeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["jour", "semaine", "mois", "annee"],
      required: true,
    },

    debut: {
      type: Date,
      required: true,
    },

    fin: {
      type: Date,
      required: true,
    },

    // Facilite les requêtes rapides
    jour: Number,     // 1 – 31
    semaine: Number,  // 1 – 53
    mois: Number,     // 1 – 12
    annee: Number,    // 2024, 2025...
  },
  { _id: false }
);

const statistiqueSchema = new mongoose.Schema(
  {
    vendeur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendeur",
      required: true,
      index: true,
    },

    periode: {
      type: periodeSchema,
      required: true,
    },

    /* ================= COMMANDES ================= */
    commandes: {
      total: { type: Number, default: 0 },
      livrees: { type: Number, default: 0 },
      annulees: { type: Number, default: 0 },
    },

    /* ================= PRODUITS ================= */
    produits: {
      vendus: { type: Number, default: 0 }, // quantité totale
      distincts: { type: Number, default: 0 },
    },

    /* ================= CHIFFRE D'AFFAIRES ================= */
    chiffreAffaires: {
      type: Number,
      default: 0, // Somme des commandes livrées
    },

    /* ================= CLIENTS ================= */
    clients: {
      total: { type: Number, default: 0 }, // clients uniques (telephone)
    },

    /* ================= META ================= */
    actif: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/* ===== Unicité vendeur + période ===== */
statistiqueSchema.index(
  {
    vendeur: 1,
    "periode.type": 1,
    "periode.debut": 1,
    "periode.fin": 1,
  },
  { unique: true }
);

export default mongoose.model("Statistique", statistiqueSchema);
