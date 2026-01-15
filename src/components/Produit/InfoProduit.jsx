import React from "react";
import PropTypes from "prop-types";
import {
  FiMapPin,
  FiTag,
  FiFlag,
  FiCheckCircle,
  FiPackage,
  FiClock,
  FiTrendingUp,
  FiCalendar,
} from "react-icons/fi";

export default function InfoProduit({ produit }) {
  return (
    <div className="flex flex-col gap-6">
      {/* NOM PRODUIT */}
      <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 line-clamp-2">
        {produit?.nom || "Nom du produit"}
      </h1>

      {/* PRIX */}
      <p className="text-2xl sm:text-4xl font-extrabold text-orange-300">
        {typeof produit?.prixActuel === "number"
          ? produit.prixActuel.toLocaleString()
          : "—"}{" "}
        FCFA
      </p>

      {/* DESCRIPTION */}
      <p className="text-gray-700 text-base sm:text-lg">
        {produit?.description || "Aucune description disponible."}
      </p>

      {/* CARACTÉRISTIQUES */}
      <div className="grid grid-cols-2 gap-4 text-sm sm:text-base border-t pt-4">
        <p className="flex items-center gap-2">
          <FiCheckCircle className="text-green-600" />
          État :
          <span className="font-medium">
            {produit?.etat || "—"}
          </span>
        </p>

        <p className="flex items-center gap-2">
          <FiFlag className="text-blue-600" />
          Origine :
          <span className="font-medium">
            {produit?.origine || "—"}
          </span>
        </p>

        <p className="flex items-center gap-2">
          <FiMapPin className="text-red-600" />
          Pays :
          <span className="font-medium">
            {produit?.paysOrigine || "—"}
          </span>
        </p>

        <p className="flex items-center gap-2">
          <FiTag className="text-purple-600" />
          Catégorie :
          <span className="font-medium">
            {produit?.categorie || "—"}
          </span>
        </p>
      </div>

      {/* INFORMATIONS COMPLÉMENTAIRES */}
      <div className="grid grid-cols-2 gap-4 text-sm sm:text-base border-t pt-4">
        <p className="flex items-center gap-2">
          <FiPackage className="text-indigo-600" />
          Stock :
          <span
            className={`font-medium ${
              produit?.stock > 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {produit?.stock > 0
              ? `${produit.stock} disponible(s)`
              : "Rupture"}
          </span>
        </p>

        <p className="flex items-center gap-2">
          <FiClock className="text-orange-600" />
          Livraison :
          <span className="font-medium">
            {produit?.delaiLivraison || "Non précisé"}
          </span>
        </p>

        <p className="flex items-center gap-2">
          <FiTrendingUp className="text-pink-600" />
          Promo :
          <span
            className={`font-medium ${
              produit?.enPromotion
                ? "text-green-600"
                : "text-gray-500"
            }`}
          >
            {produit?.enPromotion ? "Oui" : "Non"}
          </span>
        </p>

        <p className="flex items-center gap-2 col-span-2">
          <FiCalendar className="text-gray-600" />
          Publié le :
          <span className="font-medium">
            {produit?.createdAt
              ? new Date(produit.createdAt).toLocaleDateString(
                  "fr-FR",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )
              : "—"}
          </span>
        </p>
      </div>
    </div>
  );
}

InfoProduit.propTypes = {
  produit: PropTypes.shape({
    nom: PropTypes.string,
    prixActuel: PropTypes.number,
    description: PropTypes.string,
    etat: PropTypes.string,
    origine: PropTypes.string,
    paysOrigine: PropTypes.string,
    categorie: PropTypes.string,

    stock: PropTypes.number,
    delaiLivraison: PropTypes.string,
    enPromotion: PropTypes.bool,
    createdAt: PropTypes.string,

    // 🔒 vendeur conservé dans le type mais NON affiché
    vendeur: PropTypes.object,
  }),
};
