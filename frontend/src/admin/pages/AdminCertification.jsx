import { useEffect, useState } from "react";
import {
  getDemandesCertification,
  validerDemandeCertification,
  refuserDemandeCertification,
} from "../services/certification.api";

export default function AdminCertification() {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemandes();
  }, []);

  /* =====================
     VALIDER DEMANDE
  ===================== */
  const handleValider = async (id) => {
    setActionLoading(id);
    try {
      await validerDemandeCertification(id);
      await fetchDemandes(); // rafraîchit la liste après validation
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de la validation");
    } finally {
      setActionLoading(null);
    }
  };

  /* =====================
     REFUSER DEMANDE
  ===================== */
  const handleRefuser = async (id) => {
    setActionLoading(id);
    try {
      await refuserDemandeCertification(id);
      await fetchDemandes(); // rafraîchit la liste après refus
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors du refus");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <p>Chargement des demandes...</p>;
  if (demandes.length === 0)
    return <p className="text-gray-500">Aucune demande de certification.</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Demandes de Certification</h2>

      <div className="overflow-x-auto">
        <table className="w-full table-auto bg-white rounded-xl shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2">Vendeur</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Boutique</th>
              <th className="px-4 py-2">Date demande</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {demandes.map((d) => (
              <tr key={d._id} className="border-t">
                <td className="px-4 py-2">{d.vendeur?.nomVendeur}</td>
                <td className="px-4 py-2">{d.vendeur?.email}</td>
                <td className="px-4 py-2">{d.vendeur?.nomBoutique}</td>
                <td className="px-4 py-2">
                  {d.dateDemande
                    ? new Date(d.dateDemande).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleValider(d._id)}
                    disabled={actionLoading === d._id}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {actionLoading === d._id ? "..." : "Valider"}
                  </button>

                  <button
                    onClick={() => handleRefuser(d._id)}
                    disabled={actionLoading === d._id}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    {actionLoading === d._id ? "..." : "Refuser"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
