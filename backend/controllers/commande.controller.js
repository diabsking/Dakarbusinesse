import Commande from "../models/Commande.js";
import Produit from "../models/Produit.js";
import Vendeur from "../models/Vendeur.js";
import {
  notifierClientCommande,
  notifierVendeurCommande,
} from "../services/mailCommande.js";

/* ============================
   PASSER COMMANDE
============================ */
/* ============================
   PASSER COMMANDE
============================ */
export const passerCommande = async (req, res) => {
  try {
    const { clientNom, clientTelephone, clientEmail, clientAdresse, vendeurs } = req.body;

    // Vérification des infos client obligatoires
    if (!clientNom || !clientTelephone || !clientAdresse) {
      return res.status(400).json({ message: "Informations client manquantes" });
    }

    // Vérification des vendeurs
    if (!Array.isArray(vendeurs) || vendeurs.length === 0) {
      return res.status(400).json({ message: "Aucun vendeur trouvé" });
    }

    const commandesCreees = [];

    for (const vendeur of vendeurs) {
      const { idVendeur, nomVendeur, emailVendeur, produits } = vendeur;

      // 🔴 Email vendeur obligatoire
      if (!emailVendeur) {
        return res.status(400).json({
          message: `Email du vendeur manquant pour ${nomVendeur || "un vendeur"}`,
        });
      }

      if (!Array.isArray(produits) || produits.length === 0) continue;

      const produitsCommande = [];

      // Récupération des infos produits depuis la base
      for (const item of produits) {
        const produit = await Produit.findById(item.produitId);
        if (!produit) continue;

        produitsCommande.push({
          produitId: produit._id,
          vendeur: idVendeur,
          nom: produit.nom,
          image: produit.images?.[0] || "",
          quantite: item.quantite || 1,
          prix: produit.prixActuel,
        });
      }

      if (produitsCommande.length === 0) continue;

      // Calcul du total pour ce vendeur
      const total = produitsCommande.reduce(
        (sum, p) => sum + p.prix * p.quantite,
        0
      );

      // Création de la commande
      const commande = await Commande.create({
        client: {
          nom: clientNom,
          telephone: clientTelephone,
          email: clientEmail || "",
          adresse: clientAdresse,
        },
        produits: produitsCommande,
        total,
        status: "en cours",
        historiqueStatus: [{ status: "en cours", date: new Date() }],
        actif: true,
      });

      commandesCreees.push(commande);

      // Envoi email client (optionnel)
      if (clientEmail) {
        notifierClientCommande(clientEmail, commande).catch((err) =>
          console.error("❌ Erreur email client :", err)
        );
      }

      // Envoi email vendeur (obligatoire)
      notifierVendeurCommande(emailVendeur, commande, nomVendeur, idVendeur).catch(
        (err) => console.error("❌ Erreur email vendeur :", err)
      );
    }

    // Réponse au frontend
    res.status(201).json({
      message: "Commande(s) créée(s) avec succès",
      commandes: commandesCreees,
    });
  } catch (error) {
    console.error("❌ Erreur passerCommande:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


/* ============================
   OBTENIR COMMANDES VENDEUR
============================ */
export const obtenirCommandesVendeur = async (req, res) => {
  try {
    const vendeurId = req.vendeur.id;

    const commandes = await Commande.find({
      "produits.vendeur": vendeurId,
      actif: true,
    }).sort({ createdAt: -1 });

    res.status(200).json(commandes);
  } catch (error) {
    console.error("❌ Erreur récupération commandes vendeur :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ============================
   OBTENIR COMMANDES CLIENT
============================ */
export const obtenirCommandesClient = async (req, res) => {
  try {
    const telephone = req.params.telephone;

    const commandes = await Commande.find({ "client.telephone": telephone }).sort({
      createdAt: -1,
    });

    res.status(200).json(commandes);
  } catch (error) {
    console.error("❌ Erreur récupération commandes client :", error);
    res.status(500).json({ message: error.message });
  }
};

/* ============================
   HISTORIQUE COMMANDES
============================ */
export const historiqueCommandes = async (req, res) => {
  try {
    const commandes = await Commande.find({
      status: "livré",
    }).sort({ createdAt: -1 });

    res.status(200).json(commandes);
  } catch (error) {
    console.error("❌ Erreur historique commandes:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


/* ============================
   MODIFIER STATUT COMMANDE
============================ */
export const modifierStatutCommande = async (req, res) => {
  try {
    const { status } = req.body; // reçu depuis frontend ("Livrée", "En cours", etc.)
    const vendeurId = req.vendeur?.id;

    if (!vendeurId) return res.status(401).json({ message: "Non authentifié" });
    if (!status) return res.status(400).json({ message: "Statut manquant" });

    // Mapping frontend -> backend (enum exact)
    const statusMapBackend = {
      "En cours": "en cours",
      "En préparation": "en préparation",
      "Livrée": "livré",
      "Annulée": "annulé",
    };

    const statutNormalise = statusMapBackend[status];
    if (!statutNormalise) return res.status(400).json({ message: `Statut invalide : ${status}` });

    const commande = await Commande.findById(req.params.id);
    if (!commande) return res.status(404).json({ message: "Commande introuvable" });

    // Vérifier que le vendeur fait partie de la commande
    const vendeurAutorise = commande.produits.some(p => p.vendeur.toString() === vendeurId);
    if (!vendeurAutorise) return res.status(403).json({ message: "Accès refusé" });

    // Mettre à jour le statut global
    commande.status = statutNormalise;

    // Mettre à jour le statut de la livraison si elle existe
    if (commande.livraison) {
      if (statutNormalise === "livré") commande.livraison.statut = "livré";
      else if (statutNormalise === "en cours") commande.livraison.statut = "en cours";
      else if (statutNormalise === "annulé") commande.livraison.statut = "préparé";
    }

    // Ajouter à l'historique avec **valeur lowercase compatible enum**
    commande.historiqueStatus = commande.historiqueStatus || [];
    commande.historiqueStatus.push({
      status: statutNormalise,
      date: new Date(),
    });

    await commande.save();

    // Envoyer la valeur côté frontend telle quelle (majuscule)
    res.status(200).json({
      message: "Statut mis à jour",
      commande: {
        ...commande.toObject(),
        status, // pour afficher "Livrée" au frontend
      },
    });
  } catch (error) {
    console.error("❌ Erreur modification statut commande :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

