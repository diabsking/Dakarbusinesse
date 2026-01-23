import api from "../../services/api";

// 🔥 Routes boost admin (backend)
// GET /api/produits/boosts
export const getDemandesBoost = () => api.get("/api/produits/boosts");

// PUT /api/produits/boosts/:id/valider
export const validerBoost = (id) =>
  api.put(`/api/produits/boosts/${id}/valider`);

// PUT /api/produits/boosts/:id/refuser
export const refuserBoost = (id) =>
  api.put(`/api/produits/boosts/${id}/refuser`);
