import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OTP_DURATION = 24 * 60 * 60 * 1000; // 24 heures

export default function VerificationEmail({ email: initialEmail }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState(() => {
    return (
      initialEmail ||
      localStorage.getItem("emailForOTP") ||
      ""
    );
  });

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* =============================
     GESTION SESSION INSCRIPTION
  ============================= */
  useEffect(() => {
    if (!email) {
      navigate("/");
      return;
    }

    const expireAt = localStorage.getItem("otpExpireAt");

    // ⏱️ première entrée → crée l’expiration
    if (!expireAt) {
      localStorage.setItem(
        "otpExpireAt",
        Date.now() + OTP_DURATION
      );
      localStorage.setItem("emailForOTP", email);
      return;
    }

    // ❌ expiré
    if (Date.now() > Number(expireAt)) {
      localStorage.removeItem("emailForOTP");
      localStorage.removeItem("otpExpireAt");
      navigate("/");
    }
  }, [email, navigate]);

  /* =============================
     VALIDATION OTP
  ============================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!code.trim()) {
      setError("Veuillez entrer le code");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/vendeur/auth/verify-otp",
        {
          email,
          code: code.trim(),
        }
      );

      // ✅ OTP OK → TOKEN
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.removeItem("emailForOTP");
        localStorage.removeItem("otpExpireAt");
      }

      navigate("/tableau-de-bord");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Code invalide ou expiré"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center">
        Vérification par email
      </h2>

      <p className="text-center mb-6 text-gray-600">
        Un code de vérification a été envoyé à :
        <br />
        <strong>{email}</strong>
      </p>

      <p className="text-center mb-6 text-gray-500 text-sm">
        ⏱️ Ce code est valable <strong>24 heures</strong>.
        Vous pouvez quitter la page et revenir plus tard.
      </p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Code de vérification"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
          maxLength={6}
          inputMode="numeric"
        />

        {error && (
          <p className="text-red-600 text-sm text-center">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-orange-600 text-black rounded-xl hover:bg-orange-700 transition font-medium disabled:opacity-50"
        >
          {loading ? "Vérification..." : "Vérifier"}
        </button>
      </form>
    </div>
  );
}
