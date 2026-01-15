import mongoose from "mongoose";

const statProduitEventSchema = new mongoose.Schema(
  {
    produit: { type: mongoose.Schema.Types.ObjectId, ref: "Produit" },
    type: {
      type: String,
      enum: ["VIEW", "PANIER", "COMMANDE", "BOOST"],
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ip: String,
    userAgent: String,
  },
  { timestamps: true }
);

export default mongoose.model("StatProduitEvent", statProduitEventSchema);
