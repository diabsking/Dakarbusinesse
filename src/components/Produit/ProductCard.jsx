import { Link } from "react-router-dom";
import { FiMapPin } from "react-icons/fi";
import { BsPatchCheckFill } from "react-icons/bs";

const PLACEHOLDER = "/placeholder.png";
const SHOP_PLACEHOLDER = "/shop-placeholder.png";

/* ======================
   Skeleton Loader
====================== */
export function ProductCardSkeleton() {
  return (
    <div className="w-full sm:w-64 bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
      <div className="w-full h-56 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-2/3 mt-2" />
      </div>
    </div>
  );
}

/* ======================
   ProductCard principal
====================== */
export default function ProductCard({ produit }) {
  if (!produit) return <ProductCardSkeleton />;

  const prixActuel = Number(produit.prixActuel ?? produit.prix) || 0;
  const prixAncien = Number(produit.prixInitial) || 0;
  const hasReduction = prixAncien > prixActuel && prixActuel > 0;
  const reductionPercent = hasReduction
    ? Math.round(((prixAncien - prixActuel) / prixAncien) * 100)
    : 0;

  const getShortDescription = (text = "") => {
    const phrases = text.split(".").filter(Boolean);
    return phrases.slice(0, 2).join(". ") + (phrases.length > 2 ? "..." : "");
  };

  const isLocal =
    produit.origine?.toLowerCase() === "local" ||
    produit.paysOrigine?.toLowerCase() === "senegal";

  const isNewProduct = produit.createdAt
    ? Date.now() - new Date(produit.createdAt).getTime() < 24 * 60 * 60 * 1000
    : false;

  const isAvailable = produit.stock === undefined || produit.stock > 0;

  const vendeur =
    produit.vendeur && typeof produit.vendeur === "object" ? produit.vendeur : null;
  const vendeurId = vendeur?._id;
  const nomVendeur = vendeur?.nomBoutique || vendeur?.nomVendeur || "Vendeur";
  const avatarVendeur = vendeur?.avatar || SHOP_PLACEHOLDER;
  const adresseVendeur =
    typeof vendeur?.adresseBoutique === "string"
      ? vendeur.adresseBoutique.trim()
      : "";
  const vendeurCertifie = vendeur?.certifie === true;

  return (
    <div className="w-full sm:w-64 bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition relative group">

      {/* BADGE PROMO */}
      {hasReduction && (
        <span className="absolute top-3 left-3 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
          -{reductionPercent}%
        </span>
      )}

      {/* IMAGE PRODUIT */}
      <Link to={`/produit/${produit._id}`}>
        <div className="w-full h-56 bg-gray-100 overflow-hidden border-b">
          <img
            src={produit.images?.[0] || PLACEHOLDER}
            alt={produit.nom}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </Link>

      {/* CONTENU */}
      <div className="px-4 py-3 flex flex-col justify-between h-60">
        <div>
          <Link to={`/produit/${produit._id}`}>
            <h2 className="text-lg font-semibold text-black line-clamp-1">
              {produit.nom}
            </h2>
            <p className="text-sm text-gray-700 mt-1 line-clamp-2">
              {getShortDescription(produit.description)}
            </p>
          </Link>

          {/* PRIX */}
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="text-orange-500 font-bold text-lg">
              {prixActuel.toLocaleString()} FCFA
            </span>
            {hasReduction && (
              <span className="text-gray-400 line-through text-sm">
                {prixAncien.toLocaleString()} FCFA
              </span>
            )}
          </div>

          {/* BADGES */}
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
            {hasReduction && (
              <span className="text-red-700 bg-red-100 border border-red-200 px-2 py-0.5 rounded">
                Promo
              </span>
            )}
            {isNewProduct && (
              <span className="text-yellow-600">Nouveauté</span>
            )}
            <span className={isLocal ? "text-green-600" : "text-blue-600"}>
              {isLocal ? "Produit local 🇸🇳" : "Produit étranger 🌍"}
            </span>
          </div>

          {/* VENDEUR CLICKABLE */}
          {vendeur && vendeurId && (
            <Link
              to={`/vendeur/${vendeurId}`}
              className="mt-3 block rounded p-1 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-2">
                <img
                  src={avatarVendeur}
                  alt={nomVendeur}
                  className="w-8 h-8 rounded-full object-cover border"
                />
                <div className="flex items-center gap-1 truncate">
                  <span className="text-xs font-semibold truncate">{nomVendeur}</span>
                  {vendeurCertifie && (
                    <BsPatchCheckFill
                      className="text-blue-600"
                      title="Vendeur certifié"
                    />
                  )}
                </div>
              </div>
              {adresseVendeur !== "" && (
                <div className="flex items-center gap-1 text-[11px] text-gray-500 truncate mt-0.5">
                  <FiMapPin className="text-gray-400" />
                  <span>{adresseVendeur}</span>
                </div>
              )}
            </Link>
          )}
        </div>

        {/* DISPONIBILITÉ */}
        <div className="pt-2 border-t text-sm font-semibold flex items-center gap-2 flex-wrap">
          <span className={isAvailable ? "text-green-600" : "text-red-600"}>
            {isAvailable ? "Disponible" : "Indisponible"}
          </span>
          {produit.delaiLivraison && (
            <>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600 font-normal">
                Livré en {produit.delaiLivraison}j
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
