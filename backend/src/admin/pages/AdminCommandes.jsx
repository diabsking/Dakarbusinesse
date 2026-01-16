import { useEffect, useState } from "react";
import { listerCommandes, modifierCommande } from "../services/admin.api";

const PLACEHOLDER = "/placeholder.png";

/* =========================
   FORMAT DATE
========================= */
const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function AdminCommandes() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // RECHERCHE
  // =========================
  const [searchTerm, setSearchTerm] = useState("");

  /* =========================
     LOAD COMMANDES
  ========================= */
  const loadCommandes = async () => {
    try {
      const res = await listerCommandes();
      setCommandes(res.data || []);
    } catch (error) {
      console.error("❌ Erreur chargement commandes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommandes();
  }, []);

  /* =========================
     CHANGER STATUT
  ========================= */
  const changerStatut = async (commandeId, status) => {
    try {
      await modifierCommande(commandeId, status);
      loadCommandes();
    } catch (error) {
      console.error("❌ Erreur changement statut", error);
    }
  };

  /* =========================
     STATS COMMANDES
  ========================= */
  const stats = {
    total: commandes.length,
    enCours: commandes.filter((c) => c.status === "en cours").length,
    preparation: commandes.filter((c) => c.status === "en préparation").length,
    livre: commandes.filter((c) => c.status === "livré").length,
    annule: commandes.filter((c) => c.status === "annulé").length,
    chiffreAffaire: commandes.reduce((acc, c) => acc + (c.total || 0), 0), // CA total
  };

  if (loading) return <p>Chargement des commandes...</p>;

  /* =========================
     FILTRAGE COMMANDES
  ========================= */
  const filteredCommandes = commandes.filter((c) => {
    const client = c.client || {};
    const term = searchTerm.toLowerCase();

    return (
      c._id.toLowerCase().includes(term) ||
      (client.nom && client.nom.toLowerCase().includes(term)) ||
      (client.email && client.email.toLowerCase().includes(term)) ||
      (client.telephone && client.telephone.toLowerCase().includes(term))
    );
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        Commandes ({stats.total})
      </h2>

      {/* =====================
         STATS + RECHERCHE
      ===================== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 w-full md:w-auto">
          <div className="bg-gray-100 p-4 rounded-xl">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>

          <div className="bg-yellow-100 p-4 rounded-xl">
            <p className="text-sm text-gray-600">En cours</p>
            <p className="text-2xl font-bold text-yellow-700">{stats.enCours}</p>
          </div>

          <div className="bg-blue-100 p-4 rounded-xl">
            <p className="text-sm text-gray-600">En préparation</p>
            <p className="text-2xl font-bold text-blue-700">{stats.preparation}</p>
          </div>

          <div className="bg-green-100 p-4 rounded-xl">
            <p className="text-sm text-gray-600">Livrées</p>
            <p className="text-2xl font-bold text-green-700">{stats.livre}</p>
          </div>

          <div className="bg-red-100 p-4 rounded-xl">
            <p className="text-sm text-gray-600">Annulées</p>
            <p className="text-2xl font-bold text-red-700">{stats.annule}</p>
          </div>

          <div className="bg-purple-100 p-4 rounded-xl">
            <p className="text-sm text-gray-600">Chiffre d'affaires</p>
            <p className="text-2xl font-bold text-purple-700">{stats.chiffreAffaire} FCFA</p>
          </div>
        </div>

        {/* BARRE DE RECHERCHE */}
        <input
          type="text"
          placeholder="Recherche par ID, nom, mail ou téléphone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-lg w-full md:w-80"
        />
      </div>

      {/* =====================
         LISTE COMMANDES
      ===================== */}
      <div className="space-y-6">
        {filteredCommandes.map((c) => {
          const client = c.client || {};
          const statutColor =
            c.status === "livré"
              ? "text-green-600"
              : c.status === "annulé"
              ? "text-red-600"
              : "text-yellow-600";

          return (
            <div key={c._id} className="bg-white rounded-xl shadow p-6">
              {/* HEADER */}
              <div className="flex flex-wrap justify-between gap-4 mb-4">
                <div>
                  <p className="font-semibold">
                    Client : <span className="font-normal">{client.nom || "—"}</span>
                  </p>
                  <p className="text-sm text-gray-600">📞 {client.telephone || "—"}</p>
                  <p className="text-sm text-gray-600">📍 {client.adresse || "—"}</p>
                  {client.email && (
                    <p className="text-sm text-gray-600">📧 {client.email}</p>
                  )}
                </div>

                <div className="text-right">
                  <p className={`font-bold ${statutColor}`}>{c.status}</p>
                  <p className="text-sm text-gray-500">📅 {formatDate(c.createdAt)}</p>
                  <p className="text-sm text-gray-500">
                    Total : <span className="font-semibold">{c.total} FCFA</span>
                  </p>
                </div>
              </div>

              {/* PRODUITS */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 text-left">Produit</th>
                      <th className="p-2 text-left">Vendeur</th>
                      <th className="p-2 text-left">Téléphone</th>
                      <th className="p-2">Prix</th>
                      <th className="p-2">Qté</th>
                      <th className="p-2">Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {c.produits?.map((p, index) => {
                      const image = p.image || PLACEHOLDER;
                      const totalProduit = (p.prix || 0) * (p.quantite || 1);

                      return (
                        <tr key={index} className="border-t align-middle">
                          <td className="p-2 flex items-center gap-3">
                            <img
                              src={image}
                              alt={p.nom}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <span>{p.nom}</span>
                          </td>

                          <td className="p-2">{p.vendeur?.nomBoutique || "Vendeur"}</td>
                          <td className="p-2">{p.vendeur?.telephone || "—"}</td>
                          <td className="p-2 text-center">{p.prix} FCFA</td>
                          <td className="p-2 text-center">{p.quantite}</td>
                          <td className="p-2 text-center font-semibold">{totalProduit} FCFA</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* ACTION ADMIN */}
              <div className="mt-4 flex justify-end">
                <select
                  value={c.status}
                  onChange={(e) => changerStatut(c._id, e.target.value)}
                  className="border rounded px-3 py-1"
                >
                  <option value="en cours">En cours</option>
                  <option value="en préparation">En préparation</option>
                  <option value="livré">Livré</option>
                  <option value="annulé">Annulé</option>
                </select>
              </div>
            </div>
          );
        })}

        {filteredCommandes.length === 0 && (
          <p className="text-center text-gray-500">Aucune commande trouvée</p>
        )}
      </div>
    </div>
  );
}
