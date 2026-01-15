import React from "react";
import UserProfile from "../components/TableauDebord/UserProfile";
import { FiCheckCircle, FiPauseCircle, FiTrash2 } from "react-icons/fi";

export default function ParametresPage() {

  // Fonctions pour gérer les actions
  const handleCertify = () => alert("Demande de certification envoyée !");
  const handlePause = () => alert("Compte mis en pause !");
  const handleDelete = () => {
    if(window.confirm("Voulez-vous vraiment supprimer votre compte ?")) {
      alert("Compte supprimé !");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 flex flex-col items-center">
      
      {/* Carte Profil */}
      <UserProfile
        name="Jean Dupont"
        shopName="Kolwaz Shop"
        profilePic="" // mettre URL photo si disponible
        isCertified={false}
        onSettingsClick={() => alert("Menu paramètres ouvert")}
      />

      {/* Section Options */}
      <div className="w-full max-w-md mt-8 bg-transparent backdrop-blur-md border border-gray-300 rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Paramètres du compte</h2>

        {/* Devenir vendeur certifié */}
        <button
          onClick={handleCertify}
          className="w-full flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-200 transition font-medium text-gray-700"
        >
          <FiCheckCircle size={20} className="text-green-500" />
          Demander certification
        </button>

        {/* Mettre en pause le compte */}
        <button
          onClick={handlePause}
          className="w-full flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-200 transition font-medium text-gray-700"
        >
          <FiPauseCircle size={20} className="text-yellow-500" />
          Mettre le compte en pause
        </button>

        {/* Supprimer le compte */}
        <button
          onClick={handleDelete}
          className="w-full flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-xl hover:bg-red-100 transition font-medium text-red-600"
        >
          <FiTrash2 size={20} />
          Supprimer le compte
        </button>
      </div>
    </div>
  );
}
