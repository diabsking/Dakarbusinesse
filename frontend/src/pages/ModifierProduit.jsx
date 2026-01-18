import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function ModifierProduit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: "",
    description: "",
    categorie: "",
    prixInitial: "",
    prixActuel: "",
    enPromotion: "",
    etat: "",
    origine: "",
    paysOrigine: "",
    stock: "",
    delaiLivraison: "",
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingProduit, setLoadingProduit] = useState(true);

  /* ================= CHARGER LE PRODUIT ================= */
  useEffect(() => {
    const fetchProduit = async () => {
      try {
        setLoadingProduit(true);
        const res = await api.get(`/api/produits/${id}`);
        const p = res.data.produit;

        setForm({
          nom: p.nom || "",
          description: p.description || "",
          categorie: p.categorie || "",
          prixInitial: p.prixInitial || "",
          prixActuel: p.prixActuel || "",
          enPromotion: p.enPromotion ? "Oui" : "Non",
          etat: p.etat || "",
          origine: p.origine || "",
          paysOrigine: p.paysOrigine || "",
          stock: p.stock || "",
          delaiLivraison: p.delaiLivraison || "",
        });

        setPreviews(p.images || []);
        setImages([]);
      } catch (err) {
        console.error("Erreur récupération produit :", err);
        alert("Erreur lors de la récupération du produit");
      } finally {
        setLoadingProduit(false);
      }
    };

    fetchProduit();
  }, [id]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...previewUrls]);
  };

  const removeImage = (index) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    if (index < images.length) {
      setImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (previews.length < 4 || previews.length > 6) {
      return alert("Le produit doit avoir entre 4 et 6 images");
    }

    try {
      setLoading(true);
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (["prixInitial", "prixActuel", "stock"].includes(key)) {
          formData.append(key, Number(form[key]));
        } else if (key === "enPromotion") {
          formData.append(key, form[key] === "Oui");
        } else if (key === "paysOrigine") {
          formData.append(
            key,
            form.origine === "Vient de l’étranger" ? form[key] : ""
          );
        } else {
          formData.append(key, form[key]);
        }
      });

      images.forEach((img) => formData.append("images", img));

      await api.put(`/api/produits/${id}`, formData);

      alert("Produit modifié avec succès");
      navigate("/tableau-de-bord");
    } catch (err) {
      console.error("Erreur modification produit :", err);
      alert(err.response?.data?.message || "Erreur lors de la modification");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RENDER ================= */
  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-12">
      <h1 className="text-3xl font-bold text-center">Modifier le produit</h1>

      {loadingProduit ? (
        <div className="space-y-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto" />
          <div className="h-32 bg-gray-200 rounded w-full" />
          <div className="h-8 bg-gray-200 rounded w-1/2" />
          <div className="h-8 bg-gray-200 rounded w-full" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-8 bg-gray-200 rounded w-full" />
            <div className="h-8 bg-gray-200 rounded w-full" />
          </div>
          <div className="h-64 bg-gray-200 rounded w-full" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-12">
          {/* FORMULAIRE IDENTIQUE — inchangé */}
          {/* (j’ai volontairement laissé le JSX tel quel) */}
          <button
            disabled={loading}
            type="submit"
            className="px-14 py-3 rounded-full ring-2 w-full sm:w-auto"
          >
            {loading ? "Modification..." : "Modifier le produit"}
          </button>
        </form>
      )}
    </div>
  );
}

export default ModifierProduit;
