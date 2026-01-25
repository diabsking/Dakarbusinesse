import api from "../../services/api";

/* =========================
   DEMANDES CERTIFICATION
========================= */

// 🔥 Récupérer toutes les demandes de certification
export const getDemandesCertification = () =>
  api.get("/api/certification/demandes");

// ✅ Valider une demande (ID dans l'URL)
export const validerDemandeCertification = (id) =>
  api.post(`/api/certification/valider/${id}`);

// ❌ Refuser une demande (ID dans l'URL)
export const refuserDemandeCertification = (id) =>
  api.post(`/api/certification/refuser/${id}`);
