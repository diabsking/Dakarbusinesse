import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../services/api";

function ProductStats({ produitId }) {
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!produitId) return; // ⚡ vérifie que produitId existe

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get(`/api/stat/produit/${produitId}/events`);

        // ⚡ forcer un tableau même si backend renvoie { produit: ..., events: [...] }
        let eventsArray = [];
        if (Array.isArray(res.data)) eventsArray = res.data;
        else if (res.data && Array.isArray(res.data.events)) eventsArray = res.data.events;
        else eventsArray = [];

        // filtrer les valeurs nulles / undefined
        eventsArray = eventsArray.filter((e) => e && typeof e === "object");

        setEventsData(eventsArray);
      } catch (err) {
        console.error("Erreur récupération stats :", err);
        setEventsData([]);
        setError("Impossible de charger les statistiques.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [produitId]);

  if (loading)
    return <p className="p-4 text-gray-500 text-center">Chargement des statistiques...</p>;

  if (error)
    return <p className="p-4 text-red-500 text-center">{error}</p>;

  const safeEvents = Array.isArray(eventsData) ? eventsData : [];

  const statistiques = safeEvents.reduce(
    (acc, event) => {
      if (!event || typeof event !== "object") return acc;
      switch (event.type) {
        case "VIEW":
          acc.vues += 1;
          break;
        case "PANIER":
          acc.panier += 1;
          break;
        case "COMMANDE":
          acc.commandes += 1;
          acc.chiffreAffaires += typeof event.montant === "number" ? event.montant : 0;
          break;
        default:
          break;
      }
      return acc;
    },
    { vues: 0, panier: 0, commandes: 0, chiffreAffaires: 0 }
  );

  const formatNumber = (num) =>
    new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(num);

  return (
    <div className="p-4 bg-white rounded shadow space-y-4">
      <h3 className="text-xl font-semibold text-center">Statistiques du produit</h3>

      {safeEvents.length === 0 ? (
        <p className="text-gray-500 text-center mt-3">Aucune statistique disponible.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="p-3 bg-gray-100 rounded text-center">
            <p className="text-sm text-gray-500">Vues</p>
            <p className="text-lg font-bold">{formatNumber(statistiques.vues)}</p>
          </div>
          <div className="p-3 bg-gray-100 rounded text-center">
            <p className="text-sm text-gray-500">Ajouts au panier</p>
            <p className="text-lg font-bold">{formatNumber(statistiques.panier)}</p>
          </div>
          <div className="p-3 bg-gray-100 rounded text-center">
            <p className="text-sm text-gray-500">Commandes</p>
            <p className="text-lg font-bold">{formatNumber(statistiques.commandes)}</p>
          </div>
          <div className="p-3 bg-gray-100 rounded text-center">
            <p className="text-sm text-gray-500">Chiffre d'affaires</p>
            <p className="text-lg font-bold">{formatNumber(statistiques.chiffreAffaires)} FCFA</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductStats;
