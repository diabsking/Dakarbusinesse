/**
 * Test : vérifier les crédits SMS (bundles) Orange
 * Usage : node checkSmsCredits.js
 */

import axios from "axios";
import "dotenv/config";

/* ============================
   GÉNÉRER AUTH HEADER
============================ */
function getAuthHeader() {
  const raw = `${process.env.ORANGE_CLIENT_ID}:${process.env.ORANGE_CLIENT_SECRET}`;
  const encoded = Buffer.from(raw).toString("base64");
  return `Basic ${encoded}`;
}

/* ============================
   OBTENIR TOKEN OAUTH
============================ */
async function getOrangeToken() {
  const res = await axios.post(
    "https://api.orange.com/oauth/v3/token",
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
    }
  );

  return res.data.access_token;
}

/* ============================
   RÉCUPÉRER CRÉDITS SMS
============================ */
async function checkSmsCredits() {
  try {
    const token = await getOrangeToken();

    const res = await axios.get(
      "https://api.orange.com/sms/admin/v1/contracts",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    console.log("📦 CRÉDITS SMS TROUVÉS :");
    console.log(JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error(
      "❌ ERREUR :",
      err.response?.data || err.message
    );
  }
}

/* ============================
   LANCER LE TEST
============================ */
checkSmsCredits();
