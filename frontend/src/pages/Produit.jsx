import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/Produit/ProductCard";
import useProduitFilter from "../components/Produit/useProduitFilter";


export default function Produit() {
  const { nom } = useParams();
  const categorieActive = nom ? decodeURIComponent(nom) : "Tous";

  const [searchParams] = useSearchParams();
  const recherche = searchParams.get("q") || "";

  const [loading, setLoading] = useState(true);
  const [produits, setProduits] = useState([]);
  const [prixMax] = useState(1000000);
  const [filtreSpecial] = useState(null);

  /* =====================================================
     📥 FETCH + TRI FRONTEND (UNE SEULE FOIS)
  ===================================================== */
  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/produits"
        );

        const produitsActifs = (res.data.produits || []).filter(
          (p) => p.actif === true
        );

        // 🔥 TRI MÉTIER FRONTEND
        const produitsTries = [...produitsActifs].sort((a, b) => {
          // 1️⃣ Produits boostés
          if (a.estBooster && !b.estBooster) return -1;
          if (!a.estBooster && b.estBooster) return 1;

          // 2️⃣ Vendeur certifié
          const certA = a.vendeur?.certifie ? 1 : 0;
          const certB = b.vendeur?.certifie ? 1 : 0;
          if (certA !== certB) return certB - certA;

          // 3️⃣ Date de boost (récent → ancien)
          const dateA = a.dateDebutBoost
            ? new Date(a.dateDebutBoost).getTime()
            : 0;
          const dateB = b.dateDebutBoost
            ? new Date(b.dateDebutBoost).getTime()
            : 0;

          return dateB - dateA;
        });

        setProduits(produitsTries);
      } catch (err) {
        console.error("❌ Erreur récupération produits :", err);
        setProduits([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProduits();
  }, []);

  /* =====================================================
     🔍 FILTRES (catégorie, recherche, prix, etc.)
  ===================================================== */
  const produitsFiltres = useProduitFilter({
    produits,
    categorieActive,
    recherche,
    prixMax,
    filtreSpecial,
  });

  /* =====================================================
     ⏳ SKELETON LOADER
  ===================================================== */
  const renderSkeleton = () => (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-10">
      <div className="max-w-[1600px] mx-auto space-y-4">
        <div className="h-8 w-1/3 bg-gray-300 rounded animate-pulse" />

        {recherche && (
          <div className="h-6 w-1/2 bg-gray-300 rounded animate-pulse" />
        )}

        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-200px)]">
          <div
            className="
              grid
              grid-cols-2
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-5
              gap-2 md:gap-3
              min-w-[400px] sm:min-w-[400px] md:min-w-[900px]
            "
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-300 h-48 rounded-md animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  /* =====================================================
     🧠 RENDER
  ===================================================== */
  if (loading) return renderSkeleton();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-6 space-y-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {categorieActive === "Tous"
            ? "Tous les produits"
            : categorieActive}
        </h1>

        {recherche && (
          <p className="text-gray-600">
            Résultat pour :{" "}
            <span className="font-medium">{recherche}</span>
          </p>
        )}

        {produitsFiltres.length === 0 ? (
          <div className="text-center text-gray-600 mt-20">
            Aucun produit trouvé.
          </div>
        ) : (
          <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-200px)]">
            <div
              className="
                grid
                grid-cols-2
                sm:grid-cols-2
                md:grid-cols-3
                lg:grid-cols-5
                gap-2 md:gap-3
                min-w-[400px] sm:min-w-[400px] md:min-w-[900px]
              "
            >
              {produitsFiltres.map((produit) => (
                <ProductCard
                  key={produit._id}
                  produit={produit}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
