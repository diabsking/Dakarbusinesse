// frontend/src/services/api.js
import axios from "axios";

/**
 * =========================
 * Création instance Axios
 * Utilise VITE_API_URL si défini, sinon localhost
 * =========================
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // nécessaire si backend utilise cookies/JWT
});

/**
 * =========================
 * Intercepteur REQUEST
 * Ajoute automatiquement le JWT si présent
 * =========================
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * =========================
 * Intercepteur RESPONSE
 * Gestion globale des erreurs
 * =========================
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Token expiré ou invalide
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
