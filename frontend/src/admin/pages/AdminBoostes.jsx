import { useEffect, useState } from "react";
import {
  getDemandesBoost,
  validerBoost,
  refuserBoost,
} from "../services/boost.api";

export default function AdminBoosts() {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [search, setSearch] = useState("");

  const [modal, setModal] = useState({
    open: false,
    type: null,
    id: null,
    produit: null,
  });

  useEffect(() => {
    fetchDemandes();
  }, []);

  const fetchDemandes = async () => {
    setLoading(true);
    try {
      const res = await getDemandesBoost();
      setDemandes(
        res?.data?.demandes || res?.data?.data?.demandes || []
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: demandes.length,
    validees: demandes.filter((d) => d.statut === "VALIDEE").length,
    refusees: demandes.filter((d) => d.statut === "REFUSEE").length,
    attente: demandes.filter((d) => d.statut === "EN_ATTENTE").length,
  };

  const demandesFiltrees = demandes.filter((d) => {
    const q = search.toLowerCase();
    return (
      d.utilisateur?.email?.toLowerCase().includes(q) ||
      d.utilisateur?.nom?.toLowerCase().includes(q) ||
      d.produit?.nom?.toLowerCase().includes(q) ||
      d.waveNumber?.toString().includes(q)
    );
  });

  const handleAction = async (id, type) => {
    if (actionLoading) return;
    setActionLoading(id);
    try {
      type === "VALIDER"
        ? await validerBoost(id)
        : await refuserBoost(id);

      setDemandes((prev) =>
        prev.map((d) =>
          d._id === id
            ? { ...d, statut: type === "VALIDER" ? "VALIDEE" : "REFUSEE" }
            : d
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
      setModal({ open: false });
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="pb-20">
      <h2 className="text-xl font-bold mb-4">
        Demandes de boost
      </h2>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard label="Total" value={stats.total} color="bg-gray-800" />
        <StatCard label="Validées" value={stats.validees} color="bg-green-600" />
        <StatCard label="Refusées" value={stats.refusees} color="bg-red-600" />
        <StatCard label="En attente" value={stats.attente} color="bg-orange-500" />
      </div>

      {/* SEARCH */}
      <input
        className="w-full mb-4 px-4 py-3 border rounded-xl text-sm"
        placeholder="Email, produit ou Wave..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {demandesFiltrees.length === 0 ? (
        <p className="text-red-600 font-semibold">
          Aucune demande trouvée
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {demandesFiltrees.map((d) => (
            <div
              key={d._id}
              className="bg-white rounded-xl shadow p-4 flex flex-col gap-3"
            >
              {/* PRODUIT */}
              <div className="flex items-center gap-3">
                <img
                  src={d.produit?.images?.[0] || "/placeholder.jpg"}
                  className="h-14 w-14 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-bold text-sm">
                    {d.produit?.nom}
                  </p>
                  <p className="text-xs text-gray-500">
                    {d.utilisateur?.email}
                  </p>
                </div>
              </div>

              {/* TAGS */}
              <div className="flex flex-wrap gap-2 text-xs">
                <Tag label={`${d.duree} jours`} />
                <Tag label={`${d.montant} FCFA`} />
                <Tag label={`Wave ${d.waveNumber}`} />
              </div>

              {/* STATUT */}
              <p className="text-sm">
                Statut :{" "}
                <span
                  className={
                    d.statut === "VALIDEE"
                      ? "text-green-600 font-bold"
                      : d.statut === "REFUSEE"
                      ? "text-red-600 font-bold"
                      : "text-orange-600 font-bold"
                  }
                >
                  {d.statut}
                </span>
              </p>

              {/* ACTIONS */}
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setModal({ open: true, id: d._id, type: "VALIDER", produit: d.produit?.nom })
                  }
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm"
                >
                  Valider
                </button>
                <button
                  onClick={() =>
                    setModal({ open: true, id: d._id, type: "REFUSER", produit: d.produit?.nom })
                  }
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm"
                >
                  Refuser
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL MOBILE */}
      {modal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full sm:w-1/3 rounded-t-2xl sm:rounded-xl p-5">
            <h3 className="font-bold text-lg mb-3">
              {modal.type === "VALIDER"
                ? "Valider la demande ?"
                : "Refuser la demande ?"}
            </h3>

            <p className="text-sm mb-4">
              Produit : <strong>{modal.produit}</strong>
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setModal({ open: false })}
                className="flex-1 bg-gray-200 py-3 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={() => handleAction(modal.id, modal.type)}
                className={`flex-1 py-3 rounded-lg text-white ${
                  modal.type === "VALIDER"
                    ? "bg-green-600"
                    : "bg-red-600"
                }`}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* COMPONENTS */

function Tag({ label }) {
  return (
    <span className="bg-gray-100 px-3 py-1 rounded-full">
      {label}
    </span>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className={`${color} text-white p-4 rounded-xl`}>
      <p className="text-xs opacity-80">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
