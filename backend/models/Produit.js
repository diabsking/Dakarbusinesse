import mongoose from "mongoose";

const produitSchema = new mongoose.Schema(
  {
    vendeur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendeur",
      required: true,
    },

    /* ================= INFOS PRODUIT ================= */
    nom: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    categorie: {
      type: String,
      enum: [
        "Électronique",
        "Mode & Vêtements",
        "Maison",
        "Beauté",
        "Alimentation",
        "Autres",
      ],
      default: null,
    },

    etat: {
      type: String,
      enum: ["Neuf", "Occasion"],
      default: null,
    },

    origine: {
      type: String,
      enum: ["Local", "Vient de l’étranger"],
      default: null,
    },

    paysOrigine: {
      type: String,
      default: null,
    },

    /* ================= PRIX ================= */
    prixInitial: {
      type: Number,
      min: 0,
      default: null,
    },

    prixActuel: {
      type: Number,
      min: 0,
      default: null,
    },

    enPromotion: {
      type: Boolean,
      default: false,
    },

    /* 🔒 Au moins un prix obligatoire */
    _prixValidator: {
      type: Boolean,
      select: false,
      default: true,
      validate: {
        validator: function () {
          return this.prixInitial != null || this.prixActuel != null;
        },
        message: "Au moins un prix est obligatoire",
      },
    },

    /* ================= STOCK & LIVRAISON ================= */
    stock: {
      type: Number,
      min: 0,
      default: null,
    },

    delaiLivraison: {
      type: String,
      default: null,
    },

    /* ================= IMAGES ================= */
    images: {
      type: [String],
      required: true,
      validate: {
        validator: function (val) {
          return val.length >= 1 && val.length <= 6;
        },
        message: "Le produit doit avoir entre 1 et 6 images",
      },
    },

    /* ================= VISIBILITÉ & BOOST ================= */
    estBooster: { type: Boolean, default: false },
    dateDebutBoost: { type: Date, default: null },
    dateFinBoost: { type: Date, default: null },

    /* ================= STATISTIQUES ================= */
    nombreVues: { type: Number, default: 0 },
    nombreCommandes: { type: Number, default: 0 },
    scorePopularite: { type: Number, default: 0 },

    /* ================= STATUT ================= */
    actif: { type: Boolean, default: true },
    publie: { type: Boolean, default: false },
    fraisPublicationPayes: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Produit", produitSchema);
