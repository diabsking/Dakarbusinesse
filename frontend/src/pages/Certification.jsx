import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsPatchCheckFill } from "react-icons/bs";

export default function Certification() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [demandeEnvoyee, setDemandeEnvoyee] = useState(false);
  const [certification, setCertification] = useState(null);

  /* ================= CONFIG CERTIFICATION ================= */
  const CERTIFICATION_PRICE = 5000;
  const WAVE_BASE_LINK = "https://pay.wave.com/m/M_sn_hHeTj4ufIvYG";

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

    // Redirige si déjà certifié
    if (parsedUser.certifie === true) {
      navigate("/dashboard");
      return;
    }

    setUser(parsedUser);

    // Si demande déjà envoyée
    if (parsedUser.demandeCertification === true) {
      setDemandeEnvoyee(true);
      setCertification(parsedUser.certification || null);
    }
  }, [navigate]);

  /* ================= DEMANDE CERTIFICATION (LOCALE) ================= */
  const envoyerDemandeCertification = () => {
    if (demandeEnvoyee) return;

    const newCertification = { _id: Date.now() }; // ID temporaire pour Wave

    setCertification(newCertification);
    setDemandeEnvoyee(true);

    const updatedUser = {
      ...user,
      demandeCertification: true,
      certification: newCertification,
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Chargement...
      </div>
    );
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
          <button
            onClick={envoyerDemandeCertification}
            className="w-full bg-orange-600 text-black py-2 rounded-lg font-semibold"
          >
            Demander la certification
          </button>
        ) : (
          <div className="space-y-4">
            <p className="text-green-600 font-semibold">Demande envoyée avec succès 🎉</p>
            <p className="text-gray-600">
              Paiement manuel requis : <b className="text-orange-600">{CERTIFICATION_PRICE.toLocaleString()} FCFA</b>
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
