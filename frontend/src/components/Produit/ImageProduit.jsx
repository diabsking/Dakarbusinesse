import React from "react";
import PropTypes from "prop-types";

const PLACEHOLDER = "/placeholder.png";

export default function ImageProduit({ images = [], imagePrincipale, setImagePrincipale }) {
  // Fonction pour sécuriser l'image
  const safeImage = (img) => (img && typeof img === "string" ? img : PLACEHOLDER);

  // Images secondaires (max 5)
  const imagesSecondaires = images?.slice(0, 5) || [];

  // Si aucune image principale n’est définie, prendre la première secondaire
  const mainImage = safeImage(imagePrincipale || imagesSecondaires[0]);

  return (
    <div className="flex flex-col gap-4 items-center">
      {/* IMAGE PRINCIPALE FIXÉE */}
      <img
        src={mainImage}
        onError={(e) => (e.target.src = PLACEHOLDER)}
        alt="Produit"
        className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] object-cover rounded-xl shadow-sm"
      />

      {/* IMAGES SECONDAIRES */}
      {imagesSecondaires.length > 0 && (
        <div className="flex gap-3 mt-2 overflow-x-auto scrollbar-hide">
          {imagesSecondaires.map((img, index) => (
            <img
              key={index}
              src={safeImage(img)}
              alt={`Produit secondaire ${index + 1}`}
              onClick={() => setImagePrincipale(safeImage(img))}
              onError={(e) => (e.target.src = PLACEHOLDER)}
              className={`w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg cursor-pointer border transition
                ${mainImage === img ? "border-orange-600" : "border-gray-200"} hover:scale-105`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

ImageProduit.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
  imagePrincipale: PropTypes.string,
  setImagePrincipale: PropTypes.func.isRequired,
};
