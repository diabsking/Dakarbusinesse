import jwt from "jsonwebtoken";
import Vendeur from "../models/Vendeur.js";

const authentification = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Accès refusé. Token manquant",
      });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        message: "Token invalide ou expiré",
      });
    }

    const vendeur = await Vendeur.findById(decoded.id).select("_id");

    if (!vendeur) {
      return res.status(401).json({
        message: "Vendeur non autorisé",
      });
    }

    req.vendeur = {
      id: vendeur._id.toString(),
    };

    next();
  } catch (error) {
    console.error("❌ Erreur serveur authentification :", error);
    return res.status(500).json({
      message: "Erreur serveur",
    });
  }
};

export default authentification;
