import Vendeur from "../models/Vendeur.js";
import Certification from "../models/Certification.js";
import CertificationPaiement from "../models/CertificationPaiement.js";

/* =======================
   1️⃣ DEMANDE DE CERTIFICATION
======================= */
export const demandeCertification = async (req, res) => {
  try {
    const vendeur = await Vendeur.findById(req.vendeur.id);
    if (!vendeur) return res.status(404).json({ message: "Vendeur introuvable" });

    if (vendeur.certification?.statut === "active") {
      return res.status(400).json({ message: "Vous êtes déjà certifié" });
    }

    // Créer / récupérer la certification
    let certification = await Certification.findOne({ vendeur: vendeur._id });
    if (!certification) {
      certification = new Certification({
        vendeur: vendeur._id,
        statut: "pending",
        dateDemande: new Date(),
      });
      await certification.save();
    } else {
      certification.statut = "pending";
      certification.dateDemande = new Date();
      await certification.save();
    }

    // Créer paiement initial manuel (5000 FCFA)
    const paiement = new CertificationPaiement({
      certification: certification._id,
      vendeur: vendeur._id,
      type: "initial",
      montant: certification.montantInitial || 5000,
      statut: "pending",
    });
    await paiement.save();

    // Mise à jour vendeur
    vendeur.demandeCertification = true;
    vendeur.dateDemandeCertification = new Date();
    await vendeur.save();

    res.json({
      message: "Demande de certification envoyée avec succès",
      certification,
      paiement,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la demande de certification" });
  }
};

/* =======================
   2️⃣ GET DEMANDES CERTIFICATION (ADMIN)
======================= */
export const getDemandesCertification = async (req, res) => {
  try {
    const demandes = await Certification.find({ statut: "pending" })
      .populate("vendeur", "nomVendeur email nomBoutique")
      .sort({ dateDemande: -1 });

    res.json(demandes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la récupération des demandes" });
  }
};

/* =======================
   3️⃣ VALIDER DEMANDE (ADMIN)
======================= */
export const validerDemandeCertification = async (req, res) => {
  try {
    const { certificationId, paiementReference } = req.body;

    const certification = await Certification.findById(certificationId);
    if (!certification) return res.status(404).json({ message: "Certification introuvable" });

    const paiement = await CertificationPaiement.findOne({
      certification: certification._id,
      type: "initial",
    });
    if (!paiement) return res.status(404).json({ message: "Paiement initial introuvable" });

    // Validation manuelle
    paiement.statut = "validated";
    paiement.referencePaiement = paiementReference || "";
    paiement.dateValidation = new Date();
    await paiement.save();

    certification.statut = "active";
    certification.dateActivation = new Date();
    // dateExpiration = +1 mois
    const dateFin = new Date();
    dateFin.setMonth(dateFin.getMonth() + 1);
    certification.dateExpiration = dateFin;
    await certification.save();

    // Mise à jour vendeur
    const vendeur = await Vendeur.findById(certification.vendeur);
    vendeur.certifie = true;
    await vendeur.save();

    res.json({ message: "Demande de certification validée", certification, paiement });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la validation de la demande" });
  }
};

/* =======================
   4️⃣ REFUSER DEMANDE (ADMIN)
======================= */
export const refuserDemandeCertification = async (req, res) => {
  try {
    const { certificationId, commentaireAdmin } = req.body;

    const certification = await Certification.findById(certificationId);
    if (!certification) return res.status(404).json({ message: "Certification introuvable" });

    certification.statut = "rejected";
    await certification.save();

    // Mise à jour vendeur
    const vendeur = await Vendeur.findById(certification.vendeur);
    vendeur.demandeCertification = false;
    await vendeur.save();

    res.json({ message: "Demande de certification refusée", commentaireAdmin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors du refus de la demande" });
  }
};
