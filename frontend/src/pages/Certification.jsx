import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BsPatchCheckFill } from "react-icons/bs";
import api from "../services/api";

export default function Certification() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [demandeEnvoyee, setDemandeEnvoyee] = useState(false);
  const [error, setError] = useState("");
  const [certification, setCertification] = useState(null);

  /* ================= CONFIG ================= */
  const CERTIFICATION_PRICE = 5000;
  const WAVE_BASE_LINK = "https://pay.wave.com/m/M_sn_hHeTj4ufIvYG";

  /* ================= CHECK USER ================= */
  useEffect(() => {
    console.log("🔍 CHECK USER");

    const storedUser = localStorage.getItem("user");
    console.log("👤 localStorage user :", storedUser);

    if (!storedUser) {
      console.warn("❌ Aucun user → redirection login");
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    console.log("✅ User parsé :", parsedUser);

    if (parsedUser.certifie === true) {
      console.log("ℹ️ Déjà certifié → dashboard");
      navigate("/dashboard");
      return;
    }

    setUser(parsedUser);

    if (parsedUser.demandeCertification === true) {
      console.log("ℹ️ Demande déjà envoyée");
      setDemandeEnvoyee(true);
      setCertification(parsedUser.certification || null);
    }
  }, [navigate]);

  /* ================= DEMANDE CERTIFICATION ================= */
  const envoyerDemande = async () => {
    console.log("🚀 CLICK → envoyerDemande");

    if (loading || demandeEnvoyee) {
      console.warn("⛔ Action bloquée (loading ou déjà envoyée)");
      return;
    }

    setError("");
    setLoading(true);

    try {
      console.log("📡 Envoi POST /api/certification/demande");

      const res = await api.post("/api/certification/demande");

      console.log("✅ RÉPONSE API :", res);
      console.log("📦 DATA :", res.data);

      const certificationData = res.data.certification || null;
      setCertification(certificationData);
      setDemandeEnvoyee(true);

      const updatedUser = {
        ...user,
        demandeCertification: true,
        certification: certificationData,
      };

      console.log("🔄 User mis à jour :", updatedUser);

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (err) {
      console.error("🔥 ERREUR FRONTEND DEMANDE CERTIFICATION");

      if (err.response) {
        console.error("📡 STATUS :", err.response.status);
        console.error("📦 DATA :", err.response.data);
        console.error("📄 HEADERS :", err.response.headers);
      } else {
        console.error("❓ ERREUR SANS RÉPONSE :", err.message);
      }

      setError(
        err.response?.data?.message ||
          err.message ||
          "Erreur lors de l’envoi de la demande"
      );
    } finally {
      setLoading(false);
      console.log("⏹️ Fin envoyerDemande");
    }
  };

  if (!user) return null;

  const wavePaymentLink = certification
    ? `${WAVE_BASE_LINK}?amount=${CERTIFICATION_PRICE}&metadata=${certification._id}`
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
          Montant à payer :{" "}
          <span className="text-orange-600">
            {CERTIFICATION_PRICE.toLocaleString()} FCFA
          </span>
        </div>

        {!demandeEnvoyee ? (
          <>
            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}

            <button
              onClick={envoyerDemande}
              disabled={loading}
              className="w-full bg-orange-600 text-black py-2 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? "Envoi..." : "Demander la certification"}
            </button>
          </>
        ) : (
          <div className="space-y-4">
            <p className="text-green-600 font-semibold">
              Demande envoyée avec succès 🎉
            </p>

            <p className="text-gray-600">
              Paiement manuel requis :{" "}
              <b className="text-orange-600">
                {CERTIFICATION_PRICE.toLocaleString()} FCFA
              </b>
            </p>

            <a
              href={wavePaymentLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-orange-600 text-black py-2 rounded-lg font-semibold"
            >
              Payer avec Wave
            </a>

            <p className="text-xs text-gray-500">
              La certification sera activée après validation du paiement
              par l’administrateur.
            </p>

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg"
            >
              Retour au dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
