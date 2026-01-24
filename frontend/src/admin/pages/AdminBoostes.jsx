import { useEffect, useState } from "react";
import {
  getDemandesBoost,
  validerBoost,
  refuserBoost,
  envoyerMailBoost, // <-- nouveau service
} from "../services/boost.api";

export default function AdminBoosts() {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const [modal, setModal] = useState({
    open: false,
    type: null, // "VALIDER" | "REFUSER"
    id: null,
    produit: null,
    vendeur: null,
  });

  useEffect(() => {
    fetchDemandes();
  }, []);

  const fetchDemandes = async () => {
    setLoading(true);
    try {
      const res = await getDemandesBoost();
      const demandesRecues = res?.data?.demandes || res?.data?.data?.demandes || [];
      setDemandes(demandesRecues);
    } catch (err) {
      console.error("❌ Erreur chargement boosts :", err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type, d) => {
    setModal({
      open: true,
      type,
      id: d._id,
      produit: d.produit?.nom,
      vendeur: d.utilisateur,
    });
  };

  const closeModal = () => {
    setModal({
      open: false,
      type: null,
      id: null,
      produit: null,
      vendeur: null,
    });
  };

  const handleValider = async (id) => {
    setActionLoading(id);
    try {
      const res = await validerBoost(id);

      // envoyer mail au vendeur
      await envoyerMailBoost({
        email: res.data.vendeur.email,
        type: "VALIDEE",
        produit: res.data.boost.produit.nom,
      });

      await fetchDemandes();
    } catch (err) {
      console.error("❌ Erreur validation boost :", err?.response?.data || err);
    } finally {
      setActionLoading(null);
      closeModal();
    }
  };

  const handleRefuser = async (id) => {
    setActionLoading(id);
    try {
      const res = await refuserBoost(id);

      // envoyer mail au vendeur
      await envoyerMailBoost({
        email: res.data.vendeur.email,
        type: "REFUSEE",
        produit: res.data.boost.produit.nom,
      });

      await fetchDemandes();
    } catch (err) {
      console.error("❌ Erreur refus boost :", err?.response?.data || err);
    } finally {
      setActionLoading(null);
      closeModal();
    }
  };

  if (loading) {
    return <p>Chargement des demandes...</p>;
  }

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
            const disabled = actionLoading === d._id;
            const img = d.produit?.images?.[0] || "/placeholder.jpg";

            return (
              <div
                key={d._id}
                className="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row gap-4"
              >
                <div className="md:w-2/5 flex items-center gap-4">
                  <img
                    src={img}
                    alt={d.produit?.nom || "Produit"}
                    className="h-16 w-16 object-cover rounded-lg"
                  />

                  <div>
                    <p className="font-bold">
                      {d.produit?.nom || "Produit inconnu"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Vendeur : {d.utilisateur?.nom || d.utilisateur?.email || "Inconnu"}
                    </p>
                    <p className="text-sm text-gray-700">
                      Statut :{" "}
                      <span className={
                        d.statut === "VALIDEE"
                          ? "text-green-600 font-bold"
                          : d.statut === "REFUSEE"
                          ? "text-red-600 font-bold"
                          : "text-orange-600 font-bold"
                      }>
                        {d.statut}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="md:w-3/5 flex flex-col gap-3">
                  <div className="flex flex-wrap gap-2">
                    <Tag label={`Durée : ${d.duree} jours`} />
                    <Tag label={`Montant : ${d.montant} FCFA`} />
                    <Tag label={`Wave : ${d.waveNumber}`} />
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <button
                      disabled={disabled}
                      onClick={() => openModal("VALIDER", d)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                    >
                      {actionLoading === d._id ? "..." : "Valider"}
                    </button>

                    <button
                      disabled={disabled}
                      onClick={() => openModal("REFUSER", d)}
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

      {/* MODAL */}
      {modal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/3">
            <h3 className="text-xl font-bold mb-4">
              {modal.type === "VALIDER" ? "Valider la demande ?" : "Refuser la demande ?"}
            </h3>

            <p className="mb-4">
              Produit : <strong>{modal.produit}</strong>
            </p>

            <div className="flex gap-2 justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-200 px-4 py-2 rounded-lg"
              >
                Annuler
              </button>

              {modal.type === "VALIDER" ? (
                <button
                  onClick={() => handleValider(modal.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  {actionLoading === modal.id ? "..." : "Confirmer"}
                </button>
              ) : (
                <button
                  onClick={() => handleRefuser(modal.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  {actionLoading === modal.id ? "..." : "Confirmer"}
                </button>
              )}
            </div>
          </div>
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
