import Produit from "../models/Produit.js";

export const creerPaiementBoost = async (req, res) => {
  try {
    const { produitId, duree } = req.body;

    if (!produitId || !duree) {
      return res.status(400).json({ message: "Données manquantes" });
    }

    const produit = await Produit.findById(produitId);
    if (!produit) {
      return res.status(404).json({ message: "Produit introuvable" });
    }

    const tarifs = {
      7: 1000,
      15: 2000,
      30: 3500,
    };

    const montant = tarifs[duree];
    if (!montant) {
      return res.status(400).json({ message: "Durée invalide" });
    }

    const response = await fetch(
      "https://app.paydunya.com/api/v1/checkout-invoice/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "PAYDUNYA-MASTER-KEY": process.env.PAYDUNYA_MASTER_KEY,
          "PAYDUNYA-PRIVATE-KEY": process.env.PAYDUNYA_PRIVATE_KEY,
          "PAYDUNYA-TOKEN": process.env.PAYDUNYA_TOKEN,
        },
        body: JSON.stringify({
          invoice: {
            total_amount: montant,
            description: `Boost du produit ${produit.nom}`,
          },
          store: {
            name: "Kolwaz",
            tagline: "Boost produit",
            phone: "770000000",
          },
          actions: {
            callback_url:
              "http://localhost:5000/api/paiements/paydunya/callback",
            return_url: "http://localhost:5173/dashboard",
            cancel_url: "http://localhost:5173/dashboard",
          },
        }),
      }
    );

    const data = await response.json();
    console.log("📩 PAYDUNYA RESPONSE :", data);

    if (!response.ok) {
      return res.status(400).json(data);
    }

    res.json({
      invoice_url: data.response_text,
    });
  } catch (error) {
    console.error("❌ Erreur paiement boost :", error);
    res.status(500).json({ message: "Erreur serveur paiement" });
  }
};


export const callbackPaydunya = async (req, res) => {
  try {
    console.log("🔔 Callback PayDunya reçu :", req.body);
    res.status(200).end();
  } catch (err) {
    console.error("Erreur callback PayDunya :", err);
    res.status(500).end();
  }
};
