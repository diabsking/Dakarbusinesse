import Vendeur from "../models/Vendeur.js";
import Certification from "../models/Certification.js";
import CertificationPaiement from "../models/CertificationPaiement.js";

/* =======================
   1️⃣ DEMANDE DE CERTIFICATION (VENDEUR)
======================= */
export const demandeCertification = async (req, res) => {
  console.log("🚀 [CERTIFICATION] demandeCertification");

  try {
    if (!req.vendeur?.id) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    const vendeur = await Vendeur.findById(req.vendeur.id);
    if (!vendeur) {
      return res.status(404).json({ message: "Vendeur introuvable" });
    }

    // Déjà certifié
    if (vendeur.certifie === true) {
      return res.status(400).json({ message: "Vous êtes déjà certifié" });
    }

    // Cherche ou crée la certification
    let certification = await Certification.findOne({ vendeur: vendeur._id });

    if (!certification) {
      certification = new Certification({
        vendeur: vendeur._id,
        statut: "pending",
        dateDemande: new Date(),
      });
    } else {
      // Remise en attente si nouvelle demande
      certification.statut = "pending";
      certification.dateDemande = new Date();
      certification.dateActivation = null;
      certification.dateExpiration = null;
    }

    await certification.save();

    // Paiement initial (optionnel : vérifier s’il existe déjà)
    const paiement = new CertificationPaiement({
      certification: certification._id,
      vendeur: vendeur._id,
      type: "initial",
      montant: certification.montantInitial,
      statut: "pending",
    });

    await paiement.save();

    // MAJ vendeur
    vendeur.demandeCertification = true;
    vendeur.dateDemandeCertification = new Date();
    await vendeur.save();

    res.json({
      message: "Demande de certification envoyée avec succès",
      certification,
    });
  } catch (err) {
    console.error("🔥 ERREUR demandeCertification :", err);
    res.status(500).json({
      message: "Erreur lors de la demande de certification",
    });
  }
};

/* =======================
   2️⃣ GET DEMANDES CERTIFICATION (ADMIN)
======================= */
export const getDemandesCertification = async (req, res) => {
  console.log("📥 [ADMIN] getDemandesCertification");

  try {
    const demandes = await Certification.find({ statut: "pending" })
      .populate("vendeur", "nomVendeur email nomBoutique")
      .sort({ dateDemande: -1 });

    res.json(demandes);
  } catch (err) {
    console.error("🔥 ERREUR getDemandesCertification :", err);
    res.status(500).json({
      message: "Erreur lors de la récupération des demandes",
    });
  }
};

/* =======================
   3️⃣ VALIDER DEMANDE (ADMIN)
   PUT /api/certification/:id/valider
======================= */
export const validerDemandeCertification = async (req, res) => {
  console.log("✅ [ADMIN] validerDemandeCertification");

  try {
    const { id } = req.params;
    const { paiementReference } = req.body;

    const certification = await Certification.findById(id);
    if (!certification) {
      return res.status(404).json({ message: "Certification introuvable" });
    }

    if (certification.statut !== "pending") {
      return res.status(400).json({
        message: "Cette demande ne peut plus être validée",
      });
    }

    const paiement = await CertificationPaiement.findOne({
      certification: certification._id,
      type: "initial",
    });

    if (!paiement) {
      return res.status(404).json({
        message: "Paiement initial introuvable",
      });
    }

    paiement.statut = "validated";
    paiement.referencePaiement = paiementReference || "";
    paiement.dateValidation = new Date();
    await paiement.save();

    certification.statut = "active";
    certification.dateActivation = new Date();

    const dateFin = new Date();
    dateFin.setMonth(dateFin.getMonth() + 1);
    certification.dateExpiration = dateFin;

    await certification.save();

    const vendeur = await Vendeur.findById(certification.vendeur);
    vendeur.certifie = true;
    vendeur.demandeCertification = false;
    await vendeur.save();

    res.json({
      message: "Demande de certification validée",
    });
  } catch (err) {
    console.error("🔥 ERREUR validerDemandeCertification :", err);
    res.status(500).json({
      message: "Erreur lors de la validation de la demande",
    });
  }
};

/* =======================
   4️⃣ REFUSER DEMANDE (ADMIN)
   PUT /api/certification/:id/refuser
======================= */
export const refuserDemandeCertification = async (req, res) => {
  console.log("❌ [ADMIN] refuserDemandeCertification");

  try {
    const { id } = req.params;
    const { commentaireAdmin } = req.body;

    const certification = await Certification.findById(id);
    if (!certification) {
      return res.status(404).json({ message: "Certification introuvable" });
    }

    certification.statut = "rejected";
    await certification.save();

    const vendeur = await Vendeur.findById(certification.vendeur);
    vendeur.demandeCertification = false;
    vendeur.certifie = false;
    await vendeur.save();

    res.json({
      message: "Demande de certification refusée",
      commentaireAdmin,
    });
  } catch (err) {
    console.error("🔥 ERREUR refuserDemandeCertification :", err);
    res.status(500).json({
      message: "Erreur lors du refus de la demande",
    });
  }
};
