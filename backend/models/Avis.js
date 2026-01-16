// models/Avis.js
import mongoose from "mongoose";

const avisSchema = new mongoose.Schema(
  {
    produit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Produit",
      required: true,
    },
    clientNom: {
      type: String,
      required: true,
    },
    clientPhone: {
      type: String,
      required: true,
    },
    note: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    commentaire: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Avis = mongoose.model("Avis", avisSchema);

export default Avis;
