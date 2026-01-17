import { useEffect, useState } from "react";
import axios from "axios";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiShoppingBag,
  FiInfo,
} from "react-icons/fi";
import ProductCard from "../Produit/ProductCard";

export default function ProfilVendeurPublicComp({
  vendeur,
  loading,
  error,
}) {
  const [produits, setProduits] = useState([]);
  const [loadingProduits, setLoadingProduits] = useState(false);

  /* ================= FETCH PRODUITS DU VENDEUR ================= */
  useEffect(() => {
    if (!vendeur?._id) return;

    const fetchProduits = async () => {
      setLoadingProduits(true);
      try {
       const res = await api.get(`/produits?vendeur=${vendeur._id}`);

        setProduits(res.data?.produits || res.data || []);
      } catch (err) {
        console.error("❌ Erreur produits vendeur", err);
        setProduits([]);
      } finally {
        setLoadingProduits(false);
      }
    };

    fetchProduits();
  }, [vendeur]);

  /* ================= RENDUS ================= */
  if (loading) {
    return (
      <div className="flex justify-center py-20 text-gray-400">
        Chargement du vendeur…
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-20">
        {error}
      </div>
    );
  }

  if (!vendeur) return null;

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-10">
      {/* ================= PROFIL VENDEUR ================= */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <div className="flex items-center gap-5">
          <img
            src={
              vendeur.avatar ||
              "https://via.placeholder.com/150?text=Vendeur"
            }
            alt="Avatar vendeur"
            className="w-20 h-20 rounded-full object-cover border"
          />

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {vendeur.nomBoutique}
            </h1>
            <p className="text-gray-600 text-sm">
              {vendeur.nomVendeur}
            </p>

            {vendeur.typeBoutique && (
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <FiShoppingBag />
                {vendeur.typeBoutique}
              </div>
            )}
          </div>
        </div>

        {/* DESCRIPTION BOUTIQUE */}
        {(vendeur.descriptionBoutique || vendeur.description) && (
          <div className="flex gap-2 text-gray-700 text-sm leading-relaxed">
            <FiInfo className="mt-1 text-gray-400" />
            <p>
              {vendeur.descriptionBoutique || vendeur.description}
            </p>
          </div>
        )}

        {/* INFOS */}
        <div className="space-y-2 text-gray-700 text-sm">
          {vendeur.telephone && (
            <div className="flex items-center gap-2">
              <FiPhone />
              {vendeur.telephone}
            </div>
          )}

          {vendeur.email && (
            <div className="flex items-center gap-2">
              <FiMail />
              {vendeur.email}
            </div>
          )}

          {vendeur.adresseBoutique && (
            <div className="flex items-center gap-2">
              <FiMapPin />
              {vendeur.adresseBoutique}
            </div>
          )}
        </div>
      </div>

      {/* ================= PRODUITS DU VENDEUR ================= */}
      <section>
        <h2 className="text-xl font-bold mb-4">
          Produits du vendeur
        </h2>

        {loadingProduits ? (
          <p className="text-gray-400">Chargement des produits…</p>
        ) : produits.length === 0 ? (
          <p className="text-gray-500">
            Aucun produit publié pour le moment
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {produits.map((p) => (
              <ProductCard key={p._id} produit={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
