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

    // ================= VALIDATION =================
    const requiredFields = [
      "nom",
      "description",
      "categorie",
      "prixInitial",
      "prixActuel",
      "enPromotion",
      "etat",
      "origine",
      "paysOrigine",
      "stock",
      "delaiLivraison",
    ];

    const emptyFields = requiredFields.filter((field) => !form[field]);
    if (emptyFields.length > 0) {
      const fieldNames = emptyFields
        .map((f) => {
          switch (f) {
            case "nom":
              return "Nom du produit";
            case "description":
              return "Description";
            case "categorie":
              return "Catégorie";
            case "prixInitial":
              return "Prix initial";
            case "prixActuel":
              return "Prix actuel";
            case "enPromotion":
              return "En promotion";
            case "etat":
              return "État";
            case "origine":
              return "Origine";
            case "paysOrigine":
              return "Pays d’origine";
            case "stock":
              return "Stock";
            case "delaiLivraison":
              return "Délai de livraison";
            default:
              return f;
          }
        })
        .join(", ");
      return alert(`Veuillez remplir les champs suivants : ${fieldNames}`);
    }

    if (images.length < 4 || images.length > 6) {
      return alert("4 à 6 images obligatoires");
    }

    // ================= SUBMIT =================
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

          <div>
            <label className="block font-medium mb-1">Nom du produit</label>
            <input
              name="nom"
              value={form.nom}
              onChange={handleChange}
              placeholder="Nom du produit"
              className="w-full p-3 border rounded"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Description détaillée</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Description du produit"
              className="w-full p-3 border rounded"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Catégorie</label>
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
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-1">Prix initial (FCFA)</label>
              <input
                type="number"
                name="prixInitial"
                value={form.prixInitial}
                onChange={handleChange}
                className="w-full p-3 border rounded"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Prix actuel (FCFA)</label>
              <input
                type="number"
                name="prixActuel"
                value={form.prixActuel}
                onChange={handleChange}
                className="w-full p-3 border rounded"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block font-medium mb-1">En promotion ?</label>
              <select
                name="enPromotion"
                value={form.enPromotion}
                onChange={handleChange}
                className="w-full p-3 border rounded"
              >
                <option value="">Choisir</option>
                <option>Oui</option>
                <option>Non</option>
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">État</label>
              <select
                name="etat"
                value={form.etat}
                onChange={handleChange}
                className="w-full p-3 border rounded"
              >
                <option value="">Sélectionner</option>
                <option>Neuf</option>
                <option>Occasion</option>
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Origine</label>
              <select
                name="origine"
                value={form.origine}
                onChange={handleChange}
                className="w-full p-3 border rounded"
              >
                <option value="">Sélectionner</option>
                <option>Local</option>
                <option>Vient de l’étranger</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Pays d’origine</label>
            <input
              name="paysOrigine"
              value={form.paysOrigine}
              onChange={handleChange}
              placeholder="Pays d’origine"
              className="w-full p-3 border rounded"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-1">Stock disponible</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                className="w-full p-3 border rounded"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Délai de livraison</label>
              <input
                name="delaiLivraison"
                value={form.delaiLivraison}
                onChange={handleChange}
                placeholder="Temps de livraison"
                className="w-full p-3 border rounded"
              />
            </div>
          </div>
        </section>

        {/* ================= IMAGES ================= */}
        <section className="space-y-4 border p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold">Photos du produit (4 à 6)</h2>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImages}
            className="mb-4 w-full"
          />

          {previews.length > 0 ? (
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-shrink-0 w-full md:w-2/3">
                <img
                  src={previews[0]}
                  alt="Image principale"
                  className="w-full h-64 md:h-80 object-cover rounded-lg border"
                />
              </div>
              <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible md:w-1/3">
                {previews.map((src, index) => {
                  if (index === 0) return null;
                  return (
                    <div key={index} className="relative flex-shrink-0">
                      <img
                        src={src}
                        alt={`preview-${index}`}
                        className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg border cursor-pointer"
                        onClick={() => {
                          const newPreviews = [...previews];
                          [newPreviews[0], newPreviews[index]] = [newPreviews[index], newPreviews[0]];
                          setPreviews(newPreviews);

                          const newImages = [...images];
                          [newImages[0], newImages[index]] = [newImages[index], newImages[0]];
                          setImages(newImages);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 md:h-32 bg-gray-200 animate-pulse rounded-lg" />
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
            {loading ? (
              <span className="animate-pulse">Publication...</span>
            ) : (
              "Publier une annonce"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PublierProduit;
