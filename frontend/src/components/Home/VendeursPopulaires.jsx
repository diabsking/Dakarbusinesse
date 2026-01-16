import React, { useEffect, useState } from "react";
import axios from "axios";

export default function VendeursPopulaires() {
  const [vendeurs, setVendeurs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendeurs = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/vendeurs/meilleur"
        );

        // Sécurisation totale
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.vendeurs || res.data.data || [];

        setVendeurs(data);
      } catch (error) {
        console.error("Erreur récupération vendeurs populaires:", error);
        setVendeurs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVendeurs();
  }, []);

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4">Vendeurs populaires</h2>

      {loading ? (
        <p>Chargement des vendeurs...</p>
      ) : vendeurs.length === 0 ? (
        <p className="text-gray-500">Aucun vendeur trouvé</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vendeurs.map((v) => (
            <div
              key={v._id}
              className="p-4 border rounded-2xl flex flex-col items-center"
            >
              <div className="w-24 h-24 mb-3 overflow-hidden rounded-full bg-gray-200">
                <img
                  src={v.avatar || "/default-avatar.png"}
                  alt={v.nomBoutique || "Vendeur"}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="font-semibold">
                {v.nomBoutique || "Boutique"}
              </h3>

              <p className="text-sm text-gray-500">
                {v.certifie ? "Vendeur certifié" : "Vendeur non certifié"}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
