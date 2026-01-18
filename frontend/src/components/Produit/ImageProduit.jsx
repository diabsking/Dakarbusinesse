import React from "react";
import PropTypes from "prop-types";

const PLACEHOLDER = "/placeholder.png";

export default function ImageProduit({
  images = [],
  imagePrincipale,
  setImagePrincipale,
}) {
  const safeImage = (img) =>
    img && typeof img === "string" ? img : PLACEHOLDER;

  const imagesSecondaires = images.slice(0, 6);
  const mainImage = safeImage(
    imagePrincipale || imagesSecondaires[0]
  );

  return (
    <div className="w-full flex flex-col md:flex-row gap-4">
      {/* IMAGE PRINCIPALE */}
      <div className="order-1 md:order-2 flex-1 flex justify-center">
        <div className="w-full max-w-md sm:max-w-lg">
          <img
            src={mainImage}
            alt="Produit principal"
            onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
            className="
              w-full
              h-[280px] sm:h-[360px] md:h-[450px]
              object-cover
              rounded-2xl
              shadow-lg
            "
          />
        </div>
      </div>

      {/* MINIATURES */}
      {imagesSecondaires.length > 1 && (
        <div
          className="
            order-2 md:order-1
            flex md:flex-col
            gap-3
            overflow-x-auto md:overflow-visible
            md:w-24
            snap-x snap-mandatory
            scrollbar-hide
          "
        >
          {imagesSecondaires.map((img, index) => {
            const safeImg = safeImage(img);
            const isActive = mainImage === safeImg;

            return (
              <button
                key={index}
                type="button"
                onClick={() => setImagePrincipale(safeImg)}
                className={`
                  snap-start
                  flex-none
                  rounded-xl
                  overflow-hidden
                  border
                  transition-all
                  ${
                    isActive
                      ? "border-orange-600 ring-2 ring-orange-400"
                      : "border-gray-200 hover:border-orange-400"
                  }
                `}
              >
                <img
                  src={safeImg}
                  alt={`Produit ${index + 1}`}
                  onError={(e) =>
                    (e.currentTarget.src = PLACEHOLDER)
                  }
                  className="
                    w-20 h-20
                    sm:w-24 sm:h-24
                    object-cover
                  "
                />
              </button>
            );
          })}
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
