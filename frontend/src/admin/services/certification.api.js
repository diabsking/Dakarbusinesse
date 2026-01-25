import api from "../../services/api";

/* =========================
   DEMANDES CERTIFICATION
========================= */

// 🔥 Récupérer toutes les demandes de certification
export const getDemandesCertification = () =>
  api.get("/api/certification/demandes");

// ✅ Valider une demande
export const validerDemandeCertification = (id, paiementReference) =>
  api.put(`/api/certification/${id}/valider`, {
    paiementReference,
  });

// ❌ Refuser une demande
export const refuserDemandeCertification = (id, commentaireAdmin) =>
  api.put(`/api/certification/${id}/refuser`, {
    commentaireAdmin,
  });
