import React from "react";
import { useNavigate } from "react-router-dom";

export default function AppelAction() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/espace-vendeur"); // redirection vers l’espace vendeur
  };

  return (
    <section className="mb-20">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-10 text-center text-white shadow-xl">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-4">
          Commencez à vendre sur Dakarbusinesse dès aujourd’hui
        </h2>

        <p className="text-blue-100 max-w-2xl mx-auto mb-8">
          Rejoignez une marketplace locale en pleine croissance. Publiez vos
          produits, atteignez plus de clients et développez votre activité en
          toute simplicité.
        </p>

        <button
          onClick={handleClick}
          className="px-8 py-4 bg-white text-blue-700 font-semibold rounded-2xl hover:bg-gray-100 transition transform hover:scale-105"
        >
          Créer un compte vendeur
        </button>

        <p className="text-sm text-blue-200 mt-6">
          Inscription gratuite • Mise en ligne rapide • Support dédié
        </p>
      </div>
    </section>
  );
}
