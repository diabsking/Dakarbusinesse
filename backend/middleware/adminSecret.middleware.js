// middleware/adminSecret.middleware.js

// ⚠️ Stocker le secret dans .env pour plus de sécurité
const ADMIN_SECRET = process.env.ADMIN_SECRET;

const adminSecretMiddleware = (req, res, next) => {
  try {
    // Récupération du header (toujours lowercase)
    const secret = req.headers["x-admin-secret"];

    if (!secret) {
      return res.status(401).json({
        success: false,
        message: "Code admin manquant",
      });
    }

    if (secret !== ADMIN_SECRET) {
      return res.status(401).json({
        success: false,
        message: "Code admin invalide",
      });
    }

    // Si tout est ok, on passe au middleware suivant / route
    next();
  } catch (error) {
    console.error("❌ adminSecretMiddleware:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

export default adminSecretMiddleware;
