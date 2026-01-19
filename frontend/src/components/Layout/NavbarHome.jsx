import React from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { FiShoppingCart, FiUser } from "react-icons/fi";
import { usePanier } from "../../context/PanierContext";

export default function NavbarHome() {
  const navigate = useNavigate();

  /* 🛒 Compteur panier */
  const { nombreProduits } = usePanier();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center">

        {/* LOGO */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img
            src="/logo-kolwaz.png"
            alt="Kolwaz Marketplace"
            className="h-8 sm:h-10 w-auto object-contain"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <span className="hidden sm:block text-lg font-bold text-gray-800">
            Dakarbusinesse
          </span>
        </div>

        {/* NAVIGATION DESKTOP */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink
            to="/produits"
            className={({ isActive }) =>
              `font-medium transition ${
                isActive
                  ? "text-orange-600"
                  : "text-gray-700 hover:text-orange-600"
              }`
            }
          >
            Explorer
          </NavLink>

          <NavLink
            to="/espace-vendeur"
            className="text-gray-700 font-medium hover:text-orange-600 transition"
          >
            Devenir vendeur
          </NavLink>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3 sm:gap-4">

          {/* 🛒 PANIER */}
          <button
            onClick={() => navigate("/panier")}
            className="relative text-gray-700 hover:text-orange-600 transition"
            aria-label="Panier"
          >
            <FiShoppingCart size={22} />

            {nombreProduits > 0 && (
              <span
                className="
                  absolute -top-2 -right-2
                  bg-orange-600 text-white text-xs
                  min-w-[18px] h-[18px]
                  px-1 flex items-center justify-center
                  rounded-full font-bold
                "
              >
                {nombreProduits}
              </span>
            )}
          </button>

          {/* CONNEXION (desktop uniquement) */}
          <button
            onClick={() => navigate("/espace-vendeur")}
            className="hidden sm:block text-gray-700 font-medium hover:text-orange-600 transition"
          >
            Connexion
          </button>

          {/* INSCRIPTION */}
          <button
            onClick={() => navigate("/espace-vendeur")}
            className="
              flex items-center gap-2
              px-3 sm:px-5 py-2
              rounded-full
              border border-orange-500
              text-orange-600 font-semibold
              hover:bg-orange-50
              transition
              text-sm sm:text-base
            "
          >
            <FiUser className="sm:hidden" size={18} />
            <span className="hidden sm:inline">S’inscrire</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
