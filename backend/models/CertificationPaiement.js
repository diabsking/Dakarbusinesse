import mongoose from "mongoose";

const certificationPaiementSchema = new mongoose.Schema(
  {
    certification: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Certification",
      required: true,
      index: true,
    },

    vendeur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendeur",
      required: true,
      index: true,
    },

    // =====================
    // TYPE DE PAIEMENT
    // =====================
    type: {
      type: String,
      enum: ["initial", "mensuel"],
      required: true,
    },

    montant: {
      type: Number,
      required: true,
    },

    // =====================
    // WAVE (MANUEL)
    // =====================
    methodePaiement: {
      type: String,
      enum: ["wave"],
      default: "wave",
    },

    referencePaiement: {
      type: String,
      default: "", // renseigné par l’admin
    },

    // =====================
    // STATUT
    // =====================
    statut: {
      type: String,
      enum: ["pending", "validated", "rejected"],
      default: "pending",
      index: true,
    },

    // =====================
    // DATES
    // =====================
    datePaiement: {
      type: Date,
      default: null,
    },

    dateValidation: {
      type: Date,
      default: null,
    },

    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "CertificationPaiement",
  certificationPaiementSchema
);
