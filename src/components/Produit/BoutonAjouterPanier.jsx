import React from "react";
import { FiShoppingCart } from "react-icons/fi";

export default function BoutonAjouterPanier({ onClick }) {
  return (
   <button
  onClick={onClick}
  className="w-full mt-6 py-4 bg-orange-600 text-white text-xl font-bold rounded-full hover:bg-orange-700 transition flex items-center justify-center gap-2"
>
  <FiShoppingCart /> Ajouter au panier
</button>

  );
}
