import React from "react";

export default function DetailProduitSkeleton() {
  return (
    <div className="bg-gray-100 px-4 py-6 min-h-screen animate-pulse">
      <div className="max-w-[1400px] mx-auto space-y-14">

        {/* PRODUIT */}
        <div className="bg-white rounded-2xl p-6 grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* IMAGES */}
          <div className="space-y-4">
            <div className="w-full h-[420px] bg-gray-200 rounded-xl" />
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-20 h-20 bg-gray-200 rounded-lg"
                />
              ))}
            </div>
          </div>

          {/* INFOS */}
          <div className="space-y-6">
            <div className="h-8 w-3/4 bg-gray-200 rounded" />
            <div className="h-6 w-1/2 bg-gray-200 rounded" />
            <div className="h-6 w-1/3 bg-gray-200 rounded" />

            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-4/6" />
            </div>

            {/* PROFIL VENDEUR */}
            <div className="border rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gray-200" />
                <div className="space-y-2 flex-1">
                  <div className="h-5 bg-gray-200 rounded w-2/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded" />
              </div>

              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>

            {/* BOUTON */}
            <div className="h-14 bg-gray-300 rounded-full" />
          </div>
        </div>

        {/* SIMILAIRES */}
        <section>
          <div className="h-6 w-64 bg-gray-200 rounded mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-4 space-y-3"
              >
                <div className="h-40 bg-gray-200 rounded-lg" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
