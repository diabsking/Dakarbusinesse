import React, { useEffect, useState } from "react";
import axios from "axios";
import { usePanier } from "../context/PanierContext";

export default function Panier() {
  const { panier, modifierQuantite, supprimerDuPanier, viderPanier } = usePanier();

  /* =========================
     STATE
  ========================== */
  const [form, setForm] = useState({ nom: "", telephone: "", adresse: "", email: "" });
  const [produitsSimilaires, setProduitsSimilaires] = useState([]);
  const [loadingCommande, setLoadingCommande] = useState(false);
  const [loadingPanier, setLoadingPanier] = useState(true); // pour skeleton panier

  useEffect(() => {
    // Simuler chargement panier pour skeleton
    const timer = setTimeout(() => setLoadingPanier(false), 500); 
    return () => clearTimeout(timer);
  }, []);

  /* =========================
     HELPERS
  ========================== */
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const totalPanier = panier.reduce(
    (total, p) => total + (p.prix || 0) * (p.quantite || 1),
    0
  );

  /* =========================
     PASSER COMMANDE
  ========================== */
  const passerCommande = async (e) => {
    e.preventDefault();
    if (loadingCommande) return;

    if (!form.nom || !form.telephone || !form.adresse) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (panier.length === 0) {
      alert("Votre panier est vide");
      return;
    }

    setLoadingCommande(true);
    try {
      const vendeurs = Object.values(
        panier.reduce((acc, p) => {
          const idV = p.idVendeur || "vendeur_default";
          if (!acc[idV]) acc[idV] = { idVendeur: idV, nomVendeur: p.nomVendeur, telephoneVendeur: p.telephoneVendeur, produits: [] };
          acc[idV].produits.push({ produitId: p.id, nom: p.nom, prix: p.prix, quantite: p.quantite || 1, image: p.image });
          return acc;
        }, {})
      );

      const payload = {
        clientNom: form.nom,
        clientTelephone: form.telephone,
        clientAdresse: form.adresse,
        clientEmail: form.email,
        vendeurs,
      };

      await axios.post("http://localhost:5000/api/commandes", payload, { headers: { "Content-Type": "application/json" } });
      alert("✅ Commande envoyée avec succès");
      viderPanier();
      setForm({ nom: "", telephone: "", adresse: "", email: "" });
    } catch (error) {
      console.error("❌ Erreur commande :", error);
      alert(error.response?.data?.message || "Erreur lors de l'envoi de la commande");
    } finally {
      setLoadingCommande(false);
    }
  };

  /* =========================
     PANIER VIDE
  ========================== */
  if (!loadingPanier && panier.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Votre panier est vide.
      </div>
    );
  }

  /* =========================
     SKELETON ITEM PANIER
  ========================== */
  const renderSkeletonPanier = () => (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 border-b pb-4 animate-pulse">
          <div className="w-20 h-20 bg-gray-200 rounded" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-3 w-20 bg-gray-200 rounded" />
            <div className="h-3 w-24 bg-gray-200 rounded" />
          </div>
          <div className="h-4 w-16 bg-gray-200 rounded" />
        </div>
      ))}
      <div className="h-6 w-40 bg-gray-200 rounded ml-auto animate-pulse" />
    </div>
  );

  /* =========================
     RENDER
  ========================== */
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="flex flex-col lg:flex-row gap-6">

        {/* ===== PANIER ===== */}
        <div className="flex-1 bg-white p-4 rounded-lg shadow">
          {loadingPanier ? renderSkeletonPanier() : panier.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b pb-4 mb-4">
              <img
                src={item.image || "/placeholder.png"}
                alt={item.nom}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1 space-y-1 w-full">
                <p className="font-medium">{item.nom}</p>
                <p className="text-gray-500">{(item.prix || 0).toLocaleString()} FCFA</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                  <input
                    type="number"
                    min="1"
                    value={item.quantite || 1}
                    onChange={(e) => modifierQuantite(item.id, Number(e.target.value))}
                    className="w-16 border-b outline-none"
                  />
                  <button
                    onClick={() => supprimerDuPanier(item.id)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
              <p className="font-semibold mt-2 sm:mt-0">
                {(item.prix * item.quantite).toLocaleString()} FCFA
              </p>
            </div>
          ))}
          {!loadingPanier && (
            <div className="text-right text-xl font-bold">
              Total : {totalPanier.toLocaleString()} FCFA
            </div>
          )}
        </div>

        {/* ===== FORMULAIRE CLIENT ===== */}
        <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow mt-6 lg:mt-0">
          {loadingPanier ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-6 w-32 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-16 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-200 rounded" />
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4">Informations client</h2>
              <input type="text" name="nom" placeholder="Nom complet" value={form.nom} onChange={handleChange} className="w-full border-b py-2 mb-4 outline-none" />
              <input type="tel" name="telephone" placeholder="Téléphone" value={form.telephone} onChange={handleChange} className="w-full border-b py-2 mb-4 outline-none" />
              <textarea name="adresse" placeholder="Adresse de livraison" rows="3" value={form.adresse} onChange={handleChange} className="w-full border-b py-2 mb-4 outline-none" />
              <input type="email" name="email" placeholder="Email (optionnel)" value={form.email} onChange={handleChange} className="w-full border-b py-2 mb-6 outline-none" />
              <button
                onClick={passerCommande}
                disabled={loadingCommande}
                className={`w-full py-3 rounded-full font-bold transition ${
                  loadingCommande ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {loadingCommande ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Envoi en cours...
                  </span>
                ) : (
                  "Passer la commande"
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
