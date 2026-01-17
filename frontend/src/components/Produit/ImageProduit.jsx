import React from "react";
import PropTypes from "prop-types";

const PLACEHOLDER = "/placeholder.png";

export default function ImageProduit({ images = [], imagePrincipale, setImagePrincipale }) {
  const safeImage = (img) => (img && typeof img === "string" ? img : PLACEHOLDER);

  const imagesSecondaires = images?.slice(0, 5) || [];
  const mainImage = safeImage(imagePrincipale || imagesSecondaires[0]);

  return (
    <div className="w-full flex flex-col gap-4 items-center">
      {/* IMAGE PRINCIPALE */}
      <div className="w-full max-w-md">
        <img
          src={mainImage}
          onError={(e) => (e.target.src = PLACEHOLDER)}
          alt="Produit"
          className="w-full h-[320px] sm:h-[380px] object-cover rounded-2xl shadow-md"
        />
      </div>

      {/* IMAGES SECONDAIRES */}
      {imagesSecondaires.length > 0 && (
        <div className="w-full">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
            {imagesSecondaires.map((img, index) => (
              <button
                key={index}
                onClick={() => setImagePrincipale(safeImage(img))}
                className={`snap-start flex-none rounded-xl overflow-hidden border transition
                  ${mainImage === safeImage(img) ? "border-orange-600" : "border-gray-200"}
                  hover:scale-105`}
              >
                <img
                  src={safeImage(img)}
                  alt={`Produit secondaire ${index + 1}`}
                  onError={(e) => (e.target.src = PLACEHOLDER)}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover"
                />
              </button>
            ))}
          </div>
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
