import axios from "axios";

/* =========================
   CONFIG ADMIN
========================= */
const API = axios.create({
  baseURL: "http://localhost:5000/api/admin",
});

/* =========================
   INTERCEPTORS (LOG UNIQUEMENT)
========================= */
API.interceptors.request.use(
  (config) => {
    console.log(
      "➡️ ADMIN API:",
      config.method?.toUpperCase(),
      config.url
    );
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "❌ ADMIN API ERROR:",
      error?.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

/* =========================
   VENDEURS
========================= */
export const listerVendeurs = () =>
  API.get("/vendeurs");

export const changerStatutVendeur = (id, actif) =>
  API.put(`/vendeurs/${id}/statut`, { actif });

export const changerCertificationVendeur = (id, certifie) =>
  API.put(`/vendeurs/${id}/certification`, { certifie });

/* =========================
   PRODUITS
========================= */
export const listerProduits = () =>
  API.get("/produits");

export const validerProduit = (id, valide) =>
  API.put(`/produits/${id}/validation`, { valide });

export const suspendreProduit = (id, actif) =>
  API.put(`/produits/${id}/suspendre`, { actif });

export const mettreProduitEnPromo = (id, prixPromo) =>
  API.put(`/produits/${id}/promo`, { prixPromo });

/* =========================
   COMMANDES
========================= */
export const listerCommandes = () =>
  API.get("/commandes");

export const modifierCommande = (id, status) =>
  API.put(`/commandes/${id}`, { status });

/* =========================
   STATS ADMIN
========================= */
export const getStatsAdmin = () =>
  API.get("/stats");
