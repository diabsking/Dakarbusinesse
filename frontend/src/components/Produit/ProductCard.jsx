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
      <div className="w-full aspect-square bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
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

  const vendeur =
    produit.vendeur && typeof produit.vendeur === "object"
      ? produit.vendeur
      : null;

  const vendeurId = vendeur?._id;
  const nomVendeur = vendeur?.nomBoutique || vendeur?.nomVendeur || "Vendeur";
  const avatarVendeur = vendeur?.avatar || SHOP_PLACEHOLDER;
  const adresseVendeur =
    typeof vendeur?.adresseBoutique === "string"
      ? vendeur.adresseBoutique.trim()
      : "";
  const vendeurCertifie = vendeur?.certifie === true;

  /* ======================================================
     📱 MOBILE VERSION (2 par ligne + scroll horizontal)
  ====================================================== */
  return (
    <>
      {/* ================= MOBILE ================= */}
      <div className="md:hidden">
        <div className="w-[48vw] flex-shrink-0">
          <Link to={`/produit/${produit._id}`}>
            <div className="aspect-square bg-gray-100 overflow-hidden rounded-lg">
              <img
                src={produit.images?.[0] || PLACEHOLDER}
                alt={produit.nom}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </Link>

          <div className="mt-2 space-y-1">
            {/* PRIX */}
            <span className="text-orange-500 font-bold text-sm">
              {prixActuel.toLocaleString()} FCFA
            </span>

            {/* DESCRIPTION */}
            <p className="text-xs text-gray-700 line-clamp-1">
              {produit.description}
            </p>

            {/* VENDEUR */}
            {vendeur && vendeurId && (
              <Link
                to={`/vendeur/${vendeurId}`}
                className="flex items-center gap-1 mt-1"
              >
                <img
                  src={avatarVendeur}
                  alt={nomVendeur}
                  className="w-5 h-5 rounded-full object-cover border"
                />
                <span className="text-[11px] font-medium truncate">
                  {nomVendeur}
                </span>
                {vendeurCertifie && (
                  <BsPatchCheckFill className="text-blue-600 text-xs" />
                )}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ================= DESKTOP (INCHANGÉ) ================= */}
      <div className="hidden md:block">
        <div className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition relative group">
          <Link to={`/produit/${produit._id}`}>
            <div className="w-full aspect-[4/3] bg-gray-100 overflow-hidden border-b">
              <img
                src={produit.images?.[0] || PLACEHOLDER}
                alt={produit.nom}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          </Link>

          <div className="px-4 py-3 flex flex-col justify-between min-h-[220px]">
            <div>
              <Link to={`/produit/${produit._id}`}>
                <h2 className="text-lg font-semibold text-black line-clamp-1">
                  {produit.nom}
                </h2>
                <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                  {produit.description}
                </p>
              </Link>

              <div className="mt-2">
                <span className="text-orange-500 font-bold text-lg">
                  {prixActuel.toLocaleString()} FCFA
                </span>
              </div>

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
                      <span className="text-xs font-semibold truncate">
                        {nomVendeur}
                      </span>
                      {vendeurCertifie && (
                        <BsPatchCheckFill className="text-blue-600" />
                      )}
                    </div>
                  </div>

                  {adresseVendeur && (
                    <div className="flex items-center gap-1 text-[11px] text-gray-500 truncate mt-0.5">
                      <FiMapPin className="text-gray-400" />
                      <span>{adresseVendeur}</span>
                    </div>
                  )}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
