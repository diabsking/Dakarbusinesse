import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiStar } from "react-icons/fi";

export default function ProduitsEnVedette() {
  const navigate = useNavigate();

  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Produits de secours (UI fallback)
  const produitsFallback = [
    {
      _id: "demo1",
      nom: "Produit populaire",
      prixActuel: 15000,
      images: ["/placeholder.png"],
    },
    {
      _id: "demo2",
      nom: "Article tendance",
      prixActuel: 22000,
      images: ["/placeholder.png"],
    },
    {
      _id: "demo3",
      nom: "Meilleure vente",
      prixActuel: 9800,
      images: ["/placeholder.png"],
    },
  ];

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const res = await axios.get("/api/produits/plus-commandes");
        const data = Array.isArray(res.data?.produits)
          ? res.data.produits
          : [];

        setProduits(data.length > 0 ? data : produitsFallback);
      } catch (err) {
        console.error("Erreur récupération produits en vedette :", err);
        setError(true);
        setProduits(produitsFallback);
      } finally {
        setLoading(false);
      }
    };

    fetchProduits();
  }, []);

  return (
    <section className="mb-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 flex items-center gap-2">
          <FiStar className="text-yellow-500" />
          Produits en vedette
        </h2>

        <button
          onClick={() => navigate("/produits")}
          className="text-sm font-semibold text-orange-600 hover:underline"
        >
          Voir tout
        </button>
      </div>

      {/* Loader */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-4 rounded-2xl border animate-pulse"
            >
              <div className="h-40 bg-gray-200 rounded-xl mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      )}

      {/* Produits */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {produits.map((p) => (
            <div
              key={p._id}
              onClick={() => navigate(`/produit/${p._id}`)}
              className="relative p-4 bg-white border rounded-3xl shadow-sm hover:shadow-xl transition cursor-pointer"
            >
              {/* Badge */}
              <span className="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                Vedette
              </span>

              {/* Image */}
              <div className="h-44 mb-4 overflow-hidden rounded-2xl bg-gray-100">
                <img
                  src={p.images?.[0] || "/placeholder.png"}
                  alt={p.nom || "Produit"}
                  className="w-full h-full object-cover transition duration-500 hover:scale-105"
                />
              </div>

              {/* Infos */}
              <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">
                {p.nom || "Produit"}
              </h3>

              <p className="text-lg font-bold text-orange-600">
                {Number(p.prixActuel || 0).toLocaleString()} FCFA
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Message erreur (optionnel) */}
      {error && (
        <p className="text-sm text-gray-400 mt-4 text-center">
          Affichage temporaire de produits populaires
        </p>
      )}
    </section>
  );
}
