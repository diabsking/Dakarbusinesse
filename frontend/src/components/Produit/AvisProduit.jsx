import React, { useEffect, useState } from "react";
import api from "../../services/api"; // 🔥 IMPORTANT : utilise ton api global
import { FiStar } from "react-icons/fi";

const AVIS_LIMIT = 3;

const AvisProduit = ({ produitId, avisInit = [], onAvisAjoute }) => {
  const [avis, setAvis] = useState([]);
  const [clientNom, setClientNom] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [note, setNote] = useState(0);
  const [commentaire, setCommentaire] = useState("");
  const [loading, setLoading] = useState(false);
  const [voirTous, setVoirTous] = useState(false);

  useEffect(() => {
    setAvis(avisInit || []);
    setVoirTous(false);
  }, [produitId, avisInit]);

  const avisAffiches = voirTous ? avis : avis.slice(0, AVIS_LIMIT);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientNom || !clientPhone || !note) return;

    setLoading(true);
    try {
      const res = await api.post("/avis", {
        produit: produitId,
        clientNom,
        clientPhone,
        note,
        commentaire,
      });

      if (res.data?.avis) {
        setAvis((prev) => [res.data.avis, ...prev]);
        onAvisAjoute?.(res.data.avis);

        setClientNom("");
        setClientPhone("");
        setNote(0);
        setCommentaire("");
      }
    } catch (err) {
      console.error("Erreur ajout avis :", err);
      alert("Impossible d'ajouter l'avis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-6 border-t pt-4">
      {/* TITRE */}
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Avis clients
      </h3>

      {/* LISTE AVIS */}
      {avis.length === 0 ? (
        <p className="text-sm text-gray-500">
          Aucun avis pour ce produit
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {avisAffiches.map((a) => (
            <div
              key={a._id}
              className="bg-gray-50 px-3 py-3 rounded-md text-sm"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-800">
                  {a.clientNom || "Client"}
                </p>

                <div className="flex">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <FiStar
                        key={i}
                        size={14}
                        className={i < a.note ? "text-yellow-500" : "text-gray-300"}
                      />
                    ))}
                </div>
              </div>

              {a.commentaire && (
                <p className="text-gray-600 mt-2 text-sm">
                  {a.commentaire}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* VOIR PLUS / MOINS */}
      {avis.length > AVIS_LIMIT && (
        <button
          onClick={() => setVoirTous(!voirTous)}
          className="text-xs text-blue-600 mt-2 hover:underline"
        >
          {voirTous ? "Voir moins" : "Voir tous les avis"}
        </button>
      )}

      {/* FORMULAIRE */}
      <form
        onSubmit={handleSubmit}
        className="mt-5 flex flex-col gap-3"
      >
        <p className="text-xs text-gray-500">
          Laisser un avis
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Nom"
            value={clientNom}
            onChange={(e) => setClientNom(e.target.value)}
            className="flex-1 text-sm border rounded-md px-3 py-2"
            required
          />
          <input
            type="text"
            placeholder="Téléphone"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            className="flex-1 text-sm border rounded-md px-3 py-2"
            required
          />
        </div>

        {/* NOTE */}
        <div className="flex gap-1 text-lg">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <FiStar
                key={i}
                onClick={() => setNote(i + 1)}
                className={`cursor-pointer ${
                  i < note ? "text-yellow-500" : "text-gray-300"
                }`}
              />
            ))}
        </div>

        <textarea
          placeholder="Commentaire (optionnel)"
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          rows={3}
          className="text-sm border rounded-md px-3 py-2 resize-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="self-start px-5 py-2 rounded-full bg-gray-200 hover:bg-gray-300 transition text-sm font-semibold"
        >
          {loading ? "Envoi..." : "Publier"}
        </button>
      </form>
    </section>
  );
};

export default AvisProduit;
