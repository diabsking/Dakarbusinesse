import React from "react";
import {
  FaTruck,
  FaMoneyBillWave,
  FaStore,
  FaHeadset,
} from "react-icons/fa";

export default function AvantagesKolwaz() {
  const avantages = [
    {
      title: "Paiement à la livraison",
      description:
        "Avec Kolwaz, vous payez uniquement lorsque vous recevez votre produit. Cela vous permet d’acheter en toute confiance, sans risque, et de vérifier votre commande avant de régler.",
      icon: <FaMoneyBillWave className="w-12 h-12 text-orange-500" />,
      bg: "bg-orange-50",
    },
    {
      title: "Vendeurs locaux vérifiés",
      description:
        "Nous mettons en avant des vendeurs locaux sérieux et fiables. Chaque vendeur est vérifié afin de garantir des produits authentiques et un service de qualité.",
      icon: <FaStore className="w-12 h-12 text-green-600" />,
      bg: "bg-green-50",
    },
    {
      title: "Livraison rapide et sécurisée",
      description:
        "Grâce à notre réseau de livraison, vos commandes sont traitées rapidement et livrées dans les meilleurs délais, où que vous soyez.",
      icon: <FaTruck className="w-12 h-12 text-blue-600" />,
      bg: "bg-blue-50",
    },
    {
      title: "Support client dédié",
      description:
        "Notre équipe support est disponible pour répondre à vos questions, vous assister en cas de problème et vous accompagner avant, pendant et après votre achat.",
      icon: <FaHeadset className="w-12 h-12 text-purple-600" />,
      bg: "bg-purple-50",
    },
  ];

  return (
    <section className="mb-20">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800">
          Pourquoi choisir Dakarbusinesse ?
        </h2>
        <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
          Dakarbusinesse est une marketplace locale conçue pour offrir une expérience
          d’achat simple, sécurisée et fiable, aussi bien pour les clients que
          pour les vendeurs.
        </p>
      </div>

      {/* Avantages */}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {avantages.map((a) => (
          <li
            key={a.title}
            className="bg-white border rounded-2xl p-8 hover:shadow-xl transition"
          >
            <div
              className={`w-16 h-16 ${a.bg} rounded-2xl flex items-center justify-center mb-6`}
            >
              {a.icon}
            </div>

            <h3 className="font-bold text-lg text-gray-800 mb-3">
              {a.title}
            </h3>

            <p className="text-sm text-gray-600 leading-relaxed">
              {a.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
