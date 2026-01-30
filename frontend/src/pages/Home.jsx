import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

import BanniereAccueil from "../components/Home/BanniereAccueil";
import AvantagesKolwaz from "../components/Home/AvantagesKolwaz";
import AppelAction from "../components/Home/AppelAction";
import OffresSpeciales from "../components/Home/OffresSpeciales";

export default function Home() {
  const [loading, setLoading] = useState(true);

  // Simuler un chargement
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  /* ===========================
     SKELETON MOBILE-FIRST
  ============================ */
  const renderSkeleton = () => (
    <main className="bg-gray-50 min-h-screen p-4 md:p-6 space-y-6 animate-pulse">
      <div className="h-48 md:h-64 bg-gray-200 rounded-xl w-full" />

      <div className="space-y-4">
        <div className="h-6 w-1/3 bg-gray-200 rounded" />
        <div className="flex flex-wrap gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-40 w-full sm:w-1/2 md:w-1/4 bg-gray-200 rounded"
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-6 w-1/4 bg-gray-200 rounded" />
        <div className="flex flex-wrap gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 w-full sm:w-1/2 md:w-1/3 bg-gray-200 rounded"
            />
          ))}
        </div>
      </div>

      <div className="h-32 bg-gray-200 rounded-xl w-full" />
    </main>
  );

  return loading ? (
    renderSkeleton()
  ) : (
    <>
      {/* ===========================
          SEO GOOGLE (HOME)
      ============================ */}
      <Helmet>
        <title>Dakar Business – Marketplace & services à Dakar</title>
        <meta
          name="description"
          content="Dakar Business est une marketplace moderne dédiée aux vendeurs, entreprises et services professionnels à Dakar."
        />
        <meta
          name="keywords"
          content="dakar business, marketplace dakar, vendre à dakar, entreprise à dakar"
        />
      </Helmet>

      <main className="bg-gray-50 min-h-screen">
        {/* ===========================
            CONTENU SEO VISIBLE
        ============================ */}
        <section className="sr-only">
          <h1>Dakar Business</h1>
          <p>
            Marketplace dédiée aux entreprises, vendeurs et services
            professionnels à Dakar.
          </p>
        </section>

        {/* CONTENU EXISTANT */}
        <BanniereAccueil />
        <OffresSpeciales />
        <AvantagesKolwaz />
        <AppelAction />
      </main>
    </>
  );
}
