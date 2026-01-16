import axios from "axios";
import Vendeur from "../models/Vendeur.js";

export const payerCertification = async (req, res) => {
  try {
    // ✅ BON ID (middleware)
    const vendeur = await Vendeur.findById(req.vendeur.id);

    if (!vendeur) {
      return res.status(404).json({ message: "Vendeur introuvable" });
    }

    if (vendeur.certifie === true) {
      return res.status(400).json({
        message: "Vous êtes déjà certifié",
      });
    }

    const invoice = {
      invoice: {
        total_amount: 3000,
        description: "Certification vendeur Kolwaz Shop",
      },
      store: {
        name: "Kolwaz Shop",
      },
      custom_data: {
        vendeur_id: vendeur._id.toString(),
        type: "certification",
      },
      actions: {
        callback_url: "http://localhost:5000/api/certification/webhook",
        return_url: "http://localhost:3000/certification/success",
        cancel_url: "http://localhost:3000/certification",
      },
    };

    const response = await axios.post(
      "https://app.paydunya.com/api/v1/checkout-invoice/create",
      invoice,
      {
        headers: {
          "Content-Type": "application/json",
          "PAYDUNYA-MASTER-KEY": process.env.PAYDUNYA_MASTER_KEY,
          "PAYDUNYA-PRIVATE-KEY": process.env.PAYDUNYA_PRIVATE_KEY,
          "PAYDUNYA-TOKEN": process.env.PAYDUNYA_TOKEN,
        },
      }
    );

    vendeur.certification = { statut: "pending" };
    await vendeur.save();

    res.json({
      payment_url: response.data.response_text,
    });
  } catch (error) {
    console.error("Erreur paiement certification :", error);
    res.status(500).json({
      message: "Erreur lors du paiement de la certification",
    });
  }
};

export const webhookCertification = async (req, res) => {
  try {
    const { status, custom_data } = req.body;

    if (status === "completed" && custom_data?.type === "certification") {
      const vendeur = await Vendeur.findById(custom_data.vendeur_id);
      if (!vendeur) return res.sendStatus(404);

      vendeur.certifie = true;
      vendeur.certification = {
        statut: "paid",
        date: new Date(),
      };

      await vendeur.save();
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Webhook certification erreur :", error);
    res.sendStatus(500);
  }
};
