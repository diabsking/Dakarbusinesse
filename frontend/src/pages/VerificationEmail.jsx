import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

// ⏱️ 10 minutes (doit matcher le backend)
const OTP_DURATION = 10 * 60 * 1000;
// ⏱️ Cooldown renvoi OTP (60s UX)
const RESEND_COOLDOWN = 60 * 1000;

export default function VerificationEmail({ email: initialEmail }) {
  const navigate = useNavigate();

  const [email] = useState(() => {
    return (
      initialEmail ||
      localStorage.getItem("emailForOTP") ||
      ""
    );
  });

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  /* =============================
     GESTION SESSION OTP
  ============================= */
  useEffect(() => {
    if (!email) {
      navigate("/");
      return;
    }

    const expireAt = localStorage.getItem("otpExpireAt");
    const resendAt = localStorage.getItem("otpResendAt");

    // 🆕 première entrée
    if (!expireAt) {
      localStorage.setItem(
        "otpExpireAt",
        Date.now() + OTP_DURATION
      );
      localStorage.setItem("emailForOTP", email);
    }

    // ⏳ cooldown renvoi
    if (resendAt) {
      const remaining = Number(resendAt) - Date.now();
      if (remaining > 0) {
        setCooldown(Math.ceil(remaining / 1000));
      }
    }

    const interval = setInterval(() => {
      const resendAt = localStorage.getItem("otpResendAt");
      if (!resendAt) return;

      const remaining = Number(resendAt) - Date.now();
      if (remaining <= 0) {
        setCooldown(0);
        localStorage.removeItem("otpResendAt");
      } else {
        setCooldown(Math.ceil(remaining / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
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

      const res = await api.post(
        "/api/vendeur/auth/verify-otp",
        {
          email,
          code: code.trim(),
        }
      );

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.removeItem("emailForOTP");
        localStorage.removeItem("otpExpireAt");
        localStorage.removeItem("otpResendAt");
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

  /* =============================
     RENVOYER OTP
  ============================= */
  const handleResend = async () => {
    setError("");

    try {
      setResendLoading(true);

      await api.post(
        "/api/vendeur/auth/resend-otp",
        { email }
      );

      // 🔁 reset timers
      localStorage.setItem(
        "otpExpireAt",
        Date.now() + OTP_DURATION
      );
      localStorage.setItem(
        "otpResendAt",
        Date.now() + RESEND_COOLDOWN
      );

      setCooldown(RESEND_COOLDOWN / 1000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Erreur lors de l’envoi du code"
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center">
        Vérification par email
      </h2>

      <p className="text-center mb-4 text-gray-600">
        Un code de vérification a été envoyé à :
        <br />
        <strong>{email}</strong>
      </p>

      <p className="text-center mb-6 text-gray-500 text-sm">
        ⏱️ Code valable <strong>10 minutes</strong>
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

      {/* 🔁 RENVOYER OTP */}
      <div className="mt-6 text-center">
        <button
          onClick={handleResend}
          disabled={resendLoading || cooldown > 0}
          className="text-sm text-orange-600 hover:underline disabled:text-gray-400"
        >
          {resendLoading
            ? "Envoi en cours..."
            : cooldown > 0
            ? `Renvoyer le code (${cooldown}s)`
            : "Renvoyer le code"}
        </button>
      </div>
    </div>
  );
}
