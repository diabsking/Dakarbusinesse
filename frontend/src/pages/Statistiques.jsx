import { useEffect, useState } from "react";
import axios from "axios";
import {
  FiTrendingUp,
  FiShoppingBag,
  FiCheckCircle,
  FiXCircle,
  FiUsers,
  FiUserPlus,
} from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Statistiques() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [periode, setPeriode] = useState("jour");

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line
  }, [periode]);

  const statsVides = {
    chiffreAffaires: 0,
    commandes: { total: 0, livrees: 0, annulees: 0 },
    clients: { total: 0, fideles: 0, nouveaux: 0 },
    jours: [],
    periodes: [],
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/statistiques/vendeur",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { periode },
        }
      );

      setStats(res.data?.data || statsVides);
    } catch (err) {
      console.warn(
        "Aucune statistique disponible (nouveau compte)",
        err?.response?.status
      );
      setStats(statsVides);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     GRAPHE DATA (SAFE)
  ========================== */
  const chartData = (() => {
    if (!stats) return [];
    if (periode === "jour") return [{ label: "Aujourd’hui", ventes: stats.chiffreAffaires || 0 }];
    if (periode === "semaine" && Array.isArray(stats.jours))
      return stats.jours.map((j) => ({ label: j.jour, ventes: j.total }));
    if (Array.isArray(stats.periodes))
      return stats.periodes.map((p) => ({ label: p.label, ventes: p.total }));
    return [{ label: periode, ventes: stats.chiffreAffaires || 0 }];
  })();

  /* =========================
     SKELETON
  ========================== */
  const renderSkeleton = () => (
    <div className="space-y-10">
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 w-48 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-8 w-32 bg-gray-300 rounded animate-pulse"></div>
      </div>

      <SectionSkeleton count={4} />
      <SectionSkeleton count={3} />
      <div className="bg-gray-200 h-64 rounded animate-pulse"></div>
    </div>
  );

  if (loading) return <div className="p-6">{renderSkeleton()}</div>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!stats) return null;

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-semibold">Statistiques</h1>
          <select
            value={periode}
            onChange={(e) => setPeriode(e.target.value)}
            className="border p-2 rounded w-full sm:w-auto"
          >
            <option value="jour">Aujourd’hui</option>
            <option value="semaine">Cette semaine</option>
            <option value="mois">Ce mois</option>
            <option value="annee">Cette année</option>
          </select>
        </div>

        {/* COMMANDES */}
        <Section title="Commandes">
          <StatCard
            title="Chiffre d’affaires"
            value={`${(stats.chiffreAffaires || 0).toLocaleString()} FCFA`}
            icon={<FiTrendingUp />}
          />
          <StatCard
            title="Commandes"
            value={stats.commandes?.total ?? 0}
            icon={<FiShoppingBag />}
          />
          <StatCard
            title="Livrées"
            value={stats.commandes?.livrees ?? 0}
            icon={<FiCheckCircle />}
          />
          <StatCard
            title="Annulées"
            value={stats.commandes?.annulees ?? 0}
            icon={<FiXCircle />}
          />
        </Section>

        {/* CLIENTS */}
        <Section title="Clients">
          <StatCard
            title="Clients totaux"
            value={stats.clients?.total ?? 0}
            icon={<FiUsers />}
          />
          <StatCard
            title="Clients fidèles"
            value={stats.clients?.fideles ?? 0}
            icon={<FiCheckCircle />}
          />
          <StatCard
            title="Nouveaux clients"
            value={stats.clients?.nouveaux ?? 0}
            icon={<FiUserPlus />}
          />
        </Section>

        {/* GRAPHE */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-semibold mb-4">
            Chiffre d’affaires ({periode})
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Line dataKey="ventes" stroke="#f97316" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* =========================
   COMPONENTS
========================== */
const Section = ({ title, children }) => (
  <div>
    <h2 className="text-lg font-semibold mb-4">{title}</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {children}
    </div>
  </div>
);

const SectionSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-gray-200 h-24 rounded animate-pulse"></div>
    ))}
  </div>
);

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-4 rounded shadow flex flex-col">
    <div className="flex items-center gap-2 text-gray-500">
      {icon}
      <span className="truncate">{title}</span>
    </div>
    <p className="text-2xl font-semibold mt-2">{value}</p>
  </div>
);

export default Statistiques;
