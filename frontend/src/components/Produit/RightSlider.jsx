import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  FiTag,
  FiTrendingDown,
  FiStar,
  FiLayers,
  FiChevronRight,
  FiFilter,
  FiX,
} from "react-icons/fi";

export default function RightSlider({ categories = [], onFilter }) {
  const safeCategories = Array.isArray(categories) ? categories : [];
  const defaultCategory = "Tous";

  const [active, setActive] = useState(defaultCategory);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!safeCategories.includes(active) && active !== defaultCategory) {
      setActive(defaultCategory);
      onFilter?.(defaultCategory);
    }
  }, [safeCategories, active, onFilter]);

  const handleClick = (value) => {
    setActive(value);
    onFilter?.(value);
    setOpen(false); // ferme le slider sur mobile
  };

  return (
    <>
      {/* BOUTON FILTRE MOBILE */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-40 md:hidden bg-orange-600 text-black p-4 rounded-full shadow-lg"
        aria-label="Ouvrir les filtres"
      >
        <FiFilter />
      </button>

      {/* OVERLAY MOBILE */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SLIDER */}
      <aside
        aria-label="Filtres produits"
        className={`
          fixed top-0 right-0 h-screen w-80 bg-white border-l border-gray-200 z-50
          flex flex-col transform transition-transform duration-300
          ${open ? "translate-x-0" : "translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Header */}
        <header className="px-6 py-5 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FiLayers className="text-orange-500" />
            Filtres
          </h2>

          {/* Close mobile */}
          <button
            onClick={() => setOpen(false)}
            className="md:hidden text-gray-500 hover:text-black"
            aria-label="Fermer"
          >
            <FiX size={20} />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-10">
          {/* Catégories */}
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-4 tracking-wider">
              Catégories
            </h3>

            <div className="flex flex-col gap-2">
              <FilterButton
                icon={<FiTag />}
                label="Tous"
                active={active}
                onClick={() => handleClick("Tous")}
              />

              {safeCategories
                .filter((c) => c !== "Tous")
                .map((categorie) => (
                  <FilterButton
                    key={categorie}
                    icon={<FiTag />}
                    label={categorie}
                    active={active}
                    onClick={() => handleClick(categorie)}
                  />
                ))}
            </div>
          </section>

          {/* Divider */}
          <div className="h-px bg-gray-200" />

          {/* Offres */}
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-4 tracking-wider">
              Offres & Sélections
            </h3>

            <div className="flex flex-col gap-2">
              <PromoButton icon={<FiTrendingDown />} label="Promotions" color="red" />
              <PromoButton icon={<FiStar />} label="Nouveautés" color="green" />
              <PromoButton icon={<FiStar />} label="Meilleures ventes" color="blue" />
            </div>
          </section>
        </div>
      </aside>
    </>
  );
}

/* ---------------- COMPONENTS ---------------- */

function FilterButton({ icon, label, active, onClick }) {
  const isActive = active === label;

  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      className={`
        group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500
        ${
          isActive
            ? "bg-orange-50 text-orange-600 border border-orange-200"
            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
        }
      `}
    >
      <div className="flex items-center gap-3">
        <span className={isActive ? "text-orange-500" : "text-gray-400"}>
          {icon}
        </span>
        {label}
      </div>

      <FiChevronRight
        className={`text-sm transition ${
          isActive
            ? "opacity-100 text-orange-400"
            : "opacity-0 group-hover:opacity-60"
        }`}
      />
    </button>
  );
}

function PromoButton({ icon, label, color }) {
  const colors = {
    red: "bg-red-50 text-red-600 hover:bg-red-100",
    green: "bg-green-50 text-green-600 hover:bg-green-100",
    blue: "bg-blue-50 text-blue-600 hover:bg-blue-100",
  };

  return (
    <button
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
        colors[color]
      }`}
    >
      <span className="opacity-80">{icon}</span>
      {label}
    </button>
  );
}

RightSlider.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string),
  onFilter: PropTypes.func,
};
