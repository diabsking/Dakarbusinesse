import ProductCard from "../Produit/ProductCard";

export default function SimilairesSection({ produits }) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">
        Produits similaires
      </h2>

      {produits.length === 0 ? (
        <p className="text-gray-500">
          Aucun produit similaire
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {produits.map((p) => (
            <ProductCard key={p._id} produit={p} />
          ))}
        </div>
      )}
    </section>
  );
}
