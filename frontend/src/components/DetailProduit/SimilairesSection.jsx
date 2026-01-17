import ProductCard from "../Produit/ProductCard";

export default function SimilairesSection({ produits }) {
  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold mb-4">
        Produits similaires
      </h2>

      {produits.length === 0 ? (
        <p className="text-gray-500">
          Aucun produit similaire
        </p>
      ) : (
        <div className="overflow-x-auto">
          <div className="flex gap-4 w-max">
            {produits.map((p) => (
              <div key={p._id} className="min-w-[240px]">
                <ProductCard produit={p} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
