import api from "../../services/api";

/* =========================
   DEMANDES CERTIFICATION
========================= */

// 🔥 Récupérer toutes les demandes de certification
// GET /api/certification/demandes
export const getDemandesCertification = () =>
  api.get("/api/certification/demandes");

// 🔥 Valider une demande de certification
// PUT /api/certification/:id/valider
export const validerDemandeCertification = (id) =>
  api.put(`/api/certification/${id}/valider`);

// 🔥 Refuser une demande de certification
// PUT /api/certification/:id/refuser
export const refuserDemandeCertification = (id) =>
  api.put(`/api/certification/${id}/refuser`);
