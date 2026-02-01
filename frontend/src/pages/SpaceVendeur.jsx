import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import VerificationEmail from "./VerificationEmail";
import api from "../services/api";

/* =============================
   UTILITAIRE TELEPHONE (UNIQUE)
============================= */
const cleanTelephone = (tel) => {
  let cleaned = tel.trim();

  // Supprimer espaces, tirets, parenthèses
  cleaned = cleaned.replace(/[\s-()]/g, "");

  // Supprimer indicatifs Sénégal
  if (cleaned.startsWith("+221")) cleaned = cleaned.slice(4);
  if (cleaned.startsWith("00221")) cleaned = cleaned.slice(5);
  if (cleaned.startsWith("221")) cleaned = cleaned.slice(3);

  return cleaned;
};

/* =============================
   PAGE PRINCIPALE
============================= */
export default function SpaceVendeur() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [verificationPending, setVerificationPending] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200">
        {!verificationPending ? (
          <>
            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
              Espace Vendeur
            </h1>

            {/* SWITCH LOGIN / REGISTER */}
            <div className="flex mb-6 rounded-xl overflow-hidden border border-gray-300">
              <button
                onClick={() => setIsLogin(true)}
                className={`w-1/2 py-3 font-medium transition ${
                  isLogin
                    ? "bg-orange-600 text-white"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                Connexion
              </button>

              <button
                onClick={() => setIsLogin(false)}
                className={`w-1/2 py-3 font-medium transition ${
                  !isLogin
                    ? "bg-orange-600 text-white"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                Inscription
              </button>
            </div>

            {isLogin ? (
              <LoginForm />
            ) : (
              <RegisterForm
                setEmail={setEmail}
                setVerificationPending={setVerificationPending}
              />
            )}
          </>
        ) : (
          <VerificationEmail
            email={email}
            onVerifyEmail={() => setVerificationPending(false)}
          />
        )}
      </div>
    </div>
  );
}

/* =============================
   INPUT REUTILISABLE (PRO MOBILE)
============================= */
function Input({
  label,
  type = "text",
  error,
  required = false,
  ...props
}) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <input
        type={type}
        className={`w-full px-4 py-4 text-base border rounded-xl
        focus:outline-none focus:ring-2
        ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-orange-500"
        }`}
        {...props}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

/* =============================
   LOGIN (TELEPHONE)
============================= */
function LoginForm() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    telephone: localStorage.getItem("login_tel") || "",
    password: localStorage.getItem("login_pwd") || "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const autoSubmitted = useRef(false);

  useEffect(() => {
    if (data.telephone && data.password && !autoSubmitted.current) {
      autoSubmitted.current = true;
      handleSubmit();
    }
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (loading) return;

    if (!data.telephone || !data.password) {
      setError("Tous les champs sont obligatoires");
      return;
    }

    setError("");

    try {
      setLoading(true);

      const telephoneClean = cleanTelephone(data.telephone);

      const res = await api.post("/api/vendeur/auth/login", {
        telephone: telephoneClean,
        password: data.password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.removeItem("login_pwd");

      navigate("/tableau-de-bord");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Téléphone ou mot de passe incorrect"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Téléphone"
        required
        inputMode="tel"
        autoComplete="tel"
        placeholder="Ex : 0612345678"
        value={data.telephone}
        onChange={(e) => {
          setData({ ...data, telephone: e.target.value });
          localStorage.setItem("login_tel", e.target.value);
        }}
      />

      <Input
        label="Mot de passe"
        required
        type="password"
        autoComplete="current-password"
        value={data.password}
        onChange={(e) => {
          setData({ ...data, password: e.target.value });
          localStorage.setItem("login_pwd", e.target.value);
        }}
      />

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        disabled={loading}
        className="w-full py-4 bg-orange-600 text-black rounded-xl font-semibold
        active:scale-[0.98] disabled:opacity-60"
      >
        {loading ? "Connexion..." : "Connexion"}
      </button>

      <button
        type="button"
        onClick={() => navigate("/mot-de-passe-oublie")}
        className="w-full text-center text-sm text-blue-600"
      >
        Mot de passe oublié ?
      </button>
    </form>
  );
}

/* =============================
   INSCRIPTION (EMAIL + OTP)
============================= */
function RegisterForm({ setEmail, setVerificationPending }) {
  const [data, setData] = useState({
    nomVendeur: "",
    email: "",
    telephone: "",
    nomBoutique: "",
    typeBoutique: "En ligne",
    password: "",
    passwordConfirm: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!/\S+@\S+\.\S+/.test(data.email)) {
      setError("Adresse email invalide");
      return;
    }

    if (data.password !== data.passwordConfirm) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      setLoading(true);

      await api.post("/api/vendeur/auth/register", {
        ...data,
        telephone: cleanTelephone(data.telephone),
      });

      setEmail(data.email);
      setVerificationPending(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Erreur lors de l'inscription"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Nom du vendeur"
        required
        value={data.nomVendeur}
        onChange={(e) =>
          setData({ ...data, nomVendeur: e.target.value })
        }
      />

      <Input
        label="Adresse email"
        required
        type="email"
        autoComplete="email"
        value={data.email}
        onChange={(e) =>
          setData({ ...data, email: e.target.value })
        }
      />

      <Input
        label="Téléphone"
        required
        inputMode="tel"
        autoComplete="tel"
        value={data.telephone}
        onChange={(e) =>
          setData({ ...data, telephone: e.target.value })
        }
      />

      <Input
        label="Nom de la boutique"
        required
        value={data.nomBoutique}
        onChange={(e) =>
          setData({ ...data, nomBoutique: e.target.value })
        }
      />

      <select
        className="w-full px-4 py-4 border border-gray-300 rounded-xl text-base"
        value={data.typeBoutique}
        onChange={(e) =>
          setData({ ...data, typeBoutique: e.target.value })
        }
      >
        <option value="Physique">Physique</option>
        <option value="En ligne">En ligne</option>
        <option value="Les deux">Les deux</option>
      </select>

      <Input
        label="Mot de passe"
        required
        type="password"
        autoComplete="new-password"
        value={data.password}
        onChange={(e) =>
          setData({ ...data, password: e.target.value })
        }
      />

      <Input
        label="Confirmer le mot de passe"
        required
        type="password"
        autoComplete="new-password"
        value={data.passwordConfirm}
        onChange={(e) =>
          setData({ ...data, passwordConfirm: e.target.value })
        }
      />

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        disabled={loading}
        className="w-full py-4 bg-orange-600 text-black rounded-xl font-semibold"
      >
        {loading ? "Création..." : "Créer votre boutique"}
      </button>
    </form>
  );
}
