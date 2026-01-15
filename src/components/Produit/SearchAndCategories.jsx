import SearchBar from "./SearchBar";
import Categories from "./Categories";

export default function SearchAndCategories({
  recherche,
  setRecherche,
  categories,
  categorieActive,
  setCategorieActive,
}) {
  return (
    <>
      {/* BARRE FUSIONNÉE FIXE */}
      <div className="sticky top-16 z-40 bg-gray-100 border-b">
        
        {/* Recherche */}
        <SearchBar
          recherche={recherche}
          setRecherche={setRecherche}
        />

        {/* Catégories */}
        <Categories
          categories={categories}
          categorieActive={categorieActive}
          setCategorieActive={setCategorieActive}
        />
      </div>

      {/* ESPACE POUR ÉVITER LE CHEVAUCHEMENT */}
      <div className="h-32" />
    </>
  );
}
