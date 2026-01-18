import { useEffect, useMemo, useState } from "react";
import {
  listerVendeurs,
  changerStatutVendeur,
  changerCertificationVendeur,
} from "../services/admin.api";

const AVATAR_PLACEHOLDER = "/shop-placeholder.png";

export default function AdminVendeurs() {
  const [vendeurs, setVendeurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  /* =========================
     LOAD VENDEURS
  ========================= */
  const loadVendeurs = async () => {
    try {
      setError(null);
      const res = await listerVendeurs();
      setVendeurs(res.data.data || []);
    } catch (err) {
      console.error("Erreur chargement vendeurs", err);
      setError("Impossible de charger les vendeurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendeurs();
  }, []);

  /* =========================
     FILTRE RECHERCHE
  ========================= */
  const vendeursFiltres = useMemo(() => {
    if (!search.trim()) return vendeurs;

    const q = search.toLowerCase();

    return vendeurs.filter((v) => {
      return (
        v.nomBoutique?.toLowerCase().includes(q) ||
        v.telephone?.toLowerCase().includes(q) ||
        v.email?.toLowerCase().includes(q)
      );
    });
  }, [vendeurs, search]);

  /* =========================
     COMPTEURS
  ========================= */
  const totalVendeurs = vendeursFiltres.length;
  const vendeursCertifies = vendeursFiltres.filter(
    (v) => v.certifie
  ).length;
  const vendeursNonCertifies = vendeursFiltres.filter(
    (v) => !v.certifie
  ).length;
  const vendeursSuspendus = vendeursFiltres.filter(
    (v) => !v.actif
  ).length;

  /* =========================
     ACTIONS
  ========================= */
  const toggleStatut = async (vendeur) => {
    try {
      setActionId(vendeur._id);
      await changerStatutVendeur(vendeur._id, !vendeur.actif);

      setVendeurs((prev) =>
        prev.map((v) =>
          v._id === vendeur._id
            ? { ...v, actif: !v.actif }
            : v
        )
      );
    } catch (err) {
      console.error(err);
      alert("Erreur lors du changement de statut");
    } finally {
      setActionId(null);
    }
  };

  const toggleCertification = async (vendeur) => {
    try {
      setActionId(vendeur._id);
      await changerCertificationVendeur(
        vendeur._id,
        !vendeur.certifie
      );

      setVendeurs((prev) =>
        prev.map((v) =>
          v._id === vendeur._id
            ? { ...v, certifie: !v.certifie }
            : v
        )
      );
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la certification");
    } finally {
      setActionId(null);
    }
  };

  if (loading) return <p>Chargement des vendeurs...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Vendeurs</h2>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="🔍 Rechercher par nom, téléphone ou email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* =====================
         COMPTEURS
      ===================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-gray-500 text-sm">Total vendeurs</p>
          <p className="text-2xl font-bold">{totalVendeurs}</p>
        </div>

        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-gray-500 text-sm">Certifiés</p>
          <p className="text-2xl font-bold text-green-600">
            {vendeursCertifies}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-gray-500 text-sm">Non certifiés</p>
          <p className="text-2xl font-bold text-yellow-600">
            {vendeursNonCertifies}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-gray-500 text-sm">Suspendus</p>
          <p className="text-2xl font-bold text-red-600">
            {vendeursSuspendus}
          </p>
        </div>
      </div>

      {/* =====================
         MOBILE LISTE
      ===================== */}
      <div className="md:hidden space-y-4">
        {vendeursFiltres.map((v) => (
          <div
            key={v._id}
            className="bg-white rounded-xl shadow p-4 space-y-3"
          >
            <div className="flex items-center gap-3">
              <img
                src={v.avatar || AVATAR_PLACEHOLDER}
                alt={v.nomBoutique}
                className="w-12 h-12 rounded-full object-cover border"
              />
              <div className="flex-1">
                <p className="font-semibold">{v.nomBoutique}</p>
                <p className="text-xs text-gray-500">
                  ID: {v._id.slice(-6)}
                </p>
              </div>
            </div>

            <div className="text-sm text-gray-700 space-y-1">
              <p>📧 {v.email || "—"}</p>
              <p>📞 {v.telephone || "—"}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span
                className={`px-2 py-1 rounded text-sm ${
                  v.actif
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {v.actif ? "Actif" : "Suspendu"}
              </span>

              {v.certifie ? (
                <span className="text-green-600 text-sm font-medium">
                  ✅ Certifié
                </span>
              ) : (
                <span className="text-gray-500 text-sm">
                  ❌ Non certifié
                </span>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                disabled={actionId === v._id}
                onClick={() => toggleStatut(v)}
                className="flex-1 px-3 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                {v.actif ? "Suspendre" : "Activer"}
              </button>

              <button
                disabled={actionId === v._id}
                onClick={() => toggleCertification(v)}
                className="flex-1 px-3 py-2 text-sm rounded bg-blue-200 hover:bg-blue-300 disabled:opacity-50"
              >
                {v.certifie ? "Retirer badge" : "Certifier"}
              </button>
            </div>
          </div>
        ))}

        {vendeursFiltres.length === 0 && (
          <p className="text-center text-gray-500">
            Aucun vendeur trouvé
          </p>
        )}
      </div>

      {/* =====================
         TABLE DESKTOP
      ===================== */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Vendeur</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Statut</th>
              <th className="p-3">Certification</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {vendeursFiltres.map((v) => (
              <tr key={v._id} className="border-t align-top">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={v.avatar || AVATAR_PLACEHOLDER}
                      alt={v.nomBoutique}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                    <div>
                      <p className="font-semibold">{v.nomBoutique}</p>
                      <p className="text-xs text-gray-500">
                        ID: {v._id.slice(-6)}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="p-3 text-sm">
                  <p>📧 {v.email || "—"}</p>
                  <p>📞 {v.telephone || "—"}</p>
                </td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      v.actif
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {v.actif ? "Actif" : "Suspendu"}
                  </span>
                </td>

                <td className="p-3">
                  {v.certifie ? (
                    <span className="text-green-600 font-medium">
                      ✅ Certifié
                    </span>
                  ) : (
                    <span className="text-gray-500">
                      ❌ Non certifié
                    </span>
                  )}
                </td>

                <td className="p-3 flex gap-2">
                  <button
                    disabled={actionId === v._id}
                    onClick={() => toggleStatut(v)}
                    className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                  >
                    {v.actif ? "Suspendre" : "Activer"}
                  </button>

                  <button
                    disabled={actionId === v._id}
                    onClick={() => toggleCertification(v)}
                    className="px-3 py-1 text-sm rounded bg-blue-200 hover:bg-blue-300 disabled:opacity-50"
                  >
                    {v.certifie ? "Retirer badge" : "Certifier"}
                  </button>
                </td>
              </tr>
            ))}

            {vendeursFiltres.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="p-6 text-center text-gray-500"
                >
                  Aucun vendeur trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
