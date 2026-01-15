import axios from "axios";

/**
 * Envoi d’un SMS via l’API Orange
 * @param {string} telephone - Numéro au format international complet (ex: 221770000000)
 * @param {string} message - Message texte à envoyer
 * @returns {Promise<boolean>} true si le SMS a été envoyé, false sinon
 */
export const envoyerSMSOrange = async (telephone, message) => {
  try {
    const token = process.env.ORANGE_ACCESS_TOKEN;
    const sender = process.env.ORANGE_SENDER_NUMBER; // ex: tel:+221770000000

    // Vérification simple du format du numéro
    if (!/^\d{9,15}$/.test(telephone)) {
      throw new Error("Numéro de téléphone invalide");
    }

    const url =
      "https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B221XXXXXXXX/requests";

    const data = {
      outboundSMSMessageRequest: {
        address: `tel:+${telephone}`,
        senderAddress: sender,
        outboundSMSTextMessage: { message },
      },
    };

    await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return true; // SMS envoyé avec succès
  } catch (error) {
    console.error("Erreur SMS Orange :", error.response?.data || error.message);
    return false; // échec de l'envoi
  }
};
