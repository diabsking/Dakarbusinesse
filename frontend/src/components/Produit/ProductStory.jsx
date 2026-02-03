import { Link } from "react-router-dom";

const PLACEHOLDER = "/placeholder.png";

export default function ProductStory({ produit }) {
  if (!produit) return null;

  const isMock = produit.isMock === true;
  const image = produit.images?.[0] || PLACEHOLDER;

  const isNewProduct = produit.createdAt
    ? Date.now() - new Date(produit.createdAt).getTime() <
      7 * 24 * 60 * 60 * 1000 // 7 jours
    : false;

  const prix = Number(produit.prixActuel ?? produit.prix) || 0;
  const isBoosted = produit.estBooster === true;

  const Wrapper = ({ children }) =>
    isMock ? <div>{children}</div> : (
      <Link to={`/produit/${produit._id}`}>{children}</Link>
    );

  return (
    <Wrapper>
      <div className="flex flex-col items-center w-20 shrink-0 group cursor-pointer">
        {/* IMAGE */}
        <div className="relative">
          <div
            className={`
              w-16 h-16 rounded-full p-[2px]
              ${isBoosted ? "border-2 border-yellow-400" : "border-2 border-orange-500"}
            `}
          >
            <img
              src={image}
              alt={produit.nom}
              className="w-full h-full rounded-full object-cover transition group-hover:scale-105"
              loading="lazy"
            />
          </div>

          {/* BADGE NEW */}
          {isNewProduct && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
              NEW
            </span>
          )}

          {/* PRIX (hover / tap mobile) */}
          {prix > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-[10px] rounded-full opacity-0 group-hover:opacity-100 transition">
              {prix.toLocaleString()} FCFA
            </div>
          )}
        </div>

        {/* NOM */}
        <p className="mt-1 text-xs text-center line-clamp-2 text-gray-800">
          {produit.nom}
        </p>
      </div>
    </Wrapper>
  );
}
