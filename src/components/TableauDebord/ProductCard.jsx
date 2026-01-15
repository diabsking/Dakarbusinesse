import React from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2, FiZap, FiBarChart2 } from "react-icons/fi";

/* ======================
   Skeleton Loader Produit
====================== */
export function ProductCardSkeleton() {
  return (
    <div className="relative border border-gray-300 rounded-lg bg-white animate-pulse overflow-hidden w-full max-w-xs mx-auto">
      {/* Image */}
      <div className="w-full h-48 bg-gray-200 rounded-t-lg" />

      {/* Infos */}
      <div className="p-4 space-y-2">
        <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
        <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
        <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
        <div className="flex gap-2 pt-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

/* ======================
   ProductCard
====================== */
function ProductCard({ produit, onDelete }) {
  const navigate = useNavigate();

  if (!produit) return null;

  const { _id, nom = "Produit", prixActuel = 0, images = [], stock = 0 } = produit;
  const imageSrc = images.length > 0 ? images[0] : "/placeholder.jpg";

  const handleDelete = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      onDelete(_id);
    }
  };

  return (
    <div className="relative border border-gray-300 rounded-lg bg-white hover:shadow-lg transition-shadow duration-200 overflow-hidden w-full max-w-xs mx-auto">
      {/* Booster */}
      <button
        onClick={() => navigate(`/booster-produit/${_id}`)}
        className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 z-10"
        aria-label="Booster le produit"
      >
        <FiZap />
        Booster
      </button>

      {/* Image */}
      <div className="w-full h-48 bg-gray-100 overflow-hidden rounded-t-lg flex items-center justify-center">
        <img
          src={imageSrc}
          alt={nom}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Infos */}
      <div className="p-4 space-y-2">
        <h4 className="font-semibold text-lg truncate">{nom}</h4>
        <p className="text-gray-600">
          Prix : {Number(prixActuel).toLocaleString()} FCFA
        </p>
        <p
          className={`text-sm font-medium ${
            stock > 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {stock > 0 ? `${stock} en stock` : "Rupture"}
        </p>

        {/* Boutons d'action */}
        <div className="flex gap-2 pt-3 flex-wrap">
          {/* Modifier */}
          <button
            onClick={() => navigate(`/modifier-produit/${_id}`)}
            className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors duration-150"
            title="Modifier le produit"
            aria-label="Modifier le produit"
          >
            <FiEdit />
          </button>

          {/* Supprimer */}
          <button
            onClick={handleDelete}
            className="flex items-center justify-center w-8 h-8 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors duration-150"
            title="Supprimer le produit"
            aria-label="Supprimer le produit"
          >
            <FiTrash2 />
          </button>

          {/* Statistiques */}
          <button
            onClick={() => navigate(`/statistiques-produit/${_id}`)}
            className="flex items-center justify-center w-8 h-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors duration-150"
            title="Voir les statistiques"
            aria-label="Voir les statistiques du produit"
          >
            <FiBarChart2 />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
