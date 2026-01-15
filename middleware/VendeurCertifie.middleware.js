// middleware/VendeurCertifie.middleware.js

const vendeurCertifie = (req, res, next) => {
  try {
    // req.vendeur est injecté par authentification.middleware.js
    if (!req.vendeur) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    if (!req.vendeur.isCertified) {
      return res.status(403).json({
        message: "Accès réservé aux vendeurs certifiés",
      });
    }

    next();
  } catch (erreur) {
    console.error("Erreur middleware vendeur certifié :", erreur);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export default vendeurCertifie;
