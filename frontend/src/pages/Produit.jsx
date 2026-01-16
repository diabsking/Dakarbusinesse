import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ProductCard from "../components/Produit/ProductCard";
import useProduitFilter from "../components/Produit/useProduitFilter";
import api from "../services/api";

export default function Produit() {
  const { nom } = useParams();
  const categorieActive = nom ? decodeURIComponent(nom) : "Tous";

  const [searchParams] = useSearchParams();
  const recherche = searchParams.get("q") || "";

  const [loading, setLoading] = useState(true);
  const [produits, setProduits] = useState([]);
  const [prixMax] = useState(1000000);
  const [filtreSpecial] = useState(null);

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const res = await api.get("/produits");

        if (!res.data?.produits) {
          console.error("❌ Réponse backend invalide :", res.data);
          setProduits([]);
          return;
        }

        const produitsActifs = res.data.produits.filter(
          (p) => p.actif === true && p.publie === true
        );

        const produitsTries = [...produitsActifs].sort((a, b) => {
          if (a.estBooster && !b.estBooster) return -1;
          if (!a.estBooster && b.estBooster) return 1;

          const certA = a.vendeur?.certifie ? 1 : 0;
          const certB = b.vendeur?.certifie ? 1 : 0;
          if (certA !== certB) return certB - certA;

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

  const produitsFiltres = useProduitFilter({
    produits,
    categorieActive,
    recherche,
    prixMax,
    filtreSpecial,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        Chargement...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-[1600px] mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">
          {categorieActive === "Tous"
            ? "Tous les produits"
            : categorieActive}
        </h1>

        {produitsFiltres.length === 0 ? (
          <div className="text-center text-gray-600 mt-20">
            Aucun produit trouvé.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {produitsFiltres.map((produit) => (
              <ProductCard key={produit._id} produit={produit} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
