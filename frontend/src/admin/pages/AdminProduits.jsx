import { useEffect, useState } from "react";
import {
  listerProduits,
  suspendreProduit,
} from "../services/admin.api";

const PRODUCT_PLACEHOLDER = "/placeholder.png";
const SHOP_PLACEHOLDER = "/shop-placeholder.png";

/* =========================
   MINI CARROUSEL HORIZONTAL
========================= */
function ProductCarousel({ images, nom }) {
  const safeImages =
    images.length >= 4
      ? images.slice(0, 6)
      : [...images, ...Array(4 - images.length).fill(PRODUCT_PLACEHOLDER)];

  const [index, setIndex] = useState(0);

  return (
    <div className="flex flex-col gap-2">
      <img
        src={safeImages[index]}
        alt={nom}
        className="w-24 h-24 object-cover rounded border"
      />

      <div className="flex gap-1">
        {safeImages.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={nom}
            onClick={() => setIndex(i)}
            className={`w-10 h-10 object-cover rounded border cursor-pointer ${
              i === index ? "ring-2 ring-blue-500" : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function AdminProduits() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);

  // RECHERCHE
  const [searchTerm, setSearchTerm] = useState("");

  // MODAL
  const [showModal, setShowModal] = useState(false);
  const [produitASupprimer, setProduitASupprimer] = useState(null);

  /* =========================
     LOAD PRODUITS
  ========================= */
  const loadProduits = async () => {
    try {
      const res = await listerProduits();
      setProduits(res.data.data || []);
    } catch (err) {
      console.error("❌ Erreur chargement produits", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduits();
  }, []);

  if (loading) return <p>Chargement des produits...</p>;

  // =========================
  // FILTRAGE PRODUITS
  // =========================
  const filteredProduits = produits.filter((p) => {
    const vendeur = p.vendeur && typeof p.vendeur === "object" ? p.vendeur : {};
    const nomVendeur = vendeur.nomBoutique || vendeur.nomVendeur || "";
    const emailVendeur = vendeur.email || "";
    const telVendeur = vendeur.telephone || vendeur.phone || vendeur.tel || "";

    const term = searchTerm.toLowerCase();

    return (
      p._id.toLowerCase().includes(term) ||
      p.nom.toLowerCase().includes(term) ||
      nomVendeur.toLowerCase().includes(term) ||
      emailVendeur.toLowerCase().includes(term) ||
      telVendeur.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      {/* =========================
         HEADER + COMPTEUR + RECHERCHE
      ========================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold">Produits</h2>

        <div className="flex items-center gap-4">
          <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold">
            🧮 {produits.length} produit(s)
          </div>

          <input
            type="text"
            placeholder="Recherche par ID, nom, mail ou téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-lg w-full md:w-80"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Produit</th>
              <th className="p-3">Vendeur</th>
              <th className="p-3">Prix</th>
              <th className="p-3">Statut</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProduits.map((p) => {
              const vendeur = p.vendeur && typeof p.vendeur === "object" ? p.vendeur : null;
              const nomVendeur = vendeur?.nomBoutique || vendeur?.nomVendeur || "Vendeur";
              const avatarVendeur = vendeur?.avatar || SHOP_PLACEHOLDER;
              const telephoneVendeur = vendeur?.telephone || vendeur?.phone || vendeur?.tel || "—";
              const emailVendeur = vendeur?.email || "—";
              const images = Array.isArray(p.images) && p.images.length > 0
                ? p.images
                : p.image
                ? [p.image]
                : [PRODUCT_PLACEHOLDER];

              return (
                <tr key={p._id} className="border-t align-top">
                  {/* PRODUIT */}
                  <td className="p-3">
                    <div className="flex gap-4">
                      <ProductCarousel images={images} nom={p.nom} />
                      <div>
                        <p className="font-medium">{p.nom}</p>
                        <p className="text-xs text-gray-500">ID: {p._id.slice(-6)}</p>
                      </div>
                    </div>
                  </td>

                  {/* VENDEUR */}
                  <td className="p-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={avatarVendeur}
                        alt={nomVendeur}
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                      <div className="text-sm">
                        <p className="font-semibold">{nomVendeur}</p>
                        <p className="text-gray-600">📧 {emailVendeur}</p>
                        <p className="text-gray-500">📞 {telephoneVendeur}</p>
                      </div>
                    </div>
                  </td>

                  {/* PRIX */}
                  <td className="p-3 font-semibold">{p.prixActuel} FCFA</td>

                  {/* STATUT */}
                  <td className="p-3">{p.valide ? "✅ Validé" : "⏳ En attente"}</td>

                  {/* ACTIONS */}
                  <td className="p-3">
                    <button
                      onClick={() => {
                        setProduitASupprimer(p);
                        setShowModal(true);
                      }}
                      className="px-3 py-1 bg-red-200 rounded hover:bg-red-300"
                    >
                      Suspendre
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredProduits.length === 0 && (
          <p className="p-6 text-center text-gray-500">Aucun produit trouvé</p>
        )}
      </div>

      {/* MODAL CONFIRMATION */}
      {showModal && produitASupprimer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-red-600">
              ⚠️ Confirmation requise
            </h3>
            <p className="mb-4">
              Es-tu sûr de vouloir <strong>supprimer définitivement</strong> le produit :
            </p>
            <p className="font-semibold mb-6">🛒 {produitASupprimer.nom}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setProduitASupprimer(null);
                }}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Annuler
              </button>
              <button
                onClick={async () => {
                  try {
                    await suspendreProduit(produitASupprimer._id);
                    await loadProduits();
                  } catch (err) {
                    console.error("❌ Erreur suppression produit", err);
                  } finally {
                    setShowModal(false);
                    setProduitASupprimer(null);
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Oui, supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
