import PropTypes from "prop-types";

export default function Categories({
  categories = [],
  categorieActive,
  setCategorieActive,
}) {
  if (!categories.length) return null;

  return (
    <>
      {/* BARRE CATÉGORIES FIXE */}
      <nav className="bg-white opacity-100 backdrop-blur-none">
  <div className="flex gap-3 overflow-x-auto px-4 py-3 scrollbar-hide">

          {categories.map((cat) => {
            const isActive = categorieActive === cat;

            return (
              <button
                key={cat}
                onClick={() => setCategorieActive(cat)}
                className={`
                  px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap
                  transition
                  ${
                    isActive
                      ? "bg-orange-600 text-black border-orange-600 shadow"
                      : "bg-white text-gray-800 border-gray-300 hover:bg-orange-100"
                  }
                `}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ESPACE POUR NE PAS COUVRIR LES PRODUITS */}
      <div className="h-16" />
    </>
  );
}

Categories.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string),
  categorieActive: PropTypes.string,
  setCategorieActive: PropTypes.func.isRequired,
};
