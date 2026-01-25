import { useEffect, useMemo, useState } from "react";
import {
  getDemandesCertification,
  validerDemandeCertification,
  refuserDemandeCertification,
} from "../services/certification.api";

const DEFAULT_PRICE = 5000;

export default function AdminCertification() {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [searchEmail, setSearchEmail] = useState("");

  /* =====================
     CHARGER LES DEMANDES
  ===================== */
  const fetchDemandes = async () => {
    setLoading(true);
    try {
      const res = await getDemandesCertification();
      setDemandes(res.data || []);
    } catch (err) {
      console.error("Erreur fetch demandes :", err);
      alert("Erreur lors du chargement des demandes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemandes();
  }, []);

  /* =====================
     VALIDATION
  ===================== */
  const handleValider = async (id) => {
    if (!window.confirm("Valider cette demande de certification ?")) return;

    setActionLoading(id);
    try {
      await validerDemandeCertification(id);
      await fetchDemandes();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Erreur lors de la validation");
    } finally {
      setActionLoading(null);
    }
  };

  /* =====================
     REFUS
  ===================== */
  const handleRefuser = async (id) => {
    if (!window.confirm("Refuser cette demande de certification ?")) return;

    setActionLoading(id);
    try {
      await refuserDemandeCertification(id);
      await fetchDemandes();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Erreur lors du refus");
    } finally {
      setActionLoading(null);
    }
  };

  /* =====================
     FILTRAGE PAR EMAIL
  ===================== */
  const demandesFiltrees = useMemo(
    () =>
      demandes.filter((d) =>
        d.vendeur?.email?.toLowerCase().includes(searchEmail.toLowerCase())
      ),
    [demandes, searchEmail]
  );

  /* =====================
     STATS
  ===================== */
  const stats = useMemo(() => {
    let total = 0,
      totalValide = 0,
      totalRefuse = 0;

    demandes.forEach((d) => {
      const montant = d.montantInitial || DEFAULT_PRICE;
      total += montant;
      if (d.statut === "active") totalValide += montant;
      if (d.statut === "rejected") totalRefuse += montant;
    });

    return {
      nbDemandes: demandes.length,
      total,
      totalValide,
      totalRefuse,
    };
  }, [demandes]);

  if (loading) return <p>Chargement des demandes...</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Demandes de Certification</h2>

      {/* ===================== STATS ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Demandes" value={stats.nbDemandes} />
        <StatCard
          title="Montant total"
          value={`${stats.total.toLocaleString()} FCFA`}
        />
        <StatCard
          title="Validé"
          value={`${stats.totalValide.toLocaleString()} FCFA`}
          color="green"
        />
        <StatCard
          title="Refusé"
          value={`${stats.totalRefuse.toLocaleString()} FCFA`}
          color="red"
        />
      </div>

      {/* ===================== RECHERCHE ===================== */}
      <div>
        <input
          type="text"
          placeholder="Rechercher par email vendeur..."
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="w-full md:w-1/3 border rounded px-3 py-2"
        />
      </div>

      {/* ===================== TABLE ===================== */}
      {demandesFiltrees.length === 0 ? (
        <p className="text-gray-500">Aucune demande trouvée.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto bg-white rounded-xl shadow">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2">Vendeur</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Boutique</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Montant</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {demandesFiltrees.map((d) => (
                <tr key={d._id} className="border-t">
                  <td className="px-4 py-2">{d.vendeur?.nomVendeur}</td>
                  <td className="px-4 py-2">{d.vendeur?.email}</td>
                  <td className="px-4 py-2">{d.vendeur?.nomBoutique}</td>
                  <td className="px-4 py-2">
                    {d.dateDemande
                      ? new Date(d.dateDemande).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-2 font-semibold">
                    {(d.montantInitial || DEFAULT_PRICE).toLocaleString()} FCFA
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleValider(d._id)}
                      disabled={actionLoading === d._id}
                      className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
                    >
                      {actionLoading === d._id ? "..." : "Valider"}
                    </button>
                    <button
                      onClick={() => handleRefuser(d._id)}
                      disabled={actionLoading === d._id}
                      className="bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50"
                    >
                      {actionLoading === d._id ? "..." : "Refuser"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* =====================
   COMPONENT STAT CARD
===================== */
function StatCard({ title, value, color = "blue" }) {
  const colors = {
    blue: "text-blue-600",
    green: "text-green-600",
    red: "text-red-600",
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className={`text-xl font-bold ${colors[color]}`}>{value}</p>
    </div>
  );
}
