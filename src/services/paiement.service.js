import axios from "axios";

const API_URL = "http://localhost:5000/api/paiements";

/**
 * 💳 Paiement boost produit via Kkiapay / Wave
 * @param {Object} data - { produitId, duree }
 * @param {string} token - token d'authentification
 * @returns {Promise<{success: boolean, payment_url?: string, message?: string}>}
 */
export const payerBoostProduit = async (data, token) => {
  if (!token) {
    return { success: false, message: "Utilisateur non authentifié" };
  }

  try {
    const res = await axios.post(`${API_URL}/booster-produit`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Vérification stricte de la réponse
    const paymentLink = res?.data?.payment_url || res?.data?.invoice_url;

    if (!paymentLink) {
      console.warn("Paiement boost produit: lien introuvable", res.data);
      return { success: false, message: "Lien de paiement introuvable" };
    }

    return { success: true, payment_url: paymentLink };
  } catch (error) {
    console.error(
      "Erreur paiement boost produit:",
      error.response?.data || error.message
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Erreur lors du paiement du boost produit",
    };
  }
};
