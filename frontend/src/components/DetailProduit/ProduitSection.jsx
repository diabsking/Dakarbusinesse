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

  // 🎯 props nécessaires pour la galerie
  images,
  imageActive,
  setImageActive,
}) {

  const normalizePhone = (num, defaultCountryCode = "221") => {
    if (!num) return null;

    // 1) enlever tout ce qui n'est pas chiffre
    let clean = String(num).replace(/[^\d]/g, "");

    // 2) gérer le cas "00" au début (ex: 00221...)
    if (clean.startsWith("00")) {
      clean = clean.slice(2);
    }

    // 3) si commence par "0" => enlever le 0 et ajouter l'indicatif
    if (clean.startsWith("0")) {
      clean = defaultCountryCode + clean.slice(1);
    }

    // 4) si commence par l'indicatif (ex: 221...) on le garde tel quel.
    //    Si le numéro est court, on le rejette (min 8 chiffres)
    if (clean.length < 8) return null;

    return clean;
  };

  const whatsappNumber = produit?.vendeur?.telephone;
  const whatsappClean = normalizePhone(whatsappNumber);

  const whatsappLink = whatsappClean
    ? `https://wa.me/${whatsappClean}`
    : null;

  return (
    <section className="bg-white/90 backdrop-blur rounded-2xl shadow-sm p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* IMAGES PRODUIT */}
        <div className="w-full">
          <ImageProduit
            images={images}
            imageActive={imageActive}
            setImageActive={setImageActive}
          />
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
