import React, { useEffect, useState } from "react";
import axios from "axios";

function NotificationsVendeur() {
  const [nouvellesCommandes, setNouvellesCommandes] = useState([]);
  const [derniereVerif, setDerniereVerif] = useState(new Date().getTime());

  // Audio notification
  const audio = new Audio("/notification.mp3"); // place ton fichier notification.mp3 dans public/

  useEffect(() => {
    const interval = setInterval(fetchCommandes, 10000); // toutes les 10s
    fetchCommandes(); // vérification initiale
    return () => clearInterval(interval);
  }, []);

  const fetchCommandes = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get(
        "http://localhost:5000/api/commandes/vendeur",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (Array.isArray(res.data)) {
        const nouvelles = res.data.filter(
          (cmd) => new Date(cmd.createdAt).getTime() > derniereVerif
        );

        if (nouvelles.length > 0) {
          setNouvellesCommandes(nouvelles);
          audio.play().catch((err) => console.warn("Audio notification:", err));
        }

        setDerniereVerif(new Date().getTime());
      }
    } catch (err) {
      console.error("❌ Erreur vérification commandes", err);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      {nouvellesCommandes.length > 0 && (
        <div className="bg-green-500 text-white px-4 py-2 rounded shadow-md animate-pulse">
          {`Vous avez ${nouvellesCommandes.length} nouvelle(s) commande(s) !`}
        </div>
      )}
    </div>
  );
}

export default NotificationsVendeur;
