import { FiShoppingCart, FiMessageCircle, FiUser } from "react-icons/fi";
import ImageProduit from "../Produit/ImageProduit";
import InfoProduit from "../Produit/InfoProduit";
import AvisProduit from "../Produit/AvisProduit";

const PLACEHOLDER = "/placeholder.png";

export default function ProduitSection({
  produit,
  avis,
  onAddPanier,
  onVoirVendeur,
  onAvisAjoute,
}) {
  const whatsappNumber = produit?.vendeur?.telephone;
  const whatsappLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/\s+/g, "")}`
    : null;

  return (
    <section className="bg-white/90 backdrop-blur rounded-2xl shadow-sm p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* IMAGES PRODUIT */}
        <div className="w-full">
          <ImageProduit images={produit?.images || [PLACEHOLDER]} />
        </div>

        {/* INFOS + ACTIONS */}
        <div className="flex flex-col gap-5">
          {/* INFOS PRODUIT */}
          <InfoProduit produit={produit} />

          {/* CTA PANIER */}
          <button
            onClick={onAddPanier}
            className="
              w-full
              py-4
              bg-yellow-600
              text-black
              text-lg sm:text-xl
              font-bold
              rounded-full
              hover:bg-yellow-700
              active:scale-[0.98]
              transition
            "
          >
            <FiShoppingCart className="inline mr-2" />
            Ajouter au panier
          </button>

          {/* ACTIONS VENDEUR */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* WHATSAPP */}
            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-5
                  py-3
                  bg-green-600
                  text-white
                  text-sm
                  font-semibold
                  rounded-full
                  hover:bg-green-700
                  transition
                "
              >
                <FiMessageCircle size={16} />
                WhatsApp
              </a>
            )}

            {/* PROFIL VENDEUR */}
            <button
              onClick={onVoirVendeur}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                px-5
                py-3
                border
                border-gray-300
                text-gray-700
                text-sm
                font-semibold
                rounded-full
                hover:bg-gray-100
                transition
              "
            >
              <FiUser size={16} />
              Profil vendeur
            </button>
          </div>

          {/* AVIS */}
          <div className="pt-2">
            <AvisProduit
              produitId={produit._id}
              avisInit={avis}
              onAvisAjoute={onAvisAjoute}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
