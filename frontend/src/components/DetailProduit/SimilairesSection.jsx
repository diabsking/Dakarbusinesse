import { useMemo, useState } from "react";
import ProductCard from "../Produit/ProductCard";

export default function SimilairesSection({ produits }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const hasProduits = produits?.length > 0;

  // Calcul du nombre total d'items
  const total = produits?.length || 0;

  // On met à jour l'index si la liste change
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
          {/* CARROUSEL MOBILE (1 par écran) */}
          <div className="block md:hidden">
            <div className="relative">
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-300"
                  style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                >
                  {displayedProduits.map((p) => (
                    <div key={p._id} className="w-full flex-shrink-0 px-2">
                      <ProductCard produit={p} />
                    </div>
                  ))}
                </div>
              </div>

              {/* DOTS */}
              <div className="flex justify-center gap-2 mt-3">
                {displayedProduits.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`w-2 h-2 rounded-full transition ${
                      activeIndex === idx
                        ? "bg-orange-500"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
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
