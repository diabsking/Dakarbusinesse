import { Link } from "react-router-dom";
import { FiMapPin } from "react-icons/fi";
import { BsPatchCheckFill } from "react-icons/bs";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules"; // <-- import correct
import "swiper/css";
import "swiper/css/pagination";

const PLACEHOLDER = "/placeholder.png";
const SHOP_PLACEHOLDER = "/shop-placeholder.png";

/* ======================
   Skeleton Loader
====================== */
export function ProductCardSkeleton() {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse">
      <div className="w-full h-[7cm] bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
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
  const reductionPercent = hasReduction
    ? Math.round(((prixAncien - prixActuel) / prixAncien) * 100)
    : 0;

  const getShortDescription = (text = "") => {
    const phrases = text.split(".").filter(Boolean);
    return phrases.slice(0, 2).join(". ") + (phrases.length > 2 ? "..." : "");
  };

  const isNewProduct = produit.createdAt
    ? Date.now() - new Date(produit.createdAt).getTime() < 24 * 60 * 60 * 1000
    : false;

  const vendeur =
    produit.vendeur && typeof produit.vendeur === "object"
      ? produit.vendeur
      : null;

  const vendeurId = vendeur?._id;
  const nomVendeur = vendeur?.nomBoutique || vendeur?.nomVendeur || "Vendeur";
  const avatarVendeur = vendeur?.avatar || SHOP_PLACEHOLDER;
  const vendeurCertifie = vendeur?.certifie === true;

  const Wrapper = ({ children }) =>
    isMock ? <div>{children}</div> : (
      <Link to={`/produit/${produit._id}`}>{children}</Link>
    );

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition relative group">
      {/* BADGE POURCENTAGE */}
      {hasReduction && (
        <span className="absolute top-3 left-3 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
          -{reductionPercent}%
        </span>
      )}

      {/* BADGE DEMO */}
      {isMock && (
        <span className="absolute top-3 right-3 z-10 bg-gray-800 text-white text-xs font-semibold px-2 py-1 rounded">
          Démo
        </span>
      )}

      {/* IMAGE PRODUIT AVEC SWIPER */}
      <Wrapper>
        <div className="w-full h-[7cm] bg-gray-100 overflow-hidden border-b">
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            slidesPerView={1}
            className="h-full"
          >
            {(produit.images?.length > 0 ? produit.images : [PLACEHOLDER]).map(
              (img, idx) => (
                <SwiperSlide key={idx}>
                  <img
                    src={img}
                    alt={produit.nom}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </SwiperSlide>
              )
            )}
          </Swiper>
        </div>
      </Wrapper>

      {/* CONTENU */}
      <div className="px-4 py-3 flex flex-col justify-between min-h-[220px]">
        <div>
          {/* VENDEUR */}
          {vendeur && vendeurId && !isMock && (
            <Link
              to={`/vendeur/${vendeurId}`}
              className="mb-2 block rounded p-1 hover:bg-gray-50 transition"
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
                    <BsPatchCheckFill
                      className="text-blue-600"
                      title="Vendeur certifié"
                    />
                  )}
                </div>
              </div>
            </Link>
          )}

          {/* NOM ET DESCRIPTION PRODUIT */}
          <Wrapper>
            <h2 className="text-base sm:text-lg font-semibold text-black line-clamp-1">
              {produit.nom}
            </h2>
            <p className="text-xs sm:text-sm text-gray-700 mt-1 line-clamp-2">
              {getShortDescription(produit.description)}
            </p>
          </Wrapper>

          {/* BADGE NOUVEAUTÉ */}
          {isNewProduct && (
            <span className="inline-block mt-2 text-yellow-600 text-xs font-semibold">
              Nouveauté
            </span>
          )}

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
        </div>
      </div>
    </div>
  );
}
