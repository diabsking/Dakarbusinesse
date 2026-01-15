import Vendeur from "../models/Vendeur.js";

/* =====================================================
   PROFIL VENDEUR PUBLIC (PAR ID)
===================================================== */
export const obtenirProfilVendeur = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("📡 Controller obtenirProfilVendeur");
    console.log("🆔 ID vendeur :", id);

    const vendeur = await Vendeur.findById(id).select(
      "nomVendeur nomBoutique avatar description adresseBoutique typeBoutique email telephone certifie actif"
    );

    console.log("📦 Résultat MongoDB :", vendeur);

    if (!vendeur) {
      console.log("❌ Aucun vendeur trouvé pour cet ID");
      return res.status(404).json({ message: "Vendeur introuvable" });
    }

    res.status(200).json(vendeur);
  } catch (error) {
    console.error("🔥 ERREUR obtenirProfilVendeur :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
