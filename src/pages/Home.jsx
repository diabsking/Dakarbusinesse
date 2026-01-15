import React, { useEffect, useState } from "react";
import BanniereAccueil from "../components/Home/BanniereAccueil";
import AvantagesKolwaz from "../components/Home/AvantagesKolwaz";
import AppelAction from "../components/Home/AppelAction";
import OffresSpeciales from "../components/Home/OffresSpeciales";

export default function Home() {
  const [loading, setLoading] = useState(true);

  // Simuler un chargement de 1,5s (ou remplacer par fetch réel si besoin)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  /* ===========================
     SKELETON MOBILE-FIRST
  ============================ */
  const renderSkeleton = () => (
    <main className="bg-gray-50 min-h-screen p-4 md:p-6 space-y-6 animate-pulse">
      {/* Bannière */}
      <div className="h-48 md:h-64 bg-gray-200 rounded-xl w-full" />

      {/* Offres spéciales */}
      <div className="space-y-4">
        <div className="h-6 w-1/3 bg-gray-200 rounded" />
        <div className="flex flex-wrap gap-4">
          <div className="h-40 w-full sm:w-1/2 md:w-1/4 bg-gray-200 rounded" />
          <div className="h-40 w-full sm:w-1/2 md:w-1/4 bg-gray-200 rounded" />
          <div className="h-40 w-full sm:w-1/2 md:w-1/4 bg-gray-200 rounded" />
          <div className="h-40 w-full sm:w-1/2 md:w-1/4 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Avantages Kolwaz */}
      <div className="space-y-4">
        <div className="h-6 w-1/4 bg-gray-200 rounded" />
        <div className="flex flex-wrap gap-4">
          <div className="h-24 w-full sm:w-1/2 md:w-1/3 bg-gray-200 rounded" />
          <div className="h-24 w-full sm:w-1/2 md:w-1/3 bg-gray-200 rounded" />
          <div className="h-24 w-full sm:w-1/2 md:w-1/3 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Appel à l’action */}
      <div className="h-32 bg-gray-200 rounded-xl w-full" />
    </main>
  );

  return loading ? (
    renderSkeleton()
  ) : (
    <main className="bg-gray-50 min-h-screen">
      <BanniereAccueil />
      <OffresSpeciales />
      <AvantagesKolwaz />
      <AppelAction />
    </main>
  );
}
