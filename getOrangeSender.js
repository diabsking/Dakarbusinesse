// getOrangeSender.js
import axios from "axios";
import dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config();

const getOrangeSenderInfo = async () => {
  try {
    console.log("🔍 Base URL:", process.env.ORANGE_SMS_BASE_URL);
    console.log("🔍 Application ID (facultatif):", process.env.ORANGE_APP_ID);

    // 1️⃣ Récupérer le token OAuth2
    const tokenResponse = await axios.post(
      `${process.env.ORANGE_SMS_BASE_URL}/oauth/v3/token`,
      "grant_type=client_credentials",
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              `${process.env.ORANGE_CLIENT_ID}:${process.env.ORANGE_CLIENT_SECRET}`
            ).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const token = tokenResponse.data.access_token;
    console.log("✅ Token obtenu:", token);

    // 2️⃣ Vérifier les contrats SMS
    const response = await axios.get(
      `${process.env.ORANGE_SMS_BASE_URL}/sms/admin/v1/contracts`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("📡 Réponse brute Orange:", JSON.stringify(response.data, null, 2));

    // 3️⃣ Filtrer les contrats approuvés/actifs
    if (Array.isArray(response.data)) {
      response.data.forEach(contract => {
        console.log("\n==============================");
        console.log("📌 Application ID:", contract.applicationId);
        console.log("➡️ Statut:", contract.status);
        console.log("➡️ Offre:", contract.offerName);
        console.log("➡️ Pays:", contract.country);

        if (contract.status === "APPROVED" || contract.status === "ACTIVE") {
          console.log("✅ Contrat utilisable pour SMS !");
          if (contract.serviceContracts && contract.serviceContracts.length > 0) {
            contract.serviceContracts.forEach(sc => {
              console.log("📤 SenderAddress attribué:", sc.serviceId);
            });
          } else {
            console.log("⚠️ Pas encore de senderAddress visible (vérifie ton quota SMS).");
          }
        } else {
          console.log("⏳ Contrat non actif (status:", contract.status, ")");
        }
      });
    } else {
      console.log("⚠️ Aucun contrat SMS trouvé.");
    }
  } catch (err) {
    console.error("❌ Erreur récupération sender:", err.response?.data || err.message);
  }
};

getOrangeSenderInfo();
