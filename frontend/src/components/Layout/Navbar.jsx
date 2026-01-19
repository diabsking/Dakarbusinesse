import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FiHome,
  FiShoppingCart,
  FiUser,
  FiSearch,
  FiX,
  FiMenu,
  FiCpu,
  FiShoppingBag,
  FiHome as FiMaison,
  FiHeart,
  FiCoffee,
  FiSmartphone,
  FiMonitor,
  FiActivity,
  FiUserCheck,
  FiSettings,
  FiMoreHorizontal,
} from "react-icons/fi";
import { usePanier } from "../../context/PanierContext";

/* 📂 CATÉGORIES */
const categories = [
  "Accueil",
  "Tous",
  "Électronique",
  "Mode & Vêtements",
  "Maison",
  "Beauté",
  "Alimentation",
  "Électroménager",
  "Téléphones & Accessoires",
  "Informatique",
  "Sport & Loisirs",
  "Bébé & Enfants",
  "Santé",
  "Automobile",
  "Services",
  "Autres",
];

/* 📌 Mapping catégorie → icône */
const categoryIcons = {
  Accueil: <FiHome size={18} />,
  Tous: <FiShoppingBag size={18} />,
  Électronique: <FiCpu size={18} />,
  "Mode & Vêtements": <FiHeart size={18} />,
  Maison: <FiMaison size={18} />,
  Beauté: <FiHeart size={18} />,
  Alimentation: <FiCoffee size={18} />,
  Électroménager: <FiSettings size={18} />,
  "Téléphones & Accessoires": <FiSmartphone size={18} />,
  Informatique: <FiMonitor size={18} />,
  "Sport & Loisirs": <FiActivity size={18} />,
  "Bébé & Enfants": <FiUserCheck size={18} />,
  Santé: <FiHeart size={18} />,
  Automobile: <FiSettings size={18} />,
  Services: <FiMoreHorizontal size={18} />,
  Autres: <FiMoreHorizontal size={18} />,
};

export default function Navbar() {
  const [openSearch, setOpenSearch] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  /* 🛒 Panier */
  const { nombreProduits } = usePanier();

  /* 🔍 Recherche */
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchValue.trim()) return;

    navigate(`/produits?q=${encodeURIComponent(searchValue)}`);
    setOpenSearch(false);
  };

  /* 📂 Navigation catégories */
  const handleCategorieClick = (cat) => {
    setOpenMenu(false);

    if (cat === "Accueil") {
      navigate("/");
    } else if (cat === "Tous") {
      navigate("/produits");
    } else {
      navigate(`/categorie/${encodeURIComponent(cat)}`);
    }
  };

  return (
    <>
      {/* 🔝 NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex justify-between items-center">

          {/* LOGO + MENU */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpenMenu(true)}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-700"
            >
              <FiMenu size={22} />
            </button>

            <Link to="/" className="flex items-center gap-2">
              {/* Masquer le logo image sur mobile */}
              <img
                src="/logo-kolwaz.png"
                alt="Kolwaz"
                className="hidden sm:block w-20 sm:w-24"
              />
              <span className="hidden sm:block text-black font-medium">
                Dakarbusinesse
              </span>
            </Link>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Recherche */}
            <button
              onClick={() => setOpenSearch((v) => !v)}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-700"
            >
              {openSearch ? <FiX size={20} /> : <FiSearch size={20} />}
            </button>

            {/* Panier */}
            <Link
              to="/panier"
              className="relative flex items-center gap-1 text-gray-800 hover:text-orange-500"
            >
              <FiShoppingCart size={20} />
              <span className="hidden sm:inline">Panier</span>

              {nombreProduits > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full font-bold">
                  {nombreProduits}
                </span>
              )}
            </Link>

            {/* Vendeur */}
            <Link
              to="/espace-vendeur"
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-orange-500 text-black hover:bg-orange-600 text-sm sm:text-base"
            >
              <FiUser size={18} />
              <span className="hidden sm:inline">Vendeur</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* 🔍 BARRE DE RECHERCHE */}
      {openSearch && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-white border-b py-3">
          <form onSubmit={handleSearch} className="flex justify-center px-4">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full max-w-[50%] sm:w-[300px] px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              autoFocus
            />
          </form>
        </div>
      )}

      {/* ☰ MENU CATÉGORIES */}
      {openMenu && (
        <>
          <div
            onClick={() => setOpenMenu(false)}
            className="fixed inset-0 bg-black/30 z-40"
          />

          <aside className="fixed top-0 left-0 w-72 h-full bg-white z-50 shadow-xl">
            <div className="flex items-center justify-between px-4 h-16 border-b">
              <span className="font-semibold">Catégories</span>
              <button onClick={() => setOpenMenu(false)}>
                <FiX size={20} />
              </button>
            </div>

            <nav className="p-4 space-y-1 overflow-y-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorieClick(cat)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 flex items-center gap-2"
                >
                  {categoryIcons[cat] || <FiMoreHorizontal size={18} />}
                  {cat}
                </button>
              ))}
            </nav>
          </aside>
        </>
      )}

      {/* ESPACEMENT SOUS NAVBAR */}
      <div className="h-16" />
      {openSearch && <div className="h-[64px]" />}
    </>
  );
}
