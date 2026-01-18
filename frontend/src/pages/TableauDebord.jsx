import React, { useEffect, useState } from "react";
import axios from "axios";
import SectionDashboard from "../components/TableauDebord/SectionDashboard";
import ProductGrid from "../components/TableauDebord/ProductGrid";
import UserProfile from "../components/TableauDebord/UserProfile";
import { FiBox, FiShoppingCart, FiBarChart2 } from "react-icons/fi";
import api from "../services/api";

function TableauDebord() {
  const [loading, setLoading] = useState(true);
  const [notifCommandes, setNotifCommandes] = useState(0);

  /* =========================
     RÉCUPÉRER COMMANDES
  ========================== */
  const fetchCommandes = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await api.get("/api/commandes/vendeur", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(res.data)) {
        const nonLivrees = res.data.filter(
          (c) => c.status?.toLowerCase() !== "livré"
        );
        setNotifCommandes(nonLivrees.length);
      }
    } catch (err) {
      console.error("❌ Erreur commandes", err);
    }
  };

  useEffect(() => {
    fetchCommandes();

    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <h1 className="text-5xl font-extrabold animate-pulse">KOLWAZ</h1>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Profil vendeur */}
      <UserProfile />

      {/* Sections dashboard */}
      <div
        className="
          flex gap-2 overflow-x-auto pb-2
          md:grid md:grid-cols-3 md:gap-6
        "
      >
        <SectionDashboard
          icon={<FiBox />}
          title="Publier"
          description="Ajouter des produits"
          link="/produits/publier"
        />

        <SectionDashboard
          icon={<FiShoppingCart />}
          title="Commandes"
          description="Voir les commandes clients"
          link="/suivi-commande/1"
          badge={notifCommandes}
        />

        <SectionDashboard
          icon={<FiBarChart2 />}
          title="Stats"
          description="Suivre les performances"
          link="/statistiques"
        />
      </div>

      {/* Produits */}
      <ProductGrid />
    </div>
  );
}

export default TableauDebord;
