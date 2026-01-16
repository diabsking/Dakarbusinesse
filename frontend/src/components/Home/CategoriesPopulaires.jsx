import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CategoriesPopulaires() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/produits");

        const data = Array.isArray(res.data)
          ? res.data
          : res.data.produits || [];

        // ⭐ aperçu homepage : max 6 produits
        setProduits(data.slice(0, 6));
      } catch (error) {
        console.error("Erreur récupération produits :", error);
        setProduits([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProduits();
  }, []);

  return (
    <section className="mb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold">
          Produits populaires
        </h2>
        <span className="text-sm text-gray-400">
          
        </span>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="border border-gray-300 rounded-lg bg-white p-4 animate-pulse"
            >
              <div className="h-40 bg-gray-200 rounded mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : produits.length === 0 ? (
        <p className="text-gray-500 text-center py-12">
          Aucun produit disponible
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {produits.map((p) => {
            const imageSrc =
              Array.isArray(p.images) && p.images.length > 0
                ? p.images[0]
                : "/placeholder.jpg";

            return (
              <div
                key={p._id}
                onClick={() => navigate(`/produit/${p._id}`)}
                className="cursor-pointer border border-gray-300 rounded-lg bg-white bg-opacity-95 hover:shadow-lg transition"
              >
                {/* Image — hauteur augmentée */}
                <div className="h-40 flex items-center justify-center bg-gray-50 rounded-t-lg overflow-hidden">
                  <img
                    src={imageSrc}
                    alt={p.nom}
                    loading="lazy"
                    className="max-h-[90%] max-w-[90%] object-contain"
                  />
                </div>

                {/* Infos */}
                <div className="p-4 space-y-1">
                  <h4 className="font-semibold text-sm truncate">
                    {p.nom}
                  </h4>

                  <p className="text-sm font-bold text-black">
                    {p.prixActuel
                      ? p.prixActuel.toLocaleString()
                      : "—"}{" "}
                    FCFA
                  </p>

                  <p className="text-xs text-bleu-400">
                    Paiement à la livraison
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
