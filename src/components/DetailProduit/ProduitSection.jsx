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
  // 📞 WhatsApp (format international si possible)
  const whatsappNumber = produit?.vendeur?.telephone;
  const whatsappLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/\s+/g, "")}`
    : null;

  return (
    <div className="rounded-2xl p-6 grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white/90 backdrop-blur">
      {/* IMAGES PRODUIT */}
      <ImageProduit images={produit.images || [PLACEHOLDER]} />

      <div className="flex flex-col gap-5">
        {/* INFOS PRODUIT */}
        <InfoProduit produit={produit} />

        {/* AJOUT PANIER */}
        <button
          onClick={onAddPanier}
          className="w-full py-4 bg-yellow-600 text-black text-xl font-bold rounded-full hover:bg-yellow-700 transition"
        >
          <FiShoppingCart className="inline mr-2" />
          Ajouter au panier
        </button>

        {/* ACTIONS VENDEUR (SANS AFFICHAGE INFO) */}
        <div className="flex gap-3 flex-wrap">
          {/* WHATSAPP */}
          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-full hover:bg-green-700 transition"
            >
              <FiMessageCircle size={16} />
              WhatsApp
            </a>
          )}

          {/* PROFIL VENDEUR */}
          <button
            onClick={onVoirVendeur}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-full hover:bg-gray-100 transition"
          >
            <FiUser size={16} />
            Profil vendeur
          </button>
        </div>

        {/* AVIS */}
        <AvisProduit
          produitId={produit._id}
          avisInit={avis}
          onAvisAjoute={onAvisAjoute}
        />
      </div>
    </div>
  );
}
