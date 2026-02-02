import { useMemo, useState } from "react";
import ProductCard from "../Produit/ProductCard";

export default function SimilairesSection({ produits }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const hasProduits = produits?.length > 0;

  const displayedProduits = useMemo(() => produits || [], [produits]);

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold mb-4">
        Produits similaires
      </h2>

      {!hasProduits ? (
        <p className="text-gray-500">Aucun produit similaire</p>
      ) : (
        <>
          {/* CARROUSEL MOBILE (scroll horizontal) */}
          <div className="block md:hidden">
            <div className="flex gap-2 overflow-x-auto px-2 scrollbar-hide">
              {displayedProduits.map((p) => (
                <div key={p._id} className="flex-shrink-0 w-64">
                  <ProductCard produit={p} />
                </div>
              ))}
            </div>
          </div>

          {/* AFFICHAGE DESKTOP (5 produits par ligne) */}
          <div className="hidden md:grid md:grid-cols-5 md:gap-4">
            {displayedProduits.map((p) => (
              <div key={p._id}>
                <ProductCard produit={p} />
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
