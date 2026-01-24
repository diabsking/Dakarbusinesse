import Vendeur from "../models/Vendeur.js";
import Certification from "../models/Certification.js";
import CertificationPaiement from "../models/CertificationPaiement.js";

/* =======================
   1️⃣ DEMANDE DE CERTIFICATION
======================= */
export const demandeCertification = async (req, res) => {
  console.log("🚀 [CERTIFICATION] demandeCertification appelée");

  try {
    console.log("🔑 req.vendeur :", req.vendeur);

    if (!req.vendeur?.id) {
      console.log("❌ req.vendeur.id manquant");
      return res.status(401).json({ message: "Non autorisé" });
    }

    console.log("🔍 Recherche vendeur ID :", req.vendeur.id);
    const vendeur = await Vendeur.findById(req.vendeur.id);
    console.log("👤 Vendeur trouvé :", vendeur?._id);

    if (!vendeur) {
      console.log("❌ Vendeur introuvable");
      return res.status(404).json({ message: "Vendeur introuvable" });
    }

    console.log("📌 État vendeur :", {
      certifie: vendeur.certifie,
      demandeCertification: vendeur.demandeCertification,
    });

    if (vendeur.certification?.statut === "active" || vendeur.certifie === true) {
      console.log("⛔ Vendeur déjà certifié");
      return res.status(400).json({ message: "Vous êtes déjà certifié" });
    }

    console.log("🔎 Recherche certification existante");
    let certification = await Certification.findOne({ vendeur: vendeur._id });
    console.log("📄 Certification existante :", certification?._id);

    if (!certification) {
      console.log("➕ Création nouvelle certification");
      certification = new Certification({
        vendeur: vendeur._id,
        statut: "pending",
        dateDemande: new Date(),
      });
    } else {
      console.log("♻️ Mise à jour certification existante");
      certification.statut = "pending";
      certification.dateDemande = new Date();
    }

    await certification.save();
    console.log("✅ Certification sauvegardée :", certification._id);

    console.log("💰 Création paiement initial");
    const paiement = new CertificationPaiement({
      certification: certification._id,
      vendeur: vendeur._id,
      type: "initial",
      montant: certification.montantInitial || 5000,
      statut: "pending",
    });

    await paiement.save();
    console.log("✅ Paiement créé :", paiement._id);

    vendeur.demandeCertification = true;
    vendeur.dateDemandeCertification = new Date();
    await vendeur.save();

    console.log("✅ Vendeur mis à jour");

    res.json({
      message: "Demande de certification envoyée avec succès",
      certification,
      paiement,
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

    console.log("📊 Nombre de demandes :", demandes.length);
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
  console.log("✅ [ADMIN] validerDemandeCertification");

  try {
    const { certificationId, paiementReference } = req.body;
    console.log("📥 Body :", req.body);

    const certification = await Certification.findById(certificationId);
    console.log("📄 Certification :", certification?._id);

    if (!certification) {
      return res.status(404).json({ message: "Certification introuvable" });
    }

    const paiement = await CertificationPaiement.findOne({
      certification: certification._id,
      type: "initial",
    });

    console.log("💳 Paiement :", paiement?._id);

    if (!paiement) {
      return res.status(404).json({ message: "Paiement initial introuvable" });
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
    await vendeur.save();

    console.log("🎉 Certification activée");

    res.json({
      message: "Demande de certification validée",
      certification,
      paiement,
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
  console.log("❌ [ADMIN] refuserDemandeCertification");

  try {
    const { certificationId, commentaireAdmin } = req.body;
    console.log("📥 Body :", req.body);

    const certification = await Certification.findById(certificationId);
    console.log("📄 Certification :", certification?._id);

    if (!certification) {
      return res.status(404).json({ message: "Certification introuvable" });
    }

    certification.statut = "rejected";
    await certification.save();

    const vendeur = await Vendeur.findById(certification.vendeur);
    vendeur.demandeCertification = false;
    await vendeur.save();

    console.log("🚫 Demande refusée");

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
