import api from "../../services/api";

/* =========================
   DEMANDES CERTIFICATION
========================= */

// 🔥 Récupérer toutes les demandes de certification
export const getDemandesCertification = () =>
  api.get("/api/certification/demandes");

// ✅ Valider une demande (sans body)
export const validerDemandeCertification = (id) =>
  api.post("/api/certification/valider", { certificationId: id });

// ❌ Refuser une demande (sans body)
export const refuserDemandeCertification = (id) =>
  api.post("/api/certification/refuser", { certificationId: id });
