import { useEffect, useState } from "react";
import { BsPatchCheckFill } from "react-icons/bs";
import api from "../services/api";

export default function Certification({ vendeurId }) {
  const [demandeEnvoyee, setDemandeEnvoyee] = useState(false);
  const [certification, setCertification] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const CERTIFICATION_PRICE = 5000;
  const WAVE_BASE_LINK = "https://pay.wave.com/m/M_sn_hHeTj4ufIvYG";

  /* ================= CHECK CERTIFICATION EXISTANTE ================= */
  useEffect(() => {
    const fetchCertification = async () => {
      if (!vendeurId) return;

      try {
        const res = await api.get(`/api/certification/${vendeurId}`);
        if (res.data?.certification) {
          setCertification(res.data.certification);
          setDemandeEnvoyee(true);
        }
      } catch (err) {
        console.error("Erreur chargement certification", err);
      }
    };

    fetchCertification();
  }, [vendeurId]);

  /* ================= ENVOI DEMANDE CERTIFICATION ================= */
  const envoyerDemandeCertification = async () => {
    if (demandeEnvoyee || !vendeurId) return;

    setActionLoading(true);
    try {
      const res = await api.post("/api/certification/demande", { vendeurId });
      setCertification(res.data.certification);
      setDemandeEnvoyee(true);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Erreur lors de l'envoi de la demande";
      alert(message);
    } finally {
      setActionLoading(false);
    }
  };

  /* ================= LIEN DE PAIEMENT WAVE ================= */
  const wavePaymentLink = certification
    ? `${WAVE_BASE_LINK}?amount=${CERTIFICATION_PRICE}&metadata=${encodeURIComponent(
        certification._id
      )}`
    : `${WAVE_BASE_LINK}?amount=${CERTIFICATION_PRICE}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <BsPatchCheckFill size={48} className="text-blue-500" />
        </div>

        <h2 className="text-2xl font-bold mb-2">
          Certification du vendeur
        </h2>

        <p className="text-gray-600 mb-4">
          Obtenez le badge officiel Dakarbusinesse.
        </p>

        <div className="mb-6 text-lg font-semibold">
          Montant :{" "}
          <span className="text-orange-600">
            {CERTIFICATION_PRICE.toLocaleString()} FCFA
          </span>
        </div>

        {/* ================= ACTIONS ================= */}
        {!demandeEnvoyee ? (
          <button
            type="button"
            onClick={envoyerDemandeCertification}
            disabled={actionLoading}
            className="w-full bg-orange-600 text-black py-2 rounded-lg font-semibold disabled:opacity-50"
          >
            {actionLoading ? "Envoi..." : "Demander la certification"}
          </button>
        ) : (
          <div className="space-y-4">
            <p className="text-green-600 font-semibold">
              Une demande de certification existe déjà ⏳
            </p>

            {certification?.status === "validee" && (
              <p className="text-blue-600 font-semibold">
                Certification déjà validée ✅
              </p>
            )}

            {certification?.status === "en_attente" && !certification?.isPaid && (
              <>
                <p className="text-gray-600">
                  Paiement requis pour continuer
                </p>

                <a
                  href={wavePaymentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-orange-600 text-black py-2 rounded-lg font-semibold"
                >
                  Payer avec Wave
                </a>
              </>
            )}

            <p className="text-xs text-gray-500">
              La certification est activée après validation par l’administrateur.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
