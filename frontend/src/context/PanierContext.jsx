// src/context/PanierContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

const PanierContext = createContext();

export const PanierProvider = ({ children }) => {
  /* =========================
     STATE
  ========================== */
  const [panier, setPanier] = useState(() => {
    const saved = localStorage.getItem("panier");
    return saved ? JSON.parse(saved) : [];
  });

  /* =========================
     PERSISTENCE
  ========================== */
  useEffect(() => {
    localStorage.setItem("panier", JSON.stringify(panier));
  }, [panier]);

  /* =========================
     AJOUTER
  ========================== */
  const ajouterAuPanier = (produit) => {
    setPanier((prev) => {
      const existe = prev.find((p) => p.id === produit.id);

      if (existe) {
        return prev.map((p) =>
          p.id === produit.id
            ? { ...p, quantite: p.quantite + 1 }
            : p
        );
      }

      return [...prev, { ...produit, quantite: 1 }];
    });
  };

  /* =========================
     MODIFIER QUANTITÉ
     (0 => suppression)
  ========================== */
  const modifierQuantite = (id, quantite) => {
    setPanier((prev) => {
      if (quantite <= 0) {
        return prev.filter((p) => p.id !== id);
      }

      return prev.map((p) =>
        p.id === id ? { ...p, quantite } : p
      );
    });
  };

  /* =========================
     SUPPRIMER DIRECT
  ========================== */
  const supprimerDuPanier = (id) => {
    setPanier((prev) =>
      prev.filter((p) => p.id !== id)
    );
  };

  /* =========================
     VIDER
  ========================== */
  const viderPanier = () => setPanier([]);

  /* =========================
     🔔 COMPTEUR PRODUITS
     (total des quantités)
  ========================== */
  const nombreProduits = panier.reduce(
    (total, p) => total + (p.quantite || 1),
    0
  );

  /* =========================
     PROVIDER
  ========================== */
  return (
    <PanierContext.Provider
      value={{
        panier,
        ajouterAuPanier,
        modifierQuantite,
        supprimerDuPanier,
        viderPanier,
        nombreProduits, // 👈 exposé ici
      }}
    >
      {children}
    </PanierContext.Provider>
  );
};

export const usePanier = () => useContext(PanierContext);
