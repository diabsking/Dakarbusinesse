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
      type: String,
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("DemandeBoost", DemandeBoostSchema);
