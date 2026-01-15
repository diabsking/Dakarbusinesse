import { useState } from "react";
import axios from "axios";

export default function MotDePasseOublie() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [nouveauPassword, setNouveauPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ======================
     ENVOYER OTP
  ====================== */
  const envoyerOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Veuillez entrer votre email");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        "http://localhost:5000/api/vendeur/auth/forgot-password",
        { email }
      );
      setMessage("OTP envoyé par email !");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l’envoi de l’OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     VALIDER OTP + RESET MDP
  ====================== */
  const resetAvecOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email || !code || !nouveauPassword || !confirmPassword) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    if (nouveauPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        "http://localhost:5000/api/vendeur/auth/reset-password",
        { email, code, nouveauPassword }
      );
      setMessage("Mot de passe réinitialisé avec succès !");
      setCode("");
      setNouveauPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du changement de mot de passe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-8">
        <h1 className="text-2xl font-bold text-center mb-6">Mot de passe oublié</h1>

        {/* ======================
            FORMULAIRE ENVOYER OTP
        ====================== */}
        <form onSubmit={envoyerOtp} className="space-y-4">
          <h2 className="font-semibold text-lg">Vous n'avez pas encore reçu d'OTP</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl focus:ring-orange-500"
          />
          <button
            disabled={loading}
            className="w-full py-3 bg-orange-600 rounded-xl font-semibold"
          >
            {loading ? "Envoi..." : "Envoyer OTP"}
          </button>
        </form>

        <hr className="my-4" />

        {/* ======================
            FORMULAIRE VALIDER OTP + RESET
        ====================== */}
        <form onSubmit={resetAvecOtp} className="space-y-4">
          <h2 className="font-semibold text-lg">Vous avez déjà reçu un OTP</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          />
          <input
            type="text"
            placeholder="OTP reçu"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          />
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={nouveauPassword}
            onChange={(e) => setNouveauPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          />
          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          />
          <button
            disabled={loading}
            className="w-full py-3 bg-orange-600 rounded-xl font-semibold"
          >
            {loading ? "Enregistrement..." : "Réinitialiser mot de passe"}
          </button>
        </form>

        {/* ======================
            MESSAGES
        ====================== */}
        {error && <p className="text-red-600 mt-4">{error}</p>}
        {message && <p className="text-green-600 mt-4">{message}</p>}
      </div>
    </div>
  );
}
