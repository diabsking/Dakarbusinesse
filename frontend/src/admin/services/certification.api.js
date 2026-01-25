import api from "../../services/api";

// Récupérer toutes les demandes de certification
export const getDemandesCertification = () =>
  api.get("/api/certification/demandes");

// Valider une demande
export const validerDemandeCertification = (id) =>
  api.post(`/api/certification/valider/${id}`);

// Refuser une demande
export const refuserDemandeCertification = (id) =>
  api.post(`/api/certification/refuser/${id}`);
