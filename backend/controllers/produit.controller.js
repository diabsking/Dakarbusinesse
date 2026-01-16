import Produit from "../models/Produit.js";
import StatProduit from "../models/StatProduit.js";
import StatProduitDaily from "../models/StatProduitDaily.js";
import StatProduitEvent from "../models/StatProduitEvent.js";

/* =====================================================
   ➕ AJOUTER PRODUIT
===================================================== */
export const ajouterProduit = async (req, res) => {
  try {
    const {
      nom,
      description,
      categorie,
      prixInitial,
      prixActuel,
      enPromotion,
      etat,
      origine,
      paysOrigine,
      stock,
      delaiLivraison,
    } = req.body;

    /* ================= VALIDATIONS ================= */

    if (
      !nom ||
      !description ||
      !categorie ||
      !prixInitial ||
      !prixActuel ||
      !etat ||
      !origine ||
      !stock ||
      !delaiLivraison
    ) {
      return res.status(400).json({
        message: "Tous les champs produit sont obligatoires",
      });
    }

    if (!req.files || req.files.length < 4 || req.files.length > 6) {
      return res.status(400).json({
        message: "Le produit doit contenir entre 4 et 6 images",
      });
    }

    if (!req.vendeur || !req.vendeur.id) {
      return res.status(401).json({
        message: "Vendeur non authentifié",
      });
    }

    /* ================= IMAGES (CLOUDINARY) ================= */

    const images = req.files.map((file) => file.path);

    /* ================= CRÉATION ================= */

    const produit = await Produit.create({
      nom,
      description,
      categorie,
      prixInitial,
      prixActuel,
      enPromotion: enPromotion === "Oui" || enPromotion === true,
      etat,
      origine,
      paysOrigine: origine === "Vient de l’étranger" ? paysOrigine : null,
      stock,
      delaiLivraison,
      images,

      vendeur: req.vendeur.id,

      publie: true,
      actif: true,
      fraisPublicationPayes: false,
    });

    res.status(201).json({
      success: true,
      message: "Produit créé avec succès",
      produit,
    });

    // ================= INIT STATS PRODUIT (GRATUIT) =================

const today = () => new Date().toISOString().slice(0, 10);

await StatProduit.create({
  produit: produit._id,
  vendeur: produit.vendeur,
  boostActif: false,
  boostUtilisations: 0,
});

await StatProduitDaily.create({
  produit: produit._id,
  date: today(),
});

await StatProduitEvent.create({
  produit: produit._id,
  type: "CREATION_PRODUIT",
  user: req.vendeur.id,
});

  } catch (erreur) {
    console.error("❌ Erreur ajout produit :", erreur);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* =====================================================
   📦 TOUS LES PRODUITS
===================================================== */
export const obtenirTousProduits = async (req, res) => {
  try {
   const produits = await Produit.find()
  .populate("vendeur", "nomBoutique telephone avatar adresseBoutique certifie")
  .sort({ createdAt: -1 });

    res.json({
      success: true,
      total: produits.length,
      produits,
    });
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* =====================================================
   🔍 UN PRODUIT
===================================================== */
export const obtenirProduit = async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id)
  .populate("vendeur", "nomBoutique telephone avatar adresseBoutique certifie");

    if (!produit) {
      return res.status(404).json({ message: "Produit introuvable" });
    }

    res.json({
      success: true,
      produit,
    });
  } catch {
    res.status(500).json({ message: "ID invalide" });
  }
};

/* =====================================================
   ✏️ MODIFIER PRODUIT
===================================================== */
export const modifierProduit = async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id);

    if (!produit) {
      return res.status(404).json({ message: "Produit introuvable" });
    }

    const {
      nom,
      description,
      categorie,
      prixInitial,
      prixActuel,
      enPromotion,
      etat,
      origine,
      paysOrigine,
      stock,
      delaiLivraison,
    } = req.body;

    // ================= VALIDATIONS =================
    if (
      !nom ||
      !description ||
      !categorie ||
      !prixInitial ||
      !prixActuel ||
      !etat ||
      !origine ||
      !stock ||
      !delaiLivraison
    ) {
      return res.status(400).json({
        message: "Tous les champs obligatoires doivent être remplis",
      });
    }

    // ================= MISE À JOUR =================
    produit.nom = nom;
    produit.description = description;
    produit.categorie = categorie;
    produit.prixInitial = prixInitial;
    produit.prixActuel = prixActuel;
    produit.enPromotion = enPromotion === "Oui" || enPromotion === true;
    produit.etat = etat;
    produit.origine = origine;
    produit.paysOrigine =
      origine === "Vient de l’étranger" ? paysOrigine : null;
    produit.stock = stock;
    produit.delaiLivraison = delaiLivraison;

    // ================= IMAGES =================
    if (req.files && req.files.length > 0) {
      produit.images = req.files.map((file) => file.path);
    }

    await produit.save();

    res.status(200).json({
      success: true,
      message: "Produit modifié avec succès",
      produit,
    });
  } catch (erreur) {
    console.error("❌ Erreur modification produit :", erreur);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
/* =====================================================
   🗑️ SUPPRIMER PRODUIT
===================================================== */
export const supprimerProduit = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérification ID valide
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "ID invalide" });
    }

    // Récupérer le produit
    const produit = await Produit.findById(id);

    if (!produit) {
      return res.status(404).json({ success: false, message: "Produit introuvable" });
    }

    // Vérifier que le vendeur est le propriétaire
    if (!req.vendeur || req.vendeur.id !== produit.vendeur.toString()) {
      return res.status(403).json({ success: false, message: "Action non autorisée" });
    }

    // Supprimer le produit
    await produit.deleteOne();

    res.json({
      success: true,
      message: "Produit supprimé avec succès",
    });
  } catch (erreur) {
    console.error("Erreur suppression produit :", erreur);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

/* =====================================================
   👤 Produits du vendeur connecté
===================================================== */
export const obtenirProduitsDuVendeurConnecte = async (req, res) => {
  try {
    // 🔐 Sécurité : vérifier que le vendeur existe
    if (!req.vendeur || !req.vendeur.id) {
      return res.status(401).json({
        success: false,
        message: "Vendeur non authentifié",
      });
    }

    console.log("REQ.VENDEUR ID : ", req.vendeur.id);

    const vendeurId = req.vendeur.id;

    // 🔍 Recherche des produits associés à ce vendeur
    const produits = await Produit.find({
      vendeur: vendeurId,
      actif: true,
    }).exec();

    console.log("Produits récupérés depuis MongoDB : ", produits);

    res.json({
      success: true,
      count: produits.length,
      data: produits,
    });
  } catch (error) {
    console.error("Erreur côté backend :", error);

    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};
    
/* =====================================================
   🔥 PROMOTIONS
===================================================== */
export const obtenirProduitsEnPromotion = async (req, res, next) => {
  try {
    const maintenant = new Date();

    const produits = await Produit.find({
      enPromotion: true,
      publie: true,
      actif: true,
      $or: [
        { dateFinPromotion: null },
        { dateFinPromotion: { $gte: maintenant } },
      ],
    })
      .populate("vendeur", "nomBoutique telephone avatar adresseBoutique certifie")
      .sort({ prixActuel: 1 });

    res.json({
      success: true,
      count: produits.length,
      data: produits,
    });
  } catch (error) {
    next(error);
  }
};
/* =====================================================
   ⭐ TOP COMMANDES
===================================================== */
export const obtenirProduitsPlusCommandes = async (req, res, next) => {
  try {
    const produits = await Produit.find({
      publie: true,
      actif: true,
    })
     .populate("vendeur", "nomBoutique telephone avatar adresseBoutique certifie")
  .sort({ nombreCommandes: -1 })
  .limit(10);
    res.json({
      success: true,
      data: produits,
    });
  } catch (error) {
    next(error);
  }
};

export const obtenirProduitParID = async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id)
      .populate({
        path: "vendeur",
        select: "nomBoutique adresse telephone photo", // champs à retourner
      });

    if (!produit) {
      return res.status(404).json({ message: "Produit introuvable" });
    }

    res.status(200).json({ produit });
  } catch (erreur) {
    console.error("Erreur récupération produit :", erreur);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Produits similaires (même catégorie)
export const produitsSimilaires = async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id);
    if (!produit) return res.status(404).json({ produits: [] });

    const similaires = await Produit.find({
      categorie: produit.categorie,
      _id: { $ne: produit._id },
      actif: true
    })
.populate("vendeur", "nomBoutique telephone avatar adresseBoutique certifie")
  .limit(8);

    res.json({ produits: similaires });
  } catch (err) {
    console.error(err);
    res.status(500).json({ produits: [] });
  }
};

/* =====================================================
   🚀 PRODUITS BOOSTÉS (ROBUSTE)
===================================================== */
export const obtenirProduitsBoostes = async (req, res, next) => {
  try {
    const maintenant = new Date();

    /* -------------------------------------------------
       🧹 Nettoyage des boosts expirés (non bloquant)
    ------------------------------------------------- */
    try {
      await Produit.updateMany(
        {
          estBooster: true,
          dateFinBoost: { $lt: maintenant },
        },
        {
          $set: {
            estBooster: false,
            dateDebutBoost: null,
            dateFinBoost: null,
          },
        }
      );
    } catch (cleanupError) {
      console.warn(
        "⚠️ Nettoyage boosts expirés échoué :",
        cleanupError.message
      );
      // on continue quand même
    }

    /* -------------------------------------------------
       📦 Récupération des produits boostés valides
    ------------------------------------------------- */
    const produits = await Produit.find({
      estBooster: true,
      actif: true,
      publie: true,
      dateFinBoost: { $gte: maintenant },
    })
      .populate(
        "vendeur",
        "nomBoutique telephone avatar adresseBoutique certifie"
      )
      .sort({ dateDebutBoost: -1 })
      .lean(); // 🔥 performance + sécurité

    /* -------------------------------------------------
       ✅ Réponse API cohérente
    ------------------------------------------------- */
    return res.status(200).json({
      success: true,
      count: produits.length,
      data: produits,
    });
  } catch (error) {
    console.error("❌ Erreur produits boostés :", error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des produits boostés",
    });
  }
};

/* =====================================================
   👁️ INCRÉMENTER VUES
===================================================== */
export const incrementerVuesProduit = async (req, res, next) => {
  try {
    await Produit.findByIdAndUpdate(req.params.id, {
      $inc: { nombreVues: 1 },
    });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

/* =====================================================
   🔐 CONFIGURATION
===================================================== */
const KKIAPAY_SECRET_KEY = process.env.KKIAPAY_SECRET_KEY_SANDBOX; // Sandbox key
const MONTANT_BOOST = 500; // FCFA
const DUREE_JOURS = 7; // boost 1 semaine

/* =====================================================
   🔐 CREATION DE TRANSACTION KKIAPAY POUR BOOST
===================================================== */
export const boosterProduitAvecPaiement = async (produitId, client) => {
  try {
    const produit = await Produit.findById(produitId);
    if (!produit) {
      return { success: false, message: "Produit introuvable" };
    }

    // ✅ Création transaction KKIAPAY
    const transactionData = {
      amount: MONTANT_BOOST,
      currency: "XOF",
      metadata: {
        produitId: produit._id.toString(),
        service: "Boost produit",
      },
      customer: {
        name: client.name,
        email: client.email,
        phone: client.phone,
      },
      callback_url: "https://tonsite.com/webhook-boost", // webhook pour confirmation
    };

    const response = await axios.post(
      "https://api.kkiapay.me/v1/transaction",
      transactionData,
      {
        headers: {
          Authorization: `Bearer ${KKIAPAY_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data || !response.data.payment_url) {
      console.error("❌ KKIAPAY: réponse invalide", response.data);
      return { success: false, message: "Impossible de générer le lien de paiement" };
    }

    const paymentUrl = response.data.payment_url;
    console.log("💳 Lien de paiement Kkiapay généré:", paymentUrl);

    return { success: true, paymentUrl };

  } catch (err) {
    console.error("❌ Erreur création transaction Kkiapay:", err.response?.data || err.message);
    return { success: false, message: "Erreur lors de la création du paiement" };
  }
};

/* =====================================================
   🔐 ACTIVATION BOOST APRES CONFIRMATION WEBHOOK
===================================================== */
export const activerBoostApresPaiement = async (produitId, dureeJours = DUREE_JOURS) => {
  try {
    const produit = await Produit.findById(produitId);
    if (!produit) {
      console.error("❌ Boost: produit introuvable");
      return;
    }

    const maintenant = new Date();

    // ⚠️ Déjà boosté ?
    if (produit.estBooster && produit.dateFinBoost && produit.dateFinBoost > maintenant) {
      console.warn("⚠️ Produit déjà boosté");
      return;
    }

    // ✅ Mettre à jour stats produit
    const stat = await StatProduit.findOne({ produit: produit._id });
    if (stat) {
      stat.boostActif = true;
      stat.boostUtilisations = (stat.boostUtilisations || 0) + 1;
      stat.scorePopularite = (stat.scorePopularite || 0) + 30;
      await stat.save();
    }

    // ✅ Créer événement boost
    await StatProduitEvent.create({
      produit: produit._id,
      type: "BOOST",
      date: maintenant,
    });

    // ✅ Activer boost produit
    produit.estBooster = true;
    produit.dateDebutBoost = maintenant;
    produit.dateFinBoost = new Date(maintenant.getTime() + dureeJours * 24 * 60 * 60 * 1000); // +dureeJours
    await produit.save();

    console.log(`🚀 Boost activé | Produit: ${produit._id} | ${dureeJours} jours`);
  } catch (err) {
    console.error("❌ Erreur activation boost:", err.message);
  }
};
