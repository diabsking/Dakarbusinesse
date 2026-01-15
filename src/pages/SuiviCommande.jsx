import React, { useEffect, useState } from "react";
import axios from "axios";

/* =====================================================
   SUIVI COMMANDE (VENDEUR)
===================================================== */
function SuiviCommande({ setNotifCommandes }) {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [photoZoom, setPhotoZoom] = useState(null);
  const [clicsVerrouilles, setClicsVerrouilles] = useState({});

  // ✅ Masquage persistant via localStorage
  const [commandesMasquees, setCommandesMasquees] = useState(() => {
    const stored = localStorage.getItem("commandesMasquees");
    return stored ? JSON.parse(stored) : [];
  });

  /* ================= FETCH COMMANDES ================= */
  const fetchCommandes = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        "http://localhost:5000/api/commandes/vendeur",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (Array.isArray(res.data)) {
        setCommandes(res.data);
      }
    } catch (err) {
      console.error("❌ Erreur récupération commandes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommandes();
  }, []);

  /* ================= CONFIRMATION LIVRAISON ================= */
  const confirmerLivraison = async (commandeId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setClicsVerrouilles((prev) => ({ ...prev, [commandeId]: true }));

    try {
      const res = await axios.put(
        `http://localhost:5000/api/commandes/${commandeId}/statut`,
        { status: "Livrée" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCommandes((prev) =>
        prev.map((cmd) =>
          cmd._id === commandeId
            ? { ...cmd, status: res.data.commande.status }
            : cmd
        )
      );
    } catch (err) {
      console.error("❌ Erreur confirmation livraison", err);
      setClicsVerrouilles((prev) => ({ ...prev, [commandeId]: false }));
    }
  };

  /* ================= MASQUER COMMANDE HISTORIQUE ================= */
  const masquerCommande = (commandeId) => {
    setCommandesMasquees((prev) => {
      const updated = [...prev, commandeId];
      localStorage.setItem("commandesMasquees", JSON.stringify(updated));
      return updated;
    });
  };

  /* ================= FILTRES ================= */
  const commandesActives = commandes.filter(
    (c) =>
      c.status.toLowerCase() !== "livré" &&
      c.status.toLowerCase() !== "livrée" &&
      !commandesMasquees.includes(c._id)
  );

  const commandesHistorique = commandes.filter(
    (c) =>
      (c.status.toLowerCase() === "livré" ||
        c.status.toLowerCase() === "livrée") &&
      !commandesMasquees.includes(c._id)
  );

  /* ================= NOTIFICATION TABLEAU DE BORD ================= */
  useEffect(() => {
    if (setNotifCommandes) {
      setNotifCommandes(commandesActives.length);
    }
  }, [commandesActives, setNotifCommandes]);

  /* ================= SKELETON ================= */
  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="w-full bg-gray-200 rounded-xl p-4 animate-pulse h-48"
        />
      ))}
    </div>
  );

  if (loading) return <div className="p-6">{renderSkeleton()}</div>;

  return (
    <div className="p-4 md:p-10 space-y-12">

      {/* ================= COMMANDES EN COURS ================= */}
      <section>
        <h1 className="text-2xl font-semibold mb-6">
          Commandes en cours
        </h1>

        {!commandesActives.length ? (
          <p>Aucune commande en cours.</p>
        ) : (
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-6">
            {commandesActives.map((cmd) => (
              <CommandeCard
                key={cmd._id}
                cmd={cmd}
                confirmerLivraison={confirmerLivraison}
                setPhotoZoom={setPhotoZoom}
                clicsVerrouilles={clicsVerrouilles}
              />
            ))}
          </div>
        )}
      </section>

      {/* ================= HISTORIQUE ================= */}
      <section>
        <h1 className="text-2xl font-semibold mb-6">
          Historique des commandes
        </h1>

        {!commandesHistorique.length ? (
          <p>Aucune commande livrée.</p>
        ) : (
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-6">
            {commandesHistorique.map((cmd) => (
              <CommandeCard
                key={cmd._id}
                cmd={cmd}
                setPhotoZoom={setPhotoZoom}
                clicsVerrouilles={clicsVerrouilles}
                historique
                masquerCommande={masquerCommande} // <- persistant
              />
            ))}
          </div>
        )}
      </section>

      {/* ================= MODAL ZOOM PHOTO ================= */}
      {photoZoom && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setPhotoZoom(null)}
        >
          <img
            src={photoZoom}
            alt="Zoom"
            className="max-h-[90vh] max-w-[90vw] rounded"
          />
        </div>
      )}
    </div>
  );
}

/* =====================================================
   CARTE COMMANDE
===================================================== */
function CommandeCard({
  cmd,
  confirmerLivraison,
  setPhotoZoom,
  clicsVerrouilles,
  historique,
  masquerCommande,
}) {
  const statutColor = (statut) => {
    switch (statut.toLowerCase()) {
      case "en cours":
        return "bg-yellow-200 text-yellow-800";
      case "en préparation":
        return "bg-blue-200 text-blue-800";
      case "livré":
      case "livrée":
        return "bg-green-200 text-green-800";
      case "annulé":
      case "annulée":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  return (
    <div className="w-full sm:w-80 bg-white border rounded-xl p-4 shadow space-y-4 relative">

      {/* MASQUER HISTORIQUE */}
      {historique && masquerCommande && (
        <button
          onClick={() => masquerCommande(cmd._id)}
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xs"
          title="Masquer"
        >
          ✕
        </button>
      )}

      {/* PRODUITS */}
      <div className="space-y-3">
        {cmd.produits.map((p, i) => (
          <div key={i} className="flex gap-3 items-center">
            {p.image && (
              <img
                src={p.image}
                alt={p.nom}
                className="w-14 h-14 object-cover rounded cursor-pointer"
                onClick={() => setPhotoZoom(p.image)}
              />
            )}

            <div className="text-sm">
              <p className="font-medium">{p.nom}</p>
              <p className="text-gray-500">
                {p.quantite} × {p.prix.toLocaleString()} FCFA
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* INFOS CLIENT */}
      <div className="text-sm text-gray-700 space-y-1">
        <p><strong>Client :</strong> {cmd.client.nom}</p>
        <p><strong>Téléphone :</strong> {cmd.client.telephone}</p>
        <p><strong>Adresse :</strong> {cmd.client.adresse}</p>
        <p><strong>Total :</strong> {cmd.total.toLocaleString()} FCFA</p>
        <p className="text-xs text-gray-400">
          {new Date(cmd.createdAt).toLocaleString()}
        </p>
      </div>

      {/* ACTION */}
      {!historique &&
        cmd.status.toLowerCase() === "en cours" &&
        !clicsVerrouilles[cmd._id] && (
          <button
            onClick={() => confirmerLivraison(cmd._id)}
            className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
          >
            Confirmer livraison
          </button>
        )}

      {/* STATUT */}
      <div
        className={`inline-block px-3 py-1 text-xs rounded-full font-semibold ${statutColor(
          cmd.status
        )}`}
      >
        {cmd.status}
      </div>
    </div>
  );
}

export default SuiviCommande;
