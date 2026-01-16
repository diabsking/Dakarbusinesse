import { useEffect, useState } from "react";
import { getStatsAdmin } from "../services/admin.api";
import AdminVendeurs from "./AdminVendeurs";
import AdminProduits from "./AdminProduits";
import AdminCommandes from "./AdminCommandes";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [active, setActive] = useState("home");
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(null); // null = vérification, true = ok, false = refusé

  const navigate = useNavigate();

  // Vérification du token
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/admin/dashboard`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Token invalide");
        return res.json();
      })
      .then(() => setIsAuthorized(true))
      .catch(() => {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
        setIsAuthorized(false);
      });
  }, [navigate]);

  // Chargement des stats
  useEffect(() => {
    if (!isAuthorized) return;

    getStatsAdmin()
      .then((res) => setStats(res.data?.data || {}))
      .catch(() => setStats({}))
      .finally(() => setLoading(false));
  }, [isAuthorized]);

  if (isAuthorized === null) return <p>Vérification du token...</p>;
  if (isAuthorized === false) return null; // pas autorisé

  const renderContent = () => {
    switch (active) {
      case "vendeurs":
        return <AdminVendeurs />;
      case "produits":
        return <AdminProduits />;
      case "commandes":
        return <AdminCommandes />;
      default:
        return <DashboardHome stats={stats} loading={loading} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar active={active} setActive={setActive} />
      <main className="flex-1 p-8 overflow-y-auto">{renderContent()}</main>
    </div>
  );
}

function DashboardHome({ stats, loading }) {
  if (loading) return <p>Chargement des statistiques...</p>;

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Vue générale</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Commandes" value={stats.totalCommandes ?? 0} />
        <StatCard title="Ventes" value={`${stats.totalVentes ?? 0} FCFA`} />
        <StatCard title="Annulées" value={stats.commandesAnnulees ?? 0} />
      </div>
    </>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <p className="text-gray-500">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
