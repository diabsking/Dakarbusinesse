import mongoose from "mongoose";

/* ===== Produit dans une commande ===== */
const produitSchema = new mongoose.Schema({
  produitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Produit",
    required: true,
  },
  vendeur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendeur",
    required: true,
  },
  nom: { type: String, required: true },
  image: { type: String, required: true },
  quantite: { type: Number, required: true, default: 1 },
  prix: { type: Number, required: true },
});

/* ===== Historique status ===== */
const historiqueStatusSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["en cours", "en préparation", "livré", "annulé"],
    required: true,
  },
  date: { type: Date, default: Date.now },
});

/* ===== Paiement ===== */
const paiementSchema = new mongoose.Schema({
  montant: { type: Number, required: true },
  mode: { type: String, enum: ["Carte", "Cash", "Wave", "OrangeMoney"], default: "Cash" },
  statut: { type: String, enum: ["en attente", "payé", "échoué"], default: "en attente" },
});

/* ===== Livraison ===== */
const livraisonSchema = new mongoose.Schema({
  adresseLivraison: { type: String },
  dateEstimee: { type: Date },
  livreur: { type: String },
  statut: { type: String, enum: ["préparé", "en cours", "livré"], default: "préparé" },
});

/* ===== Commande ===== */
const commandeSchema = new mongoose.Schema(
  {
    client: {
      nom: { type: String, required: true },
      telephone: { type: String, required: true },
      adresse: { type: String, required: true },
    },
    produits: { type: [produitSchema], required: true },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["en cours", "en préparation", "livré", "annulé"],
      default: "en cours",
    },
    historiqueStatus: [historiqueStatusSchema],
    paiement: paiementSchema,
    livraison: livraisonSchema,
    notes: { type: String, default: "" },
    actif: { type: Boolean, default: true },
  },
  { timestamps: true }
);
export default mongoose.model("Commande", commandeSchema);
