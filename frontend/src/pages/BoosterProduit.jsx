import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function BoosterProduit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [produit, setProduit] = useState(null);
  const [duree, setDuree] = useState(7);
  const [waveNumber, setWaveNumber] = useState("");
  const [demandeEnvoyee, setDemandeEnvoyee] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= CONFIG BOOST ================= */
  const BOOSTS = {
    7: { montant: 500 },
    15: { montant: 1000 },
    30: { montant: 1500 },
  };

  const WAVE_BASE_LINK =
    "https://pay.wave.com/m/M_sn_hHeTj4ufIvYG/c/sn/";

  const wavePaymentLink = `${WAVE_BASE_LINK}?amount=${BOOSTS[duree].montant}`;

  /* ================= VALIDATION ID ================= */
  useEffect(() => {
    if (!id || id.length !== 24) {
      navigate("/tableau-de-bord");
    }
  }, [id, navigate]);

  /* ================= CHARGER PRODUIT ================= */
  useEffect(() => {
    const fetchProduit = async () => {
      try {
        const res = await api.get(`/api/produits/${id}`);
        setProduit(res.data.produit);
      } catch {
        navigate("/dashboard");
      }
    };
    fetchProduit();
  }, [id, navigate]);

  /* ================= DEMANDE BOOST ================= */
  const handleDemandeBoost = async () => {
    setError("");

    // validation Wave
    const waveRegex = /^(77|78|76|70)\d{7}$/;
    if (!waveRegex.test(waveNumber)) {
      setError("Veuillez entrer un numéro Wave valide (07xxxxxxxx).");
      return;
    }

    // validation produit déjà boosté
    const maintenant = new Date();
    if (produit.estBooster && produit.dateFinBoost > maintenant) {
      setError("Ce produit est déjà boosté.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/api/produits/boost/demande", {
        produitId: id,
        duree,
        waveNumber,
      });

      setDemandeEnvoyee(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Erreur lors de l’envoi de la demande"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!produit) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Chargement...
      </div>
    );
  }

  const imageSrc =
    produit.images?.length > 0 ? produit.images[0] : "/placeholder.jpg";

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-6">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow">
        <div className="h-48 bg-gray-100 flex items-center justify-center rounded-t-xl">
          <img
            src={imageSrc}
            alt={produit.nom}
            className="h-full object-contain"
          />
        </div>

        <div className="p-4 space-y-5">
          <div className="text-center">
            <h2 className="text-lg font-bold">{produit.nom}</h2>
            <p className="text-green-600 font-semibold mt-1">
              {produit.prixActuel?.toLocaleString("fr-FR")} FCFA
            </p>
          </div>

          {!demandeEnvoyee ? (
            <>
              <div>
                <label className="text-sm font-medium">Numéro Wave</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="07xxxxxxxx"
                  value={waveNumber}
                  onChange={(e) => setWaveNumber(e.target.value)}
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-base focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Durée du boost
                </label>
                <select
                  value={duree}
                  onChange={(e) => setDuree(Number(e.target.value))}
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                >
                  <option value={7}>7 jours – 500 FCFA</option>
                  <option value={15}>15 jours – 1 000 FCFA</option>
                  <option value={30}>30 jours – 1 500 FCFA</option>
                </select>
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">
                  {error}
                </p>
              )}

              <button
                onClick={handleDemandeBoost}
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
              >
                {loading ? "Envoi..." : "Demander le boost"}
              </button>
            </>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-green-700 font-semibold">
                Demande envoyée avec succès 🎉
              </p>

              <p className="text-sm text-gray-600">
                Montant à payer :{" "}
                <b>{BOOSTS[duree].montant.toLocaleString()} FCFA</b>
              </p>

              <a
                href={wavePaymentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-600 text-white py-3 rounded-lg font-semibold"
              >
                Payer avec Wave
              </a>

              <p className="text-xs text-gray-500">
                Le boost sera activé après validation du paiement par
                l’administrateur.
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
    </div>
  );
}
