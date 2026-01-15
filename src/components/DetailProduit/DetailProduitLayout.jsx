export default function DetailProduitLayout({ loading, produit, children }) {
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <h1 className="text-6xl font-extrabold animate-pulse">
          KOLWAZ.SHOP
        </h1>
      </div>
    );
  }

  if (!produit) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">Produit introuvable</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 px-4 py-6">
      <div className="max-w-[1400px] mx-auto space-y-14">
        {children}
      </div>
    </div>
  );
}
