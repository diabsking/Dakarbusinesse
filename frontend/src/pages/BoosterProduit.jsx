import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { payerBoostProduit } from "../services/paiement.service";

export default function BoosterProduit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [produit, setProduit] = useState(null);
  const [duree, setDuree] = useState(7);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  /* ================= VALIDATION ID ================= */
  useEffect(() => {
    if (!id || id.length !== 24) {
      alert("Lien invalide");
      navigate("/dashboard");
    }
  }, [id, navigate]);

  /* ================= CHARGER LE PRODUIT ================= */
  useEffect(() => {
    const fetchProduit = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/produits/${id}`
        );
        setProduit(res.data.produit);
      } catch (error) {
        alert("Produit introuvable");
        navigate("/dashboard");
      }
    };

    if (id && id.length === 24) fetchProduit();
  }, [id, navigate]);

  /* ================= PAIEMENT ================= */
  const handlePaiement = async () => {
    if (!produit) return;

    try {
      setLoading(true);

      // Appel API paiement (Kkiapay / Wave)
      const res = await payerBoostProduit(
        { produitId: id, duree },
        token
      );

      // Selon l'API Kkiapay, le lien peut être payment_url ou invoice_url
      const paymentLink = res?.payment_url || res?.invoice_url;

      if (paymentLink) {
        window.location.href = paymentLink;
      } else {
        alert("Lien de paiement introuvable");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors du paiement");
    } finally {
      setLoading(false);
    }
  };

  if (!produit) {
    return (
      <div className="text-center mt-12 text-gray-500">
        Chargement du produit...
      </div>
    );
  }

  const imageSrc =
    Array.isArray(produit.images) && produit.images.length > 0
      ? produit.images[0]
      : "/placeholder.jpg";

  /* ================= UI BOOST ================= */
  return (
    <div className="max-w-xl mx-auto mt-12 bg-white rounded-xl shadow-lg overflow-hidden">
      {/* IMAGE PRODUIT */}
      <div className="h-64 bg-gray-100 flex items-center justify-center">
        <img
          src={imageSrc}
          alt={produit.nom}
          className="h-full object-contain"
        />
      </div>

      <div className="p-6 space-y-6">
        {/* INFOS PRODUIT */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {produit.nom}
          </h2>

          <p className="text-xl font-semibold text-green-600 mt-2">
            {produit.prixActuel?.toLocaleString("fr-FR")} FCFA
          </p>
        </div>

        {/* DURÉE BOOST */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Durée du boost
          </label>

          <select
            value={duree}
            onChange={(e) => setDuree(Number(e.target.value))}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
          >
            <option value={7}>7 jours – 500 FCFA</option>
            <option value={15}>15 jours – 1 000 FCFA</option>
            <option value={30}>30 jours – 1 500 FCFA</option>
          </select>
        </div>

        {/* BOUTON ACTION */}
        <button
          onClick={handlePaiement}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Redirection vers Wave..." : "BOOSTER N'EST PAS ENCORE FONCTIONNELLE. MERCI.."}
        </button>

        <p className="text-xs text-gray-500 text-center mt-2">
          Paiement sécurisé via Wave / Kkiapay
        </p>
      </div>
    </div>
  );
}
