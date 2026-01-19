import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiShoppingBag,
  FiShield,
  FiMapPin,
} from "react-icons/fi";

export default function OffresSpeciales() {
  const navigate = useNavigate();

  const offres = [
    {
      id: 1,
      titre: "Vendez gratuitement",
      description:
        "Créez votre boutique sur Dakarbusinesse et commencez à vendre sans frais d’inscription.",
      icon: <FiShoppingBag size={40} />,
      action: "Devenir vendeur",
      link: "/space-vendeur",
      color: "from-orange-500 to-yellow-500",
    },
    {
      id: 2,
      titre: "Produits locaux",
      description:
        "Achetez directement auprès de vendeurs locaux partout au Sénégal.",
      icon: <FiMapPin size={40} />,
      action: "Découvrir",
      link: "/produits",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: 3,
      titre: "Paiement sécurisé",
      description:
        "Wave, Orange Money et paiement à la livraison pour plus de confiance.",
      icon: <FiShield size={40} />,
      action: "En savoir plus",
      link: "/aide",
      color: "from-blue-500 to-indigo-500",
    },
  ];

  return (
    <section className="mb-20 p-10 rounded-3xl bg-gradient-to-r from-gray-50 to-gray-100">
      <h2 className="text-2xl font-extrabold text-center mb-12 text-gray-500">
        Dakarbusinesse fait la difference....
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {offres.map((offre) => (
          <div
            key={offre.id}
            className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 p-8 text-center"
          >
            {/* Icône */}
            <div
              className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-white bg-gradient-to-r ${offre.color}`}
            >
              {offre.icon}
            </div>

            {/* Titre */}
            <h3 className="text-xl font-bold mb-3 text-gray-800">
              {offre.titre}
            </h3>

            {/* Description */}
            <p className="text-gray-600 mb-6">
              {offre.description}
            </p>

            {/* Bouton */}
            <button
              onClick={() => navigate(offre.link)}
              className="w-full py-3 rounded-2xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition"
            >
              {offre.action}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
