export default function DetailProduitLayout({ loading, produit, children }) {
  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white px-4">
        <h1 className="text-4xl sm:text-6xl font-extrabold animate-pulse">
          Dakarbusinesse
        </h1>
      </div>
    );
  }

  if (!produit) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 bg-gray-100">
        <p className="text-gray-500 mb-4 text-base sm:text-lg">
          Produit introuvable
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 px-0 sm:px-4 py-6">
      <div className="max-w-[1400px] mx-auto w-full space-y-10 sm:space-y-14">
        {children}
      </div>
    </div>
  );
}
