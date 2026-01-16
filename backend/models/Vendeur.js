import mongoose from "mongoose";

const vendeurSchema = new mongoose.Schema(
  {
    // =====================
    // IDENTITÉ
    // =====================
    nomVendeur: {
      type: String,
      required: true,
      trim: true,
    },

    telephone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
    },

    // =====================
    // BOUTIQUE
    // =====================
    nomBoutique: {
      type: String,
      trim: true,
      default: "",
    },

    typeBoutique: {
      type: String,
      enum: ["Physique", "En ligne", "Les deux"],
      default: "En ligne",
    },

    adresseBoutique: {
      type: String,
      trim: true,
      default: "",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    // =====================
    // AVATAR (Cloudinary)
    // =====================
    avatar: {
      type: String,
      default: "/avatar-default.png",
    },

    avatarPublicId: {
      type: String,
      default: "",
    },

    // =====================
    // USER (OPTIONNEL)
    // =====================
    user: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true,
      sparse: true, // ✅ empêche conflit user:null
    },

    // =====================
    // STATUTS
    // =====================
    certifie: {
      type: Boolean,
      default: false,
    },

    actif: {
      type: Boolean,
      default: true,
    },

    compteSupprime: {
      type: Boolean,
      default: false,
    },

    // =====================
    // CERTIFICATION PAYANTE
    // =====================
    certification: {
      statut: {
        type: String,
        enum: ["none", "pending", "approved", "rejected"],
        default: "none",
      },

      paiementId: {
        type: String,
        default: null,
      },

      dateCertification: {
        type: Date,
        default: null,
      },
    },

    // =====================
    // DEMANDE CERTIFICATION
    // =====================
    demandeCertification: {
      type: Boolean,
      default: false,
    },

    dateDemandeCertification: {
      type: Date,
      default: null,
    },

    // =====================
    // OTP (EMAIL)
    // =====================
    otp: {
      type: Number,
      default: null,
    },

    otpExpire: {
      type: Date,
      default: null,
    },

    emailVerifie: {
      type: Boolean,
      default: false,
    },

    // =====================
    // RESET MOT DE PASSE
    // =====================
    resetCode: {
      type: Number,
      default: null,
    },

    resetCodeExpire: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Vendeur", vendeurSchema);
