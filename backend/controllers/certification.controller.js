import Vendeur from "../models/Vendeur.js";
import Certification from "../models/Certification.js";
import CertificationPaiement from "../models/CertificationPaiement.js";

/* =======================
   1️⃣ DEMANDE DE CERTIFICATION
======================= */
export const demandeCertification = async (req, res) => {
  console.log("🚀 [CERTIFICATION] demandeCertification appelé");

  try {
    const { vendeurId } = req.body;
    console.log("Vendeur ID reçu :", vendeurId);

    if (!vendeurId) {
      console.warn("❌ vendeurId manquant");
      return res.status(400).json({ message: "ID vendeur requis" });
    }

    const vendeur = await Vendeur.findById(vendeurId);
    console.log("Vendeur trouvé :", vendeur ? vendeur.email : "❌ Aucun vendeur");

    if (!vendeur) {
      return res.status(404).json({ message: "Vendeur introuvable" });
    }

    if (vendeur.certifie === true) {
      console.warn("❌ Vendeur déjà certifié");
      return res.status(400).json({ message: "Vous êtes déjà certifié" });
    }

    const existingCertification = await Certification.findOne({
      vendeur: vendeur._id,
      statut: { $in: ["pending", "active"] },
    });
    console.log("Certification existante :", existingCertification);

    if (existingCertification) {
      return res.status(400).json({
        message:
          existingCertification.statut === "active"
            ? "Vous êtes déjà certifié"
            : "Une demande de certification est déjà en cours",
      });
    }

    const certification = new Certification({
      vendeur: vendeur._id,
      statut: "pending",
      dateDemande: new Date(),
      montantInitial: 5000,
    });

    await certification.save();
    console.log("Nouvelle certification créée :", certification._id);

    const paiement = new CertificationPaiement({
      certification: certification._id,
      vendeur: vendeur._id,
      type: "initial",
      montant: certification.montantInitial || 5000,
      statut: "pending",
    });

    await paiement.save();
    console.log("Paiement initial créé :", paiement._id);

    vendeur.demandeCertification = true;
    vendeur.dateDemandeCertification = new Date();
    await vendeur.save();
    console.log("Vendeur mis à jour :", vendeur._id);

    res.json({
      message: "Demande de certification envoyée avec succès",
      certification,
    });
  } catch (err) {
    console.error("🔥 ERREUR demandeCertification :", err);
    console.error(err.stack);
    res.status(500).json({
      message: "Erreur lors de la demande de certification",
    });
  }
};

/* =======================
   2️⃣ GET DEMANDES CERTIFICATION (ADMIN)
======================= */
export const getDemandesCertification = async (req, res) => {
  console.log("📥 [ADMIN] getDemandesCertification appelé");

  try {
    const demandes = await Certification.find({ statut: "pending" })
      .populate("vendeur", "nomVendeur email nomBoutique")
      .sort({ dateDemande: -1 });

    console.log("Demandes récupérées :", demandes.length);
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
======================= */
export const validerDemandeCertification = async (req, res) => {
  console.log("✅ [ADMIN] validerDemandeCertification appelé");

  try {
    const { id } = req.params;
    const { paiementReference } = req.body;
    console.log("ID reçu pour validation :", id, "Paiement ref :", paiementReference);

    const certification = await Certification.findById(id);
    if (!certification) {
      console.warn("❌ Certification introuvable");
      return res.status(404).json({ message: "Certification introuvable" });
    }
    console.log("Certification trouvée :", certification._id, "Statut :", certification.statut);

    if (certification.statut !== "pending") {
      console.warn("❌ Demande non valide pour validation");
      return res.status(400).json({
        message: "Cette demande ne peut plus être validée",
      });
    }

    const paiement = await CertificationPaiement.findOne({
      certification: certification._id,
      type: "initial",
    });

    if (!paiement) {
      console.warn("❌ Paiement initial introuvable");
      return res.status(404).json({
        message: "Paiement initial introuvable",
      });
    }
    console.log("Paiement initial trouvé :", paiement._id);

    paiement.statut = "validated";
    paiement.referencePaiement = paiementReference || "";
    paiement.dateValidation = new Date();
    await paiement.save();
    console.log("Paiement validé :", paiement._id);

    certification.statut = "active";
    certification.dateActivation = new Date();
    const dateFin = new Date();
    dateFin.setMonth(dateFin.getMonth() + 1);
    certification.dateExpiration = dateFin;
    await certification.save();
    console.log("Certification activée :", certification._id);

    const vendeur = await Vendeur.findById(certification.vendeur);
    vendeur.certifie = true;
    vendeur.demandeCertification = false;
    await vendeur.save();
    console.log("Vendeur mis à jour :", vendeur._id);

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
======================= */
export const refuserDemandeCertification = async (req, res) => {
  console.log("❌ [ADMIN] refuserDemandeCertification appelé");

  try {
    const { id } = req.params;
    console.log("ID reçu pour refus :", id);

    const certification = await Certification.findById(id);
    if (!certification) {
      console.warn("❌ Certification introuvable");
      return res.status(404).json({ message: "Certification introuvable" });
    }
    console.log(
      "Certification trouvée :",
      certification._id,
      "Statut actuel :",
      certification.statut
    );

    // Mise à jour du statut
    certification.statut = "rejected";
    await certification.save();
    console.log("Certification refusée :", certification._id);

    // Mise à jour du vendeur
    const vendeur = await Vendeur.findById(certification.vendeur);
    if (vendeur) {
      vendeur.demandeCertification = false;
      vendeur.certifie = false;
      await vendeur.save();
      console.log("Vendeur mis à jour après refus :", vendeur._id);
    } else {
      console.warn("⚠️ Vendeur non trouvé pour cette certification :", certification.vendeur);
    }

    res.json({
      message: "Demande de certification refusée",
    });
  } catch (err) {
    console.error("🔥 ERREUR refuserDemandeCertification :", err);
    console.error(err.stack);
    res.status(500).json({
      message: "Erreur lors du refus de la demande",
    });
  }
};
