import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsPatchCheckFill } from "react-icons/bs";
import api from "../services/api";

export default function Certification() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [demandeEnvoyee, setDemandeEnvoyee] = useState(false);
  const [certification, setCertification] = useState(null);

  /* ================= CONFIG CERTIFICATION ================= */
  const CERTIFICATION_PRICE = 5000; // Montant à payer pour la certification
  const WAVE_BASE_LINK = "https://pay.wave.com/m/M_sn_hHeTj4ufIvYG"; // Lien de paiement Wave

  // Générez le lien de paiement Wave
  const wavePaymentLink = certification
    ? `${WAVE_BASE_LINK}?amount=${CERTIFICATION_PRICE}&metadata=${certification._id}`
    : `${WAVE_BASE_LINK}?amount=${CERTIFICATION_PRICE}`;

  /* ================= VERIFICATION USER ================= */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);

    // Si déjà certifié, redirige vers le dashboard
    if (parsedUser.certifie === true) {
      navigate("/dashboard");
      return;
    }

    setUser(parsedUser);

    // Si une demande de certification a déjà été envoyée
    if (parsedUser.demandeCertification === true) {
      setDemandeEnvoyee(true);
      setCertification(parsedUser.certification || null);
    }
  }, [navigate]);

  /* ================= ENVOI DE LA DEMANDE DE CERTIFICATION ================= */
  const envoyerDemandeCertification = async () => {
    setError(""); // Réinitialiser l'erreur

    if (loading || demandeEnvoyee) return;

    try {
      setLoading(true);

      // 🔑 Récupérer le token utilisateur
      const token = user?.token;
      if (!token) throw new Error("Token manquant, reconnectez-vous.");

      // Envoi de la demande
      const res = await api.post(
        "/api/certification/demande",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Mise à jour des données de certification
      const certificationData = res.data.certification || null;
      setCertification(certificationData);
      setDemandeEnvoyee(true);

      // Mettre à jour le user dans le localStorage
      const updatedUser = {
        ...user,
        demandeCertification: true,
        certification: certificationData,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

    } catch (err) {
      setError(err.response?.data?.message || err.message || "Erreur lors de l’envoi de la demande.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Chargement...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <BsPatchCheckFill size={48} className="text-blue-500" />
        </div>

        <h2 className="text-2xl font-bold mb-2">Certification du vendeur</h2>
        <p className="text-gray-600 mb-4">Obtenez le badge officiel Dakarbusinesse.</p>

        <div className="mb-6 text-lg font-semibold">
          Montant à payer :{" "}
          <span className="text-orange-600">{CERTIFICATION_PRICE.toLocaleString()} FCFA</span>
        </div>

        {!demandeEnvoyee ? (
          <>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button
              onClick={envoyerDemandeCertification}
              disabled={loading}
              className="w-full bg-orange-600 text-black py-2 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? "Envoi..." : "Demander la certification"}
            </button>
          </>
        ) : (
          <div className="space-y-4">
            <p className="text-green-600 font-semibold">Demande envoyée avec succès 🎉</p>
            <p className="text-gray-600">
              Paiement manuel requis :{" "}
              <b className="text-orange-600">{CERTIFICATION_PRICE.toLocaleString()} FCFA</b>
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
              La certification sera activée après validation du paiement par l’administrateur.
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
