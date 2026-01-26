import Vendeur from "../models/Vendeur.js";
import Certification from "../models/Certification.js";
import CertificationPaiement from "../models/CertificationPaiement.js";
import { envoyerMailCertification } from "../services/mailService.js";

/* =======================
   1️⃣ DEMANDE DE CERTIFICATION
======================= */
export const demandeCertification = async (req, res) => {
  try {
    const { vendeurId } = req.body;
    if (!vendeurId) {
      return res.status(400).json({ message: "ID vendeur requis" });
    }

    const vendeur = await Vendeur.findById(vendeurId);
    if (!vendeur) {
      return res.status(404).json({ message: "Vendeur introuvable" });
    }

    if (vendeur.certifie) {
      return res.status(400).json({ message: "Vous êtes déjà certifié" });
    }

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

    const certification = await Certification.create({
      vendeur: vendeur._id,
      statut: "pending",
      dateDemande: new Date(),
      montantInitial: 5000,
    });

    await CertificationPaiement.create({
      certification: certification._id,
      vendeur: vendeur._id,
      type: "initial",
      montant: certification.montantInitial,
      statut: "pending",
    });

    vendeur.demandeCertification = true;
    vendeur.dateDemandeCertification = new Date();
    await vendeur.save();

    res.json({
      message: "Demande de certification envoyée avec succès",
      certification,
    });
  } catch (err) {
    console.error("🔥 demandeCertification :", err);
    res.status(500).json({ message: "Erreur lors de la demande de certification" });
  }
};

/* =======================
   2️⃣ GET DEMANDES CERTIFICATION (ADMIN)
======================= */
export const getDemandesCertification = async (req, res) => {
  try {
    const demandes = await Certification.find({
      statut: { $in: ["pending", "active", "rejected"] },
    })
      .populate("vendeur", "nomVendeur email nomBoutique")
      .sort({ dateDemande: -1 });

    res.json(demandes);
  } catch (err) {
    console.error("🔥 getDemandesCertification :", err);
    res.status(500).json({ message: "Erreur lors de la récupération des demandes" });
  }
};

/* =======================
   3️⃣ VALIDER DEMANDE (ADMIN)
======================= */
export const validerDemandeCertification = async (req, res) => {
  try {
    const { id } = req.params;

    const certification = await Certification.findById(id);
    if (!certification) {
      return res.status(404).json({ message: "Certification introuvable" });
    }

    if (certification.statut === "active") {
      return res.status(400).json({ message: "Certification déjà validée" });
    }

    const paiement = await CertificationPaiement.findOne({
      certification: certification._id,
      type: "initial",
    });

    if (!paiement) {
      return res.status(404).json({ message: "Paiement initial introuvable" });
    }

    paiement.statut = "validated";
    paiement.dateValidation = new Date();
    await paiement.save();

    certification.statut = "active";
    certification.dateActivation = new Date();

    const expiration = new Date();
    expiration.setMonth(expiration.getMonth() + 1);
    certification.dateExpiration = expiration;

    await certification.save();

    const vendeur = await Vendeur.findById(certification.vendeur);
    if (vendeur) {
      vendeur.certifie = true;
      vendeur.demandeCertification = false;
      await vendeur.save();
    }

    try {
      await envoyerMailCertification({
        email: vendeur?.email,
        type: "VALIDEE",
        nomVendeur: vendeur?.nomVendeur,
      });
    } catch (mailErr) {
      console.warn("⚠️ Email validation non envoyé");
    }

    res.json({ message: "Certification validée avec succès" });
  } catch (err) {
    console.error("🔥 validerDemandeCertification :", err);
    res.status(500).json({ message: "Erreur lors de la validation de la demande" });
  }
};

/* =======================
   4️⃣ REFUSER DEMANDE (ADMIN)
======================= */
export const refuserDemandeCertification = async (req, res) => {
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
    if (vendeur) {
      vendeur.certifie = false;
      vendeur.demandeCertification = false;
      await vendeur.save();

      try {
        await envoyerMailCertification({
          email: vendeur.email,
          type: "REFUSEE",
          nomVendeur: vendeur.nomVendeur,
          commentaire: commentaireAdmin || "",
        });
      } catch (mailErr) {
        console.warn("⚠️ Email refus non envoyé");
      }
    }

    res.json({ message: "Demande de certification refusée" });
  } catch (err) {
    console.error("🔥 refuserDemandeCertification :", err);
    res.status(500).json({ message: "Erreur lors du refus de la demande" });
  }
};

/* =======================
   5️⃣ VERIFICATION EXPIRATION (ADMIN ou CRON)
======================= */
export const verifierExpirationCertifications = async () => {
  try {
    const now = new Date();

    // Trouve toutes les certifications actives expirées
    const certificationsExpirees = await Certification.find({
      statut: "active",
      dateExpiration: { $lte: now },
    }).populate("vendeur");

    for (const cert of certificationsExpirees) {
      // Passe le statut à suspended
      cert.statut = "suspended";
      await cert.save();

      // Met à jour le vendeur
      if (cert.vendeur) {
        cert.vendeur.certifie = false;
        await cert.vendeur.save();

        // Envoi mail de suspension
        try {
          await envoyerMailCertification({
            email: cert.vendeur.email,
            type: "SUSPENDED",
            nomVendeur: cert.vendeur.nomVendeur,
          });
          console.log(`📨 Email de suspension envoyé à ${cert.vendeur.email}`);
        } catch (mailErr) {
          console.warn(`⚠️ Email suspension non envoyé pour ${cert.vendeur.email}`);
        }
      }

      console.log(`✅ Certification suspendue pour vendeur ${cert.vendeur?.nomVendeur || cert.vendeur}`);
    }
  } catch (err) {
    console.error("🔥 verifierExpirationCertifications :", err);
  }
};
