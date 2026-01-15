import { Routes, Route } from "react-router-dom";
import { useState } from "react";

// Layouts
import HomeLayout from "./layouts/HomeLayout";
import MainLayout from "./layouts/MainLayout";

import Footer from "./components/Layout/Footer";

// Pages
import Home from "./pages/Home";
import Produit from "./pages/Produit";
import DetailProduit from "./pages/DetailProduit";
import Panier from "./pages/Panier";
import ConfirmationCommande from "./pages/ConfirmationCommande";
import SuiviCommande from "./pages/SuiviCommande";
import PublierProduit from "./pages/PublierProduit";
import SpaceVendeur from "./pages/SpaceVendeur";
import TableauDebord from "./pages/TableauDebord";
import Statistiques from "./pages/Statistiques";
import Parametre from "./pages/Parametre";
import ModifierProduit from "./pages/ModifierProduit";
import BoosterProduit from "./pages/BoosterProduit";
import Certification from "./pages/Certification";
import CertificationSuccess from "./pages/CertificationSuccess";
import MotDePasseOublie from "./pages/MotDePasseOublie";
import ProfilVendeurPublic from "./pages/ProfilVendeurPublic";
import Dashboard from "./admin/pages/Dashboard";
import ProductStats from "./pages/ProductStats";
import Confidentialite from "./pages/Confidentialite";




export default function App() {
  /* 🔍 RECHERCHE GLOBALE */
  const [recherche, setRecherche] = useState("");

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">

      {/* CONTENU */}
      <main className="flex-grow">
        <Routes>

          {/* 🏠 HOME */}
          <Route element={<HomeLayout />}>
            <Route path="/" element={<Home />} />
          </Route>

          {/* 🌍 AUTRES PAGES */}
          <Route
            element={
              <MainLayout
                recherche={recherche}
                setRecherche={setRecherche}
              />
            }
          >
            {/* 📦 PRODUITS */}
            <Route
              path="/produits"
              element={<Produit recherche={recherche} />}
            />

            <Route
              path="/categorie/:nom"
              element={<Produit recherche={recherche} />}
            />

            <Route path="/produit/:id" element={<DetailProduit />} />
            <Route path="/panier" element={<Panier />} />

            <Route
              path="/confirmation-commande"
              element={<ConfirmationCommande />}
            />

            <Route
              path="/suivi-commande/:id"
              element={<SuiviCommande />}
            />

            {/* 👤 VENDEUR */}
            <Route path="/espace-vendeur" element={<SpaceVendeur />} />
            <Route path="/produits/publier" element={<PublierProduit />} />
            <Route path="/tableau-de-bord" element={<TableauDebord />} />
            <Route path="/statistiques" element={<Statistiques />} />
            <Route path="/vendeur/parametre" element={<Parametre />} />
            <Route path="/modifier-produit/:id" element={<ModifierProduit />} />
            <Route path="/booster-produit/:id" element={<BoosterProduit />} />
            <Route path="/certification" element={<Certification />} />
            <Route
              path="/certification/success"
              element={<CertificationSuccess />}
            />
            <Route
              path="/mot-de-passe-oublie"
              element={<MotDePasseOublie />}
            />
            <Route
              path="/vendeur/:id"
              element={<ProfilVendeurPublic />}
            />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/statistiques-produit/:id" element={<ProductStats />} />
            <Route path="/confidentialite" element={<Confidentialite />} />
          </Route>

          {/* ❌ FALLBACK */}
          <Route
            path="*"
            element={
              <div className="p-20 text-center">
                <h1 className="text-2xl font-semibold">
                  Page non trouvée
                </h1>
              </div>
            }
          />
        </Routes>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
