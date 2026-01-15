import { useMemo } from "react";
const normalize = (value = "") => {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD") // décompose les caractères accentués
    .replace(/[\u0300-\u036f]/g, ""); // supprime les accents
};

export default function useProduitFilter({
  produits = [],
  categorieActive = "Tous",
  recherche = "",
  prixMax = 1000000,
  filtreSpecial = null,
}) {
  return useMemo(() => {
    return produits.filter((produit) => {
      if (!produit) return false;

      const nom = normalize(produit.nom);
      const categorie = normalize(produit.categorie);
      const rechercheTexte = normalize(recherche);
      const categorieChoisie = normalize(categorieActive);

      // 1️⃣ Catégorie
      const matchCategorie =
        categorieChoisie === "tous" || categorie === categorieChoisie;

      // 2️⃣ Recherche
      const matchRecherche =
        !rechercheTexte ||
        nom.includes(rechercheTexte) ||
        categorie.includes(rechercheTexte);

      // 3️⃣ Prix
      const prixProduit = typeof produit.prix === "number" ? produit.prix : 0;
      const matchPrix = prixProduit <= prixMax;

      // 4️⃣ Filtres spéciaux
      let matchSpecial = true;
      if (filtreSpecial === "promo") {
        const prixAncien = produit.prixAncien || 0;
        matchSpecial = prixAncien > prixProduit;
      }
      if (filtreSpecial === "new") matchSpecial = produit.nouveau === true;
      if (filtreSpecial === "top") matchSpecial = produit.topVente === true;

      return matchCategorie && matchRecherche && matchPrix && matchSpecial;
    });
  }, [produits, categorieActive, recherche, prixMax, filtreSpecial]);
}
