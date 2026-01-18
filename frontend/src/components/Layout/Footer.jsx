import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiMail,
  FiPhone,
  FiShield,
} from "react-icons/fi";

export default function Footer() {
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ⚡ Connexion admin */
  const handleLogin = async () => {
    if (!password) {
      setError("Veuillez entrer un mot de passe");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message || "Mot de passe incorrect");

      localStorage.setItem("adminToken", data.token);
      setShowModal(false);
      setPassword("");
      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError(err.message || "Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setPassword("");
    setError("");
  };

  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">

      {/* 🔝 TOP (caché sur mobile) */}
      <div className="hidden sm:grid max-w-7xl mx-auto px-4 sm:px-6 py-10 grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

        {/* BRAND */}
        <div className="text-center sm:text-left">
          <h3 className="text-white text-2xl font-bold mb-3">Dakar Businesse</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Marketplace locale simple et sécurisée pour acheter et vendre
            au Sénégal.
          </p>

          <div className="flex justify-center sm:justify-start gap-5 mt-5">
            <a aria-label="Facebook" href="#" className="hover:text-white">
              <FiFacebook size={22} />
            </a>
            <a aria-label="Instagram" href="#" className="hover:text-white">
              <FiInstagram size={22} />
            </a>
            <a aria-label="Twitter" href="#" className="hover:text-white">
              <FiTwitter size={22} />
            </a>
          </div>
        </div>

        {/* NAVIGATION */}
        <FooterColumn title="Navigation">
          <FooterLink to="/">Accueil</FooterLink>
          <FooterLink to="/">Produits</FooterLink>
          <FooterLink to="/">Espace vendeur</FooterLink>
          <FooterLink to="/">Contact</FooterLink>
        </FooterColumn>

        {/* VENDEURS */}
        <FooterColumn title="Vendeurs">
          <FooterLink to="/">Devenir vendeur</FooterLink>
          <FooterLink to="/">Tarifs</FooterLink>
          <FooterLink to="/">Règles & conformité</FooterLink>
          <FooterLink to="/">FAQ vendeurs</FooterLink>
        </FooterColumn>

        {/* CONTACT */}
        <div className="text-center sm:text-left">
          <h4 className="text-white font-semibold mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex justify-center sm:justify-start items-center gap-2">
              <FiMail /> noreplaydakarbusiness@mailo.com.com
            </li>
            <li className="flex justify-center sm:justify-start items-center gap-2">
              <FiPhone /> +221 77 000 00 00
            </li>
            <li>📍 Sénégal</li>
          </ul>
        </div>
      </div>

      {/* 🔽 BOTTOM */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400 text-center sm:text-left">
          {/* Texte visible uniquement sur desktop */}
          <p className="hidden sm:block">
            © {new Date().getFullYear()} Dakarbusinesse. Tous droits réservés.
          </p>

          <div className="flex gap-4">
            <FooterLink to="/conditions">Conditions</FooterLink>
            <FooterLink to="/confidentialite">Confidentialité</FooterLink>
          </div>
        </div>

        {/* ADMIN */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-6 flex justify-center">
          <button
            onClick={() => setShowModal(true)}
            className="opacity-0 hover:opacity-100 transition w-8 h-8 text-gray-400"
            aria-label="Accès administrateur"
          >
            <FiShield size={14} />
          </button>
        </div>
      </div>

      {/* 🔒 MODAL ADMIN */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold mb-3">Accès Administrateur</h3>
            <p className="text-sm text-gray-600 mb-4">
              Entrez le mot de passe pour continuer.
            </p>

            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={handleLogin}
                disabled={loading}
                className={`px-4 py-2 rounded text-white ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Connexion..." : "Valider"}
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}

/* =============================
   SOUS-COMPONENTS
============================= */

const FooterColumn = ({ title, children }) => (
  <div className="text-center sm:text-left">
    <h4 className="text-white font-semibold mb-4">{title}</h4>
    <ul className="space-y-3 text-sm text-gray-400">{children}</ul>
  </div>
);

const FooterLink = ({ to, children }) => (
  <li>
    <Link to={to} className="hover:text-white transition-colors">
      {children}
    </Link>
  </li>
);
