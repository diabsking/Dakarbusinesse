import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import ProfilVendeurPublic from "../components/Vendeur/ProfilVendeurPublicComp";

export default function ProfilVendeurPublicPage() {
  const { id } = useParams();

  const [vendeur, setVendeur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("🔄 Page ProfilVendeurPublicPage");
    console.log("🆔 ID vendeur :", id);

    const fetchVendeur = async () => {
      try {
        console.log(`🌍 GET http://localhost:5000/api/vendeur/${id}`);
        const res = await api.get(`/api/vendeur/${id}`);
        console.log("✅ Vendeur reçu :", res.data);
        setVendeur(res.data);
      } catch (err) {
        console.error("❌ Erreur fetch vendeur");
        console.error(err.response?.data || err.message);
        setError("Vendeur introuvable");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVendeur();
    } else {
      setError("ID vendeur manquant");
      setLoading(false);
    }
  }, [id]);

  /* =====================
     SKELETON PROFIL
  ====================== */
  const renderSkeleton = () => (
    <div className="w-full min-h-screen animate-pulse space-y-4 bg-white">
      <div className="flex flex-col items-center gap-3 pt-6">
        <div className="w-32 h-32 bg-gray-200 rounded-full" />
        <div className="h-6 w-48 bg-gray-200 rounded" />
        <div className="h-4 w-64 bg-gray-200 rounded" />
        <div className="h-4 w-40 bg-gray-200 rounded" />
      </div>

      <div className="px-4 space-y-3 mt-6">
        <div className="h-6 w-32 bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-white overflow-x-hidden">
      {loading ? (
        renderSkeleton()
      ) : error ? (
        <p className="text-center text-red-600 mt-10">{error}</p>
      ) : (
        <ProfilVendeurPublic vendeur={vendeur} />
      )}
    </div>
  );
}
