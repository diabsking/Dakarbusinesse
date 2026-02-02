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
    <div className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse">
      <div className="w-full aspect-[4/3] bg-gray-200" />
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

  const isMock = produit.isMock === true;

  const prixActuel = Number(produit.prixActuel ?? produit.prix) || 0;
  const prixAncien = Number(produit.prixInitial) || 0;
  const hasReduction = prixAncien > prixActuel && prixActuel > 0;

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

  const vendeur =
    produit.vendeur && typeof produit.vendeur === "object"
      ? produit.vendeur
      : null;

  const vendeurCertifie = vendeur?.certifie === true;

  const Wrapper = ({ children }) =>
    isMock ? <div>{children}</div> : (
      <Link to={`/produit/${produit._id}`}>{children}</Link>
    );

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition relative group">
      {/* BADGE DEMO */}
      {isMock && (
        <span className="absolute top-3 right-3 z-10 bg-gray-800 text-white text-xs font-semibold px-2 py-1 rounded">
          Démo
        </span>
      )}

      {/* IMAGE PRODUIT */}
      <Wrapper>
        <div className="w-full aspect-[4/3] bg-gray-100 overflow-hidden border-b">
          <img
            src={produit.images?.[0] || PLACEHOLDER}
            alt={produit.nom}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </Wrapper>

      {/* CONTENU */}
      <div className="px-4 py-3 flex flex-col justify-between min-h-[220px]">
        <div>
          <Wrapper>
            {/* NOM PRODUIT + BADGE CERTIFIE */}
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-semibold text-black line-clamp-1">
                {produit.nom}
              </h2>
              {vendeurCertifie && (
                <BsPatchCheckFill
                  className="text-blue-600"
                  title="Vendeur certifié"
                />
              )}
            </div>

            {/* DESCRIPTION */}
            <p className="text-xs sm:text-sm text-gray-700 mt-1 line-clamp-2">
              {getShortDescription(produit.description)}
            </p>
          </Wrapper>

          {/* PRIX */}
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="text-orange-500 font-bold text-base sm:text-lg">
              {prixActuel.toLocaleString()} FCFA
            </span>
            {hasReduction && (
              <span className="text-gray-400 line-through text-xs sm:text-sm">
                {prixAncien.toLocaleString()} FCFA
              </span>
            )}
          </div>

          {/* BADGES */}
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
            {isNewProduct && (
              <span className="text-yellow-600">Nouveauté</span>
            )}
            {isLocal && (
              <span className="text-green-600">Produit local 🇸🇳</span>
            )}
          </div>

          {/* MESSAGE INCITATIF */}
          {isMock && (
            <div className="mt-3 text-xs text-gray-500 italic">
              Ce produit pourrait être le vôtre.
            </div>
          )}

          {/* VENDEUR (nom boutique supprimé) */}
          {vendeur && !isMock && (
            <Link
              to={`/vendeur/${vendeur._id}`}
              className="mt-3 block rounded p-1 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-2">
                <img
                  src={vendeur.avatar || SHOP_PLACEHOLDER}
                  alt="Vendeur"
                  className="w-8 h-8 rounded-full object-cover border"
                />
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
