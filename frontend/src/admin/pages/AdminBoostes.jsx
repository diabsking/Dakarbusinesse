import { useEffect, useState } from "react";
import {
  getDemandesBoost,
  validerBoost,
  refuserBoost,
} from "../services/admin.api";

export default function AdminBoosts() {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    console.log("🟢 AdminBoosts monté");
    fetchDemandes();
  }, []);

  const fetchDemandes = async () => {
    console.log("🔵 fetchDemandes() appelé");
    setLoading(true);

    try {
      const res = await getDemandesBoost();

      console.log("🟡 Réponse API brute :", res);
      console.log("🟡 res.data :", res?.data);

      const demandesRecues =
        res?.data?.demandes ||
        res?.data?.data?.demandes ||
        [];

      console.log("🟢 Demandes finales :", demandesRecues);
      console.log("🟢 Nombre de demandes :", demandesRecues.length);

      setDemandes(demandesRecues);
    } catch (err) {
      console.error(
        "❌ Erreur chargement boosts :",
        err?.response?.data || err
      );
    } finally {
      setLoading(false);
      console.log("🔵 fetchDemandes() terminé");
    }
  };

  const handleValider = async (id) => {
    console.log("✅ Validation boost :", id);
    setActionLoading(id);
    try {
      await validerBoost(id);
      await fetchDemandes();
    } catch (err) {
      console.error(
        "❌ Erreur validation boost :",
        err?.response?.data || err
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleRefuser = async (id) => {
    console.log("⛔ Refus boost :", id);
    setActionLoading(id);
    try {
      await refuserBoost(id);
      await fetchDemandes();
    } catch (err) {
      console.error(
        "❌ Erreur refus boost :",
        err?.response?.data || err
      );
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    console.log("⏳ Loading...");
    return <p>Chargement des demandes...</p>;
  }

  console.log("🧾 RENDER demandes :", demandes);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Demandes de boost</h2>

      {demandes.length === 0 ? (
        <p className="text-red-600 font-semibold">
          Aucune demande pour le moment
        </p>
      ) : (
        <div className="grid gap-4">
          {demandes.map((d) => {
            const disabled =
              actionLoading === d._id || d.statut !== "EN_ATTENTE";

            return (
              <div
                key={d._id}
                className="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row gap-4"
              >
                <div className="md:w-2/5 flex items-center gap-4">
                  <img
                    src="/placeholder.jpg"
                    alt={d.produit?.nom}
                    className="h-16 w-16 object-cover rounded-lg"
                  />

                  <div>
                    <p className="font-bold">{d.produit?.nom}</p>
                    <p className="text-sm text-gray-500">
                      Vendeur : {d.utilisateur?.nom || d.utilisateur?.email}
                    </p>
                  </div>
                </div>

                <div className="md:w-3/5 flex flex-col gap-3">
                  <div className="flex flex-wrap gap-2">
                    <Tag label={`Durée : ${d.duree} jours`} />
                    <Tag label={`Montant : ${d.montant} FCFA`} />
                    <Tag label={`Wave : ${d.waveNumber}`} />
                    <Tag label={`Statut : ${d.statut}`} />
                  </div>

                  <div className="flex gap-2">
                    <button
                      disabled={disabled}
                      onClick={() => handleValider(d._id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                    >
                      {actionLoading === d._id ? "..." : "Valider"}
                    </button>

                    <button
                      disabled={disabled}
                      onClick={() => handleRefuser(d._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                    >
                      {actionLoading === d._id ? "..." : "Refuser"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Tag({ label }) {
  return (
    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
      {label}
    </span>
  );
}
