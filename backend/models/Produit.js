import mongoose from "mongoose";

const produitSchema = new mongoose.Schema(
  {
    /* ================= LIENS ================= */
    vendeur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendeur",
    },

    /* ================= INFOS PRODUIT ================= */
    nom: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
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
    },

    etat: {
      type: String,
      enum: ["Neuf", "Occasion"],
    },

    origine: {
      type: String,
      enum: ["Local", "Vient de l’étranger"],
    },

    paysOrigine: {
      type: String,
      default: null,
    },

    /* ================= PRIX ================= */
    prixInitial: {
      type: Number,
    },

    prixActuel: {
      type: Number,
    },

    enPromotion: {
      type: Boolean,
      default: false,
    },

    dateDebutPromotion: {
      type: Date,
      default: null,
    },

    dateFinPromotion: {
      type: Date,
      default: null,
    },

    /* ================= STOCK & LIVRAISON ================= */
    stock: {
      type: Number,
      min: 0,
    },

    delaiLivraison: {
      type: String,
    },

    /* ================= IMAGES ================= */
    images: {
      type: [String],
      validate: {
        validator: function (val) {
          return Array.isArray(val) && val.length >= 1 && val.length <= 6;
        },
        message: "Le produit doit avoir entre 1 et 6 images",
      },
      required: true,
    },

    /* ================= VISIBILITÉ & BOOST ================= */
    estBooster: {
      type: Boolean,
      default: false,
    },

    dateDebutBoost: {
      type: Date,
      default: null,
    },

    dateFinBoost: {
      type: Date,
      default: null,
    },

    /* ================= STATISTIQUES ================= */
    nombreVues: {
      type: Number,
      default: 0,
    },

    nombreCommandes: {
      type: Number,
      default: 0,
    },

    scorePopularite: {
      type: Number,
      default: 0,
    },

    /* ================= STATUT ================= */
    actif: {
      type: Boolean,
      default: true,
    },

    /* ================= MODÉRATION ================= */
    publie: {
      type: Boolean,
      default: false,
    },

    fraisPublicationPayes: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Produit", produitSchema);
