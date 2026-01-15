import { useState, useEffect, useRef } from "react";
import { FiSearch, FiX, FiClock, FiTrash2 } from "react-icons/fi";
import axios from "axios";

export default function SearchBar({ recherche = "", setRecherche }) {
  const [value, setValue] = useState(recherche);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const debounceRef = useRef(null);

  /* 🔄 Sync parent */
  useEffect(() => {
    setValue(recherche);
  }, [recherche]);

  /* 📦 Load history */
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("searchHistory")) || [];
      setHistory(Array.isArray(saved) ? saved : []);
    } catch {
      setHistory([]);
    }
  }, []);

  /* ⏳ Debounce + API */
  useEffect(() => {
    if (!value.trim()) return;

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        await axios.get(
          `/api/produits/search?q=${encodeURIComponent(value)}`
        );
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(debounceRef.current);
  }, [value]);

  const launchSearch = (term) => {
    const clean = term.trim();
    if (!clean) return;

    setRecherche(clean);

    const updated = [clean, ...history.filter((h) => h !== clean)].slice(0, 5);
    setHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  const clearSearch = () => {
    setValue("");
    setRecherche("");
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("searchHistory");
  };

  return (
    <div className="bg-white px-4 py-4">
      {/* IMPORTANT : largeur FIXE ICI */}
      <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        className="
          flex items-center
          w-[240px] min-w-[240px] max-w-[240px]
          mx-auto
          rounded-2xl
          bg-gray-100
          border border-gray-200
          shadow-sm
        "
      >
        <input
          type="search"
          placeholder="Rechercher…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="
            flex-1
            px-4 py-2
            bg-gray-100
            text-gray-800
            placeholder-gray-400
            outline-none
          "
        />

        {value && (
          <button
            type="button"
            onClick={clearSearch}
            className="px-2 text-gray-400 hover:text-gray-600"
          >
            <FiX />
          </button>
        )}

        <button
          type="button"
          onClick={() => launchSearch(value)}
          disabled={!value.trim()}
          className="px-3 text-gray-500 hover:text-gray-700"
        >
          <FiSearch />
        </button>
      </form>

      {/* HISTORIQUE */}
      {history.length > 0 && !value && (
        <div className="relative w-[240px] mx-auto mt-2 bg-white rounded-2xl shadow-md border border-gray-200">
          <div className="flex justify-between px-4 py-2 text-sm text-gray-500">
            <span>Recherches récentes</span>
            <button
              onClick={clearHistory}
              className="flex items-center gap-1 text-red-500"
            >
              <FiTrash2 /> Tout supprimer
            </button>
          </div>

          {history.map((item) => (
            <div
              key={item}
              className="flex justify-between px-4 py-3 hover:bg-gray-50"
            >
              <button
                onClick={() => launchSearch(item)}
                className="flex items-center gap-2 text-gray-700"
              >
                <FiClock /> {item}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
