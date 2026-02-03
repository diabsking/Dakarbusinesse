import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ProductCard from "../components/Produit/ProductCard";
import ProductStory from "../components/Produit/ProductStory";
import useProduitFilter from "../components/Produit/useProduitFilter";
import api from "../services/api";

const ITEMS_PER_BATCH = 10;
const MIN_PRODUITS = 40;

/* ======================
   Produits fictifs par catégorie
====================== */
const sampleProductsByCategory = {
  Mode: [
    { nom: "Montre bracelet noir", image: "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg" },
    { nom: "Sac à dos urbain", image: "https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg" },
    { nom: "Sneakers blanches", image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg" },
    { nom: "Lunettes de soleil", image: "https://images.pexels.com/photos/46710/pexels-photo-46710.jpeg" },
    { nom: "Sac à main fashion", image: "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg" },
    { nom: "Casquette stylée", image: "https://images.pexels.com/photos/9945173/pexels-photo-9945173.jpeg" },
    { nom: "Veste en jean", image: "https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg" },
    { nom: "Tee-shirt casual", image: "https://images.pexels.com/photos/1002643/pexels-photo-1002643.jpeg" },
    { nom: "Jeans slim", image: "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg" },
    { nom: "Chaussures de ville", image: "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg" },
  ],
  Electronique: [
    { nom: "Smartphone dernier modèle", image: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg" },
    { nom: "Tablette tactile", image: "https://images.pexels.com/photos/5082573/pexels-photo-5082573.jpeg" },
    { nom: "Casque audio pro", image: "https://images.pexels.com/photos/159853/headphones-audio-music-sound-159853.jpeg" },
    { nom: "Ordinateur portable", image: "https://images.pexels.com/photos/18105/pexels-photo.jpg" },
    { nom: "Clavier mécanique", image: "https://images.pexels.com/photos/210647/pexels-photo-210647.jpeg" },
    { nom: "Souris gaming", image: "https://images.pexels.com/photos/41171/pexels-photo-41171.jpeg" },
    { nom: "Écouteurs sans fil", image: "https://images.pexels.com/photos/3394669/pexels-photo-3394669.jpeg" },
    { nom: "Lunettes VR", image: "https://images.pexels.com/photos/3409244/pexels-photo-3409244.jpeg" },
    { nom: "Chargeur sans fil", image: "https://images.pexels.com/photos/3945660/pexels-photo-3945660.jpeg" },
    { nom: "Clé USB 128Go", image: "https://images.pexels.com/photos/1591060/pexels-photo-1591060.jpeg" },
  ],
  MaisonLifestyle: [
    { nom: "Lampe de bureau", image: "https://images.pexels.com/photos/112811/pexels-photo-112811.jpeg" },
    { nom: "Chaise scandinave", image: "https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg" },
    { nom: "Bouteille design", image: "https://images.pexels.com/photos/145784/pexels-photo-145784.jpeg" },
    { nom: "Bougie parfumée", image: "https://images.pexels.com/photos/1420700/pexels-photo-1420700.jpeg" },
    { nom: "Tasse en céramique", image: "https://images.pexels.com/photos/414645/pexels-photo-414645.jpeg" },
    { nom: "Couteau de cuisine", image: "https://images.pexels.com/photos/162449/knife-kitchen-cutlery-162449.jpeg" },
    { nom: "Tapis moderne", image: "https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg" },
    { nom: "Coussin décoratif", image: "https://images.pexels.com/photos/271795/pexels-photo-271795.jpeg" },
    { nom: "Appareil photo vintage", image: "https://images.pexels.com/photos/212372/pexels-photo-212372.jpeg" },
    { nom: "Jeu de société", image: "https://images.pexels.com/photos/33045/pexels-photo-33045.jpeg" },
  ],
};

/* ======================
   Générateur produits fictifs
====================== */
const generateMockProduits = (count) => {
  const categories = Object.keys(sampleProductsByCategory);
  return Array.from({ length: count }).map((_, i) => {
    const category = categories[i % categories.length];
    const sampleList = sampleProductsByCategory[category];
    const sample = sampleList[i % sampleList.length];

    return {
      _id: `mock-${i}`,
      nom: sample.nom,
      prix: Math.floor(Math.random() * 50000) + 5000,
      description: "Produit de démonstration. Publiez vos articles pour apparaître ici.",
      images: [sample.image],
      categorie: category,
      actif: true,
      estBooster: false,
      isMock: true,
      stock: 10,
      vendeur: null,
    };
  });
};

export default function Produit() {
  const { nom } = useParams();
  const categorieActive = nom ? decodeURIComponent(nom) : "Tous";

  const [searchParams] = useSearchParams();
  const recherche = searchParams.get("q") || "";

  const [loading, setLoading] = useState(true);
  const [produits, setProduits] = useState([]);

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_BATCH);
  const observerRef = useRef(null);

  const [prixMax] = useState(1000000);
  const [filtreSpecial] = useState(null);

  /* =====================================================
     📥 FETCH + AJOUT MOCK SI < 40 (UNE SEULE FOIS)
  ===================================================== */
  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const res = await api.get("/api/produits");

        const produitsActifs = (res.data.produits || []).filter(
          (p) => p.actif === true
        );

        let produitsFinaux = [...produitsActifs];

        if (produitsActifs.length < MIN_PRODUITS) {
          const manque = MIN_PRODUITS - produitsActifs.length;
          produitsFinaux = [
            ...produitsActifs,
            ...generateMockProduits(manque),
          ];
        }

        // TRI EXISTANT
        const produitsTries = [...produitsFinaux].sort((a, b) => {
          if (a.estBooster && !b.estBooster) return -1;
          if (!a.estBooster && b.estBooster) return 1;

          const certA = a.vendeur?.certifie ? 1 : 0;
          const certB = b.vendeur?.certifie ? 1 : 0;
          if (certA !== certB) return certB - certA;

          const dateA = a.dateDebutBoost
            ? new Date(a.dateDebutBoost).getTime()
            : 0;
          const dateB = b.dateDebutBoost
            ? new Date(b.dateDebutBoost).getTime()
            : 0;

          return dateB - dateA;
        });

        setProduits(produitsTries);
      } catch (err) {
        console.error("❌ Erreur récupération produits :", err);
        setProduits([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProduits();
  }, []);

  /* =====================================================
     🔍 FILTRES
  ===================================================== */
  const produitsFiltres = useProduitFilter({
    produits,
    categorieActive,
    recherche,
    prixMax,
    filtreSpecial,
  });

  useEffect(() => {
    setVisibleCount(ITEMS_PER_BATCH);
  }, [categorieActive, recherche]);

  const produitsVisibles = produitsFiltres.slice(0, visibleCount);

  /* =====================================================
   🆕 NOUVEAUX PRODUITS (STORIES)
===================================================== */
  const nouveauxProduits = produits.filter((p) => {
    if (p.isMock) return true;
    if (!p.createdAt) return false;

    return (
      Date.now() - new Date(p.createdAt).getTime() <
      7 * 24 * 60 * 60 * 1000 // 7 jours
    );
  });

  /* =====================================================
     ♾️ INTERSECTION OBSERVER
  ===================================================== */
  const lastProductRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          visibleCount < produitsFiltres.length
        ) {
          setVisibleCount((prev) => prev + ITEMS_PER_BATCH);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, visibleCount, produitsFiltres.length]
  );

  /* =====================================================
     ⏳ SKELETON LOADER
  ===================================================== */
  if (loading) {
    return (
      <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-10">
        <div className="max-w-[1600px] mx-auto space-y-4 bg-white">
          <div className="h-8 w-1/3 bg-gray-300 rounded animate-pulse" />
          <div className="flex flex-col gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-gray-300 rounded-md animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================
     🧠 RENDER
  ===================================================== */
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1600px] mx-auto px-0 sm:px-6 lg:px-10 py-6 space-y-4 bg-white">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {categorieActive === "Tous" ? "Tous les produits" : categorieActive}
        </h1>

        {recherche && (
          <p className="text-gray-600">
            Résultat pour : <span className="font-medium">{recherche}</span>
          </p>
        )}

        {/* ✅ ProductStory au-dessus de tout */}
        {nouveauxProduits.length > 0 && (
          <ProductStory produits={nouveauxProduits} />
        )}

        {produitsFiltres.length === 0 ? (
          <div className="text-center text-gray-600 mt-20">
            Aucun produit trouvé.
          </div>
        ) : (
          <div className="overflow-y-auto">
            <div
              className="
                flex flex-col gap-4
                sm:grid sm:grid-cols-2
                md:grid-cols-3
                lg:grid-cols-5
                sm:gap-3
              "
            >
              {produitsVisibles.map((produit, index) => {
                if (index === produitsVisibles.length - 1) {
                  return (
                    <div ref={lastProductRef} key={produit._id}>
                      <ProductCard produit={produit} fullWidthMobile />
                    </div>
                  );
                }

                return <ProductCard key={produit._id} produit={produit} fullWidthMobile />;
              })}
            </div>

            {visibleCount < produitsFiltres.length && (
              <div className="text-center text-gray-500 py-6">Chargement…</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
