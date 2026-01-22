import axios from "axios";

/* =========================
   CONFIG ADMIN
========================= */
const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/admin`,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================
   INTERCEPTORS
========================= */
API.interceptors.request.use(
  (config) => {
    // ✅ AJOUT DU TOKEN ADMIN
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      "➡️ ADMIN API:",
      config.method?.toUpperCase(),
      config.baseURL + config.url
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
export const listerVendeurs = () => API.get("/vendeurs");

export const changerStatutVendeur = (id, actif) =>
  API.put(`/vendeurs/${id}/statut`, { actif });

export const changerCertificationVendeur = (id, certifie) =>
  API.put(`/vendeurs/${id}/certification`, { certifie });

/* =========================
   PRODUITS
========================= */
export const listerProduits = () => API.get("/produits");

export const validerProduit = (id, valide) =>
  API.put(`/produits/${id}/validation`, { valide });

export const suspendreProduit = (id, actif) =>
  API.put(`/produits/${id}/suspendre`, { actif });

export const mettreProduitEnPromo = (id, prixPromo) =>
  API.put(`/produits/${id}/promo`, { prixPromo });

/* =========================
   COMMANDES
========================= */
export const listerCommandes = () => API.get("/commandes");

export const modifierCommande = (id, status) =>
  API.put(`/commandes/${id}`, { status });

/* =========================
   BOOSTS (ADMIN)
========================= */
export const getDemandesBoost = () =>
  API.get("/produits/boosts");

export const validerBoost = (id) =>
  API.put(`/produits/boosts/${id}/valider`);

export const refuserBoost = (id) =>
  API.put(`/produits/boosts/${id}/refuser`);

/* =========================
   STATS ADMIN
========================= */
export const getStatsAdmin = () => API.get("/stats");

export default API;
