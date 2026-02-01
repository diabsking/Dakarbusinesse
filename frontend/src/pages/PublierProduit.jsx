import { useState } from "react";
import api from "../services/api";

function PublierProduit() {
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

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 6) {
      alert("Maximum 6 photos autorisées");
      return;
    }

    setImages((prev) => [...prev, ...files]);
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...previewUrls]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ 1 à 6 photos obligatoires
    if (images.length < 1 || images.length > 6) {
      return alert("Veuillez ajouter entre 1 et 6 photos");
    }

    try {
      setLoading(true);
      const formData = new FormData();
      Object.keys(form).forEach((key) => formData.append(key, form[key]));
      images.forEach((img) => formData.append("images", img));

      await api.post("/api/produits", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Produit publié avec succès");

      setForm({
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

      setImages([]);
      setPreviews([]);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la publication");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RENDER ================= */
  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-12">
      <h1 className="text-3xl font-bold text-center">Publier une annonce</h1>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* ================= PRODUIT ================= */}
        <section className="space-y-6 border p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold">Informations du produit</h2>

          <input
            name="nom"
            value={form.nom}
            onChange={handleChange}
            placeholder="Nom du produit"
            className="w-full p-3 border rounded"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Description du produit"
            className="w-full p-3 border rounded"
          />

          <select
            name="categorie"
            value={form.categorie}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          >
            <option value="">Sélectionner la catégorie</option>
            <option>Électronique</option>
            <option>Mode & Vêtements</option>
            <option>Maison</option>
            <option>Beauté</option>
            <option>Alimentation</option>
            <option>Autres</option>
            <option>Électroménager</option>
            <option>Téléphones & Accessoires</option>
            <option>Informatique</option>
            <option>Sport & Loisirs</option>
            <option>Bébé & Enfants</option>
            <option>Santé</option>
            <option>Automobile</option>
            <option>Services</option>
          </select>

          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="number"
              name="prixInitial"
              value={form.prixInitial}
              onChange={handleChange}
              placeholder="Prix initial (FCFA)"
              className="w-full p-3 border rounded"
            />
            <input
              type="number"
              name="prixActuel"
              value={form.prixActuel}
              onChange={handleChange}
              placeholder="Prix actuel (FCFA)"
              className="w-full p-3 border rounded"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <select
              name="enPromotion"
              value={form.enPromotion}
              onChange={handleChange}
              className="w-full p-3 border rounded"
            >
              <option value="">En promotion ?</option>
              <option>Oui</option>
              <option>Non</option>
            </select>

            <select
              name="etat"
              value={form.etat}
              onChange={handleChange}
              className="w-full p-3 border rounded"
            >
              <option value="">État</option>
              <option>Neuf</option>
              <option>Occasion</option>
            </select>

            <select
              name="origine"
              value={form.origine}
              onChange={handleChange}
              className="w-full p-3 border rounded"
            >
              <option value="">Origine</option>
              <option>Local</option>
              <option>Vient de l’étranger</option>
            </select>
          </div>

          <input
            name="paysOrigine"
            value={form.paysOrigine}
            onChange={handleChange}
            placeholder="Pays d’origine"
            className="w-full p-3 border rounded"
          />

          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="Stock disponible"
              className="w-full p-3 border rounded"
            />
            <input
              name="delaiLivraison"
              value={form.delaiLivraison}
              onChange={handleChange}
              placeholder="Délai de livraison"
              className="w-full p-3 border rounded"
            />
          </div>
        </section>

        {/* ================= IMAGES ================= */}
        <section className="space-y-4 border p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold">
            Photos du produit (1 à 6)
          </h2>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImages}
            className="w-full"
          />

          <p className="text-sm text-gray-500">
            {images.length} / 6 photos sélectionnées
          </p>

          {previews.length > 0 && (
            <div className="flex gap-3 flex-wrap">
              {previews.map((src, index) => (
                <div key={index} className="relative">
                  <img
                    src={src}
                    alt={`preview-${index}`}
                    className="w-24 h-24 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ================= SUBMIT ================= */}
        <div className="text-center">
          <button
            disabled={loading}
            type="submit"
            className="px-14 py-3 rounded-full ring-2 w-full sm:w-auto"
          >
            {loading ? "Publication..." : "Publier une annonce"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PublierProduit;
