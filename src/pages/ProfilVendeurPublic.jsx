import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
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

        const res = await axios.get(`http://localhost:5000/api/vendeur/${id}`);

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
    <div className="p-4 md:p-6 max-w-4xl mx-auto animate-pulse space-y-4">
      <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto md:mx-0" />
      <div className="space-y-2 mt-4 md:mt-0">
        <div className="h-6 w-48 bg-gray-200 rounded mx-auto md:mx-0" />
        <div className="h-4 w-64 bg-gray-200 rounded mx-auto md:mx-0" />
        <div className="h-4 w-40 bg-gray-200 rounded mx-auto md:mx-0" />
      </div>
      <div className="h-6 w-32 bg-gray-200 rounded mt-6 mx-auto md:mx-0" />
      <div className="h-4 w-full bg-gray-200 rounded mt-2" />
      <div className="h-4 w-full bg-gray-200 rounded mt-2" />
      <div className="h-4 w-3/4 bg-gray-200 rounded mt-2" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
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
