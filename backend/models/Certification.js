import mongoose from "mongoose";

const certificationSchema = new mongoose.Schema(
  {
    vendeur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendeur",
      required: true,
      // unique: true, // retiré pour éviter conflit sur plusieurs demandes
    },

    /* =====================
       STATUT CERTIFICATION
    ===================== */
    statut: {
      type: String,
      enum: ["pending", "active", "suspended", "rejected"],
      default: "pending",
      index: true, // index pour filtrage rapide
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
      type: Date,
      default: null, // fin de validité
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
    timestamps: true, // createdAt & updatedAt
  }
);

export default mongoose.model("Certification", certificationSchema);
