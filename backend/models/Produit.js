import mongoose from "mongoose";

const produitSchema = new mongoose.Schema(
  {
    /* ================= LIENS ================= */
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
      required: true,
    },

    categorie: {
      type: String,
      required: true,
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
      required: true,
    },

    origine: {
      type: String,
      enum: ["Local", "Vient de l’étranger"],
      required: true,
    },

    paysOrigine: {
      type: String,
      default: null,
    },

    /* ================= PRIX ================= */
    prixInitial: {
      type: Number,
      required: true,
    },

    prixActuel: {
      type: Number,
      required: true,
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
      required: true,
      min: 0,
    },

    delaiLivraison: {
      type: String,
      required: true,
    },

    /* ================= IMAGES ================= */
    images: {
      type: [String],
      validate: {
        validator: function (val) {
          return val.length >= 4 && val.length <= 6;
        },
        message: "Le produit doit avoir entre 4 et 6 images",
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
      default: 0, // calculé (commandes + vues + boost)
    },

    /* ================= STATUT ================= */
    actif: {
      type: Boolean,
      default: true,
    },

    /* ================= MODÉRATION ================= */
    publie: {
      type: Boolean,
      default: false, // true après paiement Wave
    },

    fraisPublicationPayes: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Produit", produitSchema);
