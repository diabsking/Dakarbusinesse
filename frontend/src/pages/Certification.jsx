import { useEffect, useState } from "react";
import { BsPatchCheckFill } from "react-icons/bs";
import { FiCheckCircle } from "react-icons/fi";
import api from "../services/api";

export default function Certification({ vendeurId }) {
  const [certification, setCertification] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const CERTIFICATION_PRICE = 5000;
  const MONTHLY_PRICE = 1000;
  const WAVE_BASE_LINK = "https://pay.wave.com/m/M_sn_hHeTj4ufIvYG";

  /* ================= CHECK CERTIFICATION EXISTANTE ================= */
  useEffect(() => {
    const fetchCertification = async () => {
      if (!vendeurId) return;
      try {
        const res = await api.get(`/api/certification/${vendeurId}`);
        setCertification(res.data?.certification || null);
      } catch (err) {
        console.error("Erreur chargement certification", err);
      }
    };
    fetchCertification();
  }, [vendeurId]);

  /* ================= ENVOI DEMANDE ================= */
  const envoyerDemandeCertification = async () => {
    if (!vendeurId) return;

    setActionLoading(true);
    try {
      const res = await api.post("/api/certification/demande", { vendeurId });
      setCertification(res.data.certification);
      alert(
        "✅ Demande envoyée avec succès. Veuillez effectuer le paiement pour continuer."
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Impossible d'envoyer la demande"
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* ================= LIEN DE PAIEMENT ================= */
  const wavePaymentLink = certification
    ? `${WAVE_BASE_LINK}?amount=${CERTIFICATION_PRICE}&metadata=${encodeURIComponent(
        certification._id
      )}`
    : `${WAVE_BASE_LINK}?amount=${CERTIFICATION_PRICE}`;

  /* ================= ETATS ================= */
  const isPending = certification?.statut === "pending";
  const isActive = certification?.statut === "active";
  const isRejected = certification?.statut === "rejected";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full space-y-6">

        {/* ===== HEADER ===== */}
        <div className="text-center">
          <BsPatchCheckFill size={48} className="text-blue-500 mx-auto mb-3" />
          <h2 className="text-2xl font-bold">Certification vendeur</h2>
          <p className="text-gray-600 mt-2">
            Devenez un vendeur certifié sur Dakarbusinesse
          </p>
        </div>

        {/* ===== EXPLICATION TARIFS ===== */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
          <p className="font-semibold text-gray-800">💰 Tarification</p>
          <p>• <strong>5 000 FCFA</strong> à l’inscription (une seule fois)</p>
          <p>• <strong>1 000 FCFA / mois</strong> pour maintenir la certification</p>
          <p className="text-xs text-gray-500">
            Le paiement mensuel permet de garder votre badge actif.
          </p>
        </div>

        {/* ===== AVANTAGES ===== */}
        <div className="space-y-3">
          <p className="font-semibold text-gray-800">
            ⭐ Avantages de la certification
          </p>

          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center gap-2">
              <FiCheckCircle className="text-green-600" />
              Badge officiel « Vendeur certifié »
            </li>
            <li className="flex items-center gap-2">
              <FiCheckCircle className="text-green-600" />
              Plus de confiance chez les acheteurs
            </li>
            <li className="flex items-center gap-2">
              <FiCheckCircle className="text-green-600" />
              Meilleure visibilité de vos produits
            </li>
            <li className="flex items-center gap-2">
              <FiCheckCircle className="text-green-600" />
              Priorité dans les résultats de recherche
            </li>
            <li className="flex items-center gap-2">
              <FiCheckCircle className="text-green-600" />
              Accès futur aux offres premium
            </li>
          </ul>
        </div>

        {/* ================= ACTIONS SELON STATUT ================= */}

        {!certification && (
          <button
            onClick={envoyerDemandeCertification}
            disabled={actionLoading}
            className="w-full bg-orange-600 text-black py-2 rounded-lg font-semibold disabled:opacity-50"
          >
            {actionLoading ? "Envoi..." : "Demander la certification"}
          </button>
        )}

        {isPending && (
          <div className="space-y-3 text-center">
            <p className="text-yellow-600 font-semibold">
              ⏳ Demande en cours
            </p>
            <p className="text-gray-600 text-sm">
              Effectuez le paiement de 5 000 FCFA pour activer la certification.
            </p>

            <a
              href={wavePaymentLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-orange-600 text-black py-2 rounded-lg font-semibold"
            >
              Payer avec Wave
            </a>
          </div>
        )}

        {isActive && (
          <div className="text-center space-y-2">
            <p className="text-green-600 font-semibold text-lg">
              ✅ Certification active
            </p>
            <p className="text-gray-600 text-sm">
              Votre badge est visible et vos produits sont mis en avant.
            </p>
          </div>
        )}

        {isRejected && (
          <div className="space-y-3 text-center">
            <p className="text-red-600 font-semibold">
              ❌ Demande refusée
            </p>
            <p className="text-gray-600 text-sm">
              Vous pouvez corriger votre profil et soumettre une nouvelle demande.
            </p>

            <button
              onClick={envoyerDemandeCertification}
              disabled={actionLoading}
              className="w-full bg-orange-600 text-black py-2 rounded-lg font-semibold disabled:opacity-50"
            >
              Soumettre une nouvelle demande
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
