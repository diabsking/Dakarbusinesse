import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BsPatchCheckFill } from "react-icons/bs";

export default function Certification() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.certifie) {
      navigate("/dashboard");
      return;
    }

    setUser(parsedUser);
  }, [navigate]);

  const lancerPaiement = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/certification/payer",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      window.location.href = res.data.payment_url;
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Erreur lors du paiement de la certification"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <BsPatchCheckFill size={48} className="text-blue-500" />
        </div>

        <h2 className="text-2xl font-bold mb-2">
          Certification du vendeur
        </h2>

        <p className="text-gray-600 mb-4">
          Obtenez le badge officiel Dakarbusinesse.
        </p>

        <div className="mb-6 text-lg font-semibold">
          Prix : <span className="text-orange-600">10 000 FCFA</span>
        </div>

        <button
          onClick={lancerPaiement}
          disabled={loading}
          className="w-full bg-orange-600 text-black py-2 rounded-lg hover:bg-orange-700"
        >
          {loading ? "Redirection..." : "CERTIFICATION N'EST PAS FONCTIONNELLE. MERCI..."}
        </button>
      </div>
    </div>
  );
}
