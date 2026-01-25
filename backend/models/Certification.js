import mongoose from "mongoose";

const certificationSchema = new mongoose.Schema(
  {
    vendeur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendeur",
      required: true,
      unique: true, // 1 certification par vendeur
    },

    /* =====================
       STATUT CERTIFICATION
    ===================== */
    statut: {
      type: String,
      enum: ["pending", "active", "suspended", "rejected"],
      default: "pending",
      index: true,
    },

    /* =====================
       DATES
    ===================== */
    dateDemande: {
      type: Date,
      default: Date.now,
    },

    dateActivation: {
      type: Date,
      default: null,
    },

    dateExpiration: {
      type: Date, // fin de validité
      default: null,
    },

    /* =====================
       MONTANTS
    ===================== */
    montantInitial: {
      type: Number,
      default: 5000,
    },

    montantMensuel: {
      type: Number,
      default: 1000,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Certification", certificationSchema);
