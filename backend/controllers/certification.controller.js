import Vendeur from "../models/Vendeur.js";
import Certification from "../models/Certification.js";
import CertificationPaiement from "../models/CertificationPaiement.js";
import { envoyerMailCertification } from "../services/mailService.js";

/* =======================
   1️⃣ DEMANDE DE CERTIFICATION
======================= */
export const demandeCertification = async (req, res) => {
  console.log("🚀 [CERTIFICATION] demandeCertification appelé");

  try {
    const { vendeurId } = req.body;
    if (!vendeurId)
      return res.status(400).json({ message: "ID vendeur requis" });

    const vendeur = await Vendeur.findById(vendeurId);
    if (!vendeur) return res.status(404).json({ message: "Vendeur introuvable" });

    if (vendeur.certifie)
      return res.status(400).json({ message: "Vous êtes déjà certifié" });

    const existingCertification = await Certification.findOne({
      vendeur: vendeur._id,
      statut: { $in: ["pending", "active"] },
    });
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

    const paiement = new CertificationPaiement({
      certification: certification._id,
      vendeur: vendeur._id,
      type: "initial",
      montant: certification.montantInitial || 5000,
      statut: "pending",
    });
    await paiement.save();

    vendeur.demandeCertification = true;
    vendeur.dateDemandeCertification = new Date();
    await vendeur.save();

    res.json({
      message: "Demande de certification envoyée avec succès",
      certification,
    });
  } catch (err) {
    console.error("🔥 ERREUR demandeCertification :", err);
    res.status(500).json({ message: "Erreur lors de la demande de certification" });
  }
};

/* =======================
   2️⃣ GET DEMANDES CERTIFICATION (ADMIN)
======================= */
export const getDemandesCertification = async (req, res) => {
  console.log("📥 [ADMIN] getDemandesCertification appelé");

  try {
    const demandes = await Certification.find({
      statut: { $in: ["pending", "rejected"] }, // inclure les refusées pour pouvoir les repasser à active
    })
      .populate("vendeur", "nomVendeur email nomBoutique")
      .sort({ dateDemande: -1 });

    res.json(demandes);
  } catch (err) {
    console.error("🔥 ERREUR getDemandesCertification :", err);
    res.status(500).json({ message: "Erreur lors de la récupération des demandes" });
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

    const certification = await Certification.findById(id);
    if (!certification) {
      console.warn("❌ Certification introuvable");
      return res.status(404).json({ message: "Certification introuvable" });
    }

    // ✅ Autoriser la validation même si la demande était refusée
    if (certification.statut === "active") {
      return res.status(400).json({ message: "Cette demande est déjà validée" });
    }

    const paiement = await CertificationPaiement.findOne({
      certification: certification._id,
      type: "initial",
    });
    if (!paiement) {
      console.warn("❌ Paiement initial introuvable");
      return res.status(404).json({ message: "Paiement initial introuvable" });
    }

    // Validation du paiement
    paiement.statut = "validated";
    paiement.referencePaiement = paiementReference || "";
    paiement.dateValidation = new Date();
    await paiement.save();
    console.log("Paiement validé :", paiement._id);

    // Activation de la certification
    certification.statut = "active";
    certification.dateActivation = new Date();
    const dateFin = new Date();
    dateFin.setMonth(dateFin.getMonth() + 1); // 1 mois de validité
    certification.dateExpiration = dateFin;
    await certification.save();
    console.log("Certification activée :", certification._id);

    // Mise à jour du vendeur
    const vendeur = await Vendeur.findById(certification.vendeur);
    if (!vendeur) {
      console.warn("⚠️ Vendeur introuvable pour cette certification");
      return res.status(404).json({ message: "Vendeur introuvable" });
    }
    vendeur.certifie = true;
    vendeur.demandeCertification = false;
    await vendeur.save();
    console.log("Vendeur mis à jour :", vendeur._id);

    // Envoi email au vendeur
    try {
      await envoyerMailCertification({
        email: vendeur.email,
        type: "VALIDEE",
        nomVendeur: vendeur.nomVendeur,
      });
      console.log(`✅ Email de validation envoyé à ${vendeur.email}`);
    } catch (emailErr) {
      console.error("❌ Erreur envoi email :", emailErr);
    }

    res.json({ message: "Demande de certification validée" });
  } catch (err) {
    console.error("🔥 ERREUR validerDemandeCertification :", err);
    res.status(500).json({ message: "Erreur lors de la validation de la demande" });
  }
};

/* =======================
   4️⃣ REFUSER DEMANDE (ADMIN)
======================= */
export const refuserDemandeCertification = async (req, res) => {
  console.log("❌ [ADMIN] refuserDemandeCertification appelé");

  try {
    const { id } = req.params;
    const { commentaireAdmin } = req.body;

    const certification = await Certification.findById(id);
    if (!certification) return res.status(404).json({ message: "Certification introuvable" });

    // Mettre le statut à rejected, mais conserver l'objet pour possible re-validation
    certification.statut = "rejected";
    await certification.save();

    // Mise à jour du vendeur
    const vendeur = await Vendeur.findById(certification.vendeur);
    if (vendeur) {
      vendeur.demandeCertification = false;
      vendeur.certifie = false;
      await vendeur.save();

      // Envoi email au vendeur
      await envoyerMailCertification({
        email: vendeur.email,
        type: "REFUSEE",
        nomVendeur: vendeur.nomVendeur,
        commentaire: commentaireAdmin || "",
      });
    }

    res.json({ message: "Demande de certification refusée" });
  } catch (err) {
    console.error("🔥 ERREUR refuserDemandeCertification :", err);
    res.status(500).json({ message: "Erreur lors du refus de la demande" });
  }
};
