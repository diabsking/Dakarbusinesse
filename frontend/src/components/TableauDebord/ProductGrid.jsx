import { useEffect, useState } from "react";
import api from "../../services/api";
import ProductCard, { ProductCardSkeleton } from "./ProductCard";

const ProductGrid = () => {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const res = await api.get("/api/produits/mes-produits");

        const produitsRecents = (res.data.data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setProduits(produitsRecents);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger vos produits");
      } finally {
        setLoading(false);
      }
    };

    fetchProduits();
  }, []);

  const supprimerProduit = async (id) => {
    try {
      await api.delete(`/api/produits/${id}`);
      setProduits((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
        "Erreur lors de la suppression"
      );
    }
  };

  if (loading) {
    return (
      <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, idx) => (
          <ProductCardSkeleton key={idx} />
        ))}
      </section>
    );
  }

  if (error) return <p className="text-red-600">{error}</p>;
  if (produits.length === 0)
    return <p className="text-gray-600">Aucun produit trouvé.</p>;

  return (
    <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
      {produits.map((produit) => (
        <ProductCard
          key={produit._id}
          produit={produit}
          onDelete={supprimerProduit}
        />
      ))}
    </section>
  );
};

export default ProductGrid;
