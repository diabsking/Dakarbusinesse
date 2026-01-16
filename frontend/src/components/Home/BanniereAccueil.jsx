import React from "react";
import { Link } from "react-router-dom";
import { FiShoppingBag, FiArrowRight } from "react-icons/fi";

export default function BanniereAccueil() {
  return (
    <section
      className="relative overflow-hidden rounded-3xl mb-12 min-h-[400px] sm:min-h-[500px] md:min-h-[520px]"
      aria-label="Bannière promotionnelle Kolwaz"
    >
      {/* IMAGE DE FOND */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/banner-kolwaz.jpg')",
          backgroundSize: "cover",        // S'assure que l'image couvre tout le conteneur
          backgroundPosition: "center",   // Centre l'image
          backgroundRepeat: "no-repeat",  // Pas de répétition
        }}
      />

      {/* OVERLAY GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/80 via-red-500/80 to-pink-500/80" />

      {/* Decorative blur */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -left-24 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

      {/* CONTENT */}
      <div className="relative z-10 h-full flex items-center">
        <div className="p-6 sm:p-10 md:p-16 max-w-2xl text-black">

          {/* Badge */}
          <span className="inline-flex items-center gap-2 bg-white/80 px-4 py-1 rounded-full text-sm font-medium mb-5">
            <FiShoppingBag />
            Marketplace local sénégalais
          </span>

          {/* Title */}
          <h1 className="text-white text-2xl sm:text-3xl md:text-5xl font-extrabold leading-tight mb-6">
            Achetez local, <br />
            <span className="text-white/90">
              simplement et en toute confiance
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg mb-8 text-white/90">
            Kolwaz met en relation des vendeurs locaux vérifiés et des clients,
            avec un paiement à la livraison pour plus de sécurité.
          </p>

          {/* CTA */}
          <div className="flex flex-wrap gap-4 mb-10">
            <Link
              to="/produits"
              className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 bg-white text-black rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition"
            >
              Découvrir les produits
              <FiArrowRight />
            </Link>

            <Link
              to="/espace-vendeur"
              className="inline-flex items-center px-6 sm:px-7 py-3 border-2 border-white text-white rounded-2xl font-semibold hover:bg-white/10 transition"
            >
              Devenir vendeur
            </Link>
          </div>

          {/* STATS */}
          <div className="flex flex-wrap gap-10 text-white">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold">+12 000</p>
              <p className="text-sm opacity-80">Produits</p>
            </div>

            <div>
              <p className="text-2xl sm:text-3xl font-extrabold">+850</p>
              <p className="text-sm opacity-80">Vendeurs</p>
            </div>

            <div>
              <p className="text-2xl sm:text-3xl font-extrabold">+25 000</p>
              <p className="text-sm opacity-80">Clients</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
