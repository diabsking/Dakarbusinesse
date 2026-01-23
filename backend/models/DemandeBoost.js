import mongoose from "mongoose";

const DemandeBoostSchema = new mongoose.Schema(
  {
    produit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Produit",
      required: true,
    },

    utilisateur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendeur",
      required: true,
    },

    waveNumber: {
      type: Number, // correction (String -> Number)
      required: true,
    },

    duree: {
      type: Number,
      required: true,
      enum: [7, 15, 30],
    },

    montant: {
      type: Number,
      required: true,
    },

    statut: {
      type: String,
      enum: ["EN_ATTENTE", "VALIDEE", "REFUSEE"],
      default: "EN_ATTENTE",
    },

    dateValidation: {
      type: Date,
    },

    // 🔥 Ajouts uniquement (pas de suppression)
    dateDebutBoost: {
      type: Date,
      default: null,
    },

    dateFinBoost: {
      type: Date,
      default: null,
    },

    motifRefus: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("DemandeBoost", DemandeBoostSchema);
