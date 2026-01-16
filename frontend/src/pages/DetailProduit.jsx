import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../services/api";
import { usePanier } from "../context/PanierContext";

// Composants
import DetailProduitLayout from "../components/DetailProduit/DetailProduitLayout";
import ProduitSection from "../components/DetailProduit/ProduitSection";
import SimilairesSection from "../components/DetailProduit/SimilairesSection";

const PLACEHOLDER = "/placeholder.png";

export default function DetailProduit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { ajouterAuPanier } = usePanier();

  const [produit, setProduit] = useState(null);
  const [vendeur, setVendeur] = useState(null);
  const [similaires, setSimilaires] = useState([]);
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH PRODUIT ================= */
  useEffect(() => {
    const fetchProduit = async () => {
      try {
        const res = await api.get(`/api/produits/${id}`);
        setProduit(res.data?.produit || res.data);
      } catch (err) {
        console.error("Erreur produit :", err);
        setProduit(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduit();
  }, [id]);

  /* ================= FETCH VENDEUR ================= */
  useEffect(() => {
    if (!produit?.vendeur) return;

    // vendeur déjà populate
    if (typeof produit.vendeur === "object") {
      setVendeur(produit.vendeur);
      return;
    }

    const fetchVendeur = async () => {
      try {
       const res = await api.get(`/api/vendeur/${produit.vendeur}`);
        setVendeur(res.data);
      } catch (err) {
        console.error("Erreur vendeur :", err);
        setVendeur(null);
      }
    };

    fetchVendeur();
  }, [produit]);

  /* ================= FETCH SIMILAIRES ================= */
  useEffect(() => {
    const fetchSimilaires = async () => {
      try {
       const res = await api.get(`/api/produits/similaires/${id}`);
        setSimilaires(res.data?.produits || []);
      } catch (err) {
        console.error("Erreur similaires :", err);
        setSimilaires([]);
      }
    };

    fetchSimilaires();
  }, [id]);

  /* ================= FETCH AVIS ================= */
  useEffect(() => {
    const fetchAvis = async () => {
      try {
       const res = await api.get(`/api/avis/produit/${id}`);
        setAvis(res.data || []);
      } catch (err) {
        console.error("Erreur avis :", err);
        setAvis([]);
      }
    };

    fetchAvis();
  }, [id]);

  /* ================= ACTION PANIER ================= */
  const handleAddPanier = () => {
    if (!produit) return;

    const v = vendeur || {};

    ajouterAuPanier({
      id: produit._id,
      nom: produit.nom,
      prix: produit.prixActuel ?? produit.prix ?? 0,
      image: produit.images?.[0] || PLACEHOLDER,

      idVendeur: v._id,
      nomVendeur: v.nomBoutique || "Vendeur",
      quantite: 1,
    });

    navigate("/Panier");
  };

  return (
    <DetailProduitLayout loading={loading} produit={produit}>
      <ProduitSection
        produit={produit}
        avis={avis}
        onAddPanier={handleAddPanier}
        onVoirVendeur={() =>
          vendeur?._id && navigate(`/vendeur/${vendeur._id}`)
        }
        onAvisAjoute={(a) => setAvis([a, ...avis])}
      />

      {/* ❌ PROFIL VENDEUR SUPPRIMÉ ICI */}

      <SimilairesSection produits={similaires} />
    </DetailProduitLayout>
  );
}
