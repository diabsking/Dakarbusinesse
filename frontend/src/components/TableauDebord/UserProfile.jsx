import React, { useState, useEffect, useRef } from "react";
import { FiSettings, FiLogOut, FiTrash2, FiEdit } from "react-icons/fi";
import { BsPatchCheckFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function ProfileSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-white rounded-2xl border shadow-sm animate-pulse">
      <div className="flex flex-col items-center gap-3">
        <div className="w-24 h-24 rounded-full bg-gray-200" />
        <div className="h-4 w-24 bg-gray-200 rounded" />
      </div>

      <div className="flex-1 space-y-4">
        <div className="h-6 w-1/3 bg-gray-200 rounded" />
        <div className="h-4 w-1/2 bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 rounded" />

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

function UserProfile() {
  const [user, setUser] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState(null);
  const [profilIncomplet, setProfilIncomplet] = useState(false);

  const menuRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const isProfilIncomplet = (vendeur) => {
    const champs = [
      "nomVendeur",
      "nomBoutique",
      "description",
      "adresseBoutique",
      "typeBoutique",
      "avatar",
    ];
    return champs.some((c) => !vendeur?.[c]);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/vendeur/auth/me");
        const vendeur = res.data.vendeur || res.data;
        setUser(vendeur);
        setProfilIncomplet(isProfilIncomplet(vendeur));
        localStorage.setItem("user", JSON.stringify(vendeur));
      } catch (err) {
        setError("Impossible de charger le profil");
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "⚠️ Cette action est définitive.\n\nSupprimer votre compte ?"
      )
    )
      return;

    try {
      await api.delete("/api/vendeur/auth/delete");
      localStorage.clear();
      navigate("/", { replace: true });
    } catch (error) {
      alert("Erreur lors de la suppression du compte");
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUser((prev) => ({ ...prev, avatarFile: file }));
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleDeleteAvatar = async () => {
    if (!window.confirm("Supprimer votre avatar ?")) return;

    try {
      const res = await api.delete("/api/vendeur/auth/avatar");
      setUser(res.data.vendeur);
      setAvatarPreview(null);
    } catch {
      alert("Erreur suppression avatar");
    }
  };

  const saveProfile = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      [
        "nomVendeur",
        "nomBoutique",
        "typeBoutique",
        "adresseBoutique",
        "description",
        "email",
      ].forEach((key) => user[key] && formData.append(key, user[key]));

      if (user.avatarFile) {
        formData.append("avatar", user.avatarFile);
      }

      const res = await api.put("/api/vendeur/auth/profile", formData);

      setUser(res.data.vendeur);
      setAvatarPreview(null);
      setProfilIncomplet(isProfilIncomplet(res.data.vendeur));
      setEditMode(false);

      setSuccessMsg("Profil mis à jour avec succès");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch {
      setError("Erreur mise à jour profil");
    } finally {
      setLoading(false);
    }
  };

  if (error)
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded">
        {error}
      </div>
    );

  if (!user) return <ProfileSkeleton />;

  return (
    <div className="relative bg-white rounded-2xl border shadow-sm p-4 md:p-6 flex flex-col md:flex-row gap-6">
      {/* Avatar */}
      <div className="flex flex-col items-center gap-3 w-full md:w-auto">
        <img
          src={avatarPreview || user.avatar || "/avatar-default.png"}
          alt="Avatar"
          className="w-24 h-24 rounded-full object-cover border-2 border-orange-600"
        />

        {editMode && (
          <div className="flex flex-col sm:flex-row gap-2 w-full justify-center">
            <button
              onClick={() => fileInputRef.current.click()}
              className="text-sm bg-blue-600 text-white px-3 py-1 rounded flex items-center justify-center"
            >
              <FiEdit className="mr-1" /> Changer
            </button>

            {user.avatar && (
              <button
                onClick={handleDeleteAvatar}
                className="text-sm bg-red-600 text-white px-3 py-1 rounded flex items-center justify-center"
              >
                <FiTrash2 className="mr-1" /> Supprimer
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </div>
        )}
      </div>

      {/* Infos */}
      <div className="flex-1 w-full">
        {profilIncomplet && !editMode && (
          <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <span className="text-sm text-yellow-700">
              ⚠️ Profil incomplet
            </span>
            <button
              onClick={() => setEditMode(true)}
              className="mt-2 sm:mt-0 bg-yellow-600 text-white px-4 py-1 rounded"
            >
              Compléter
            </button>
          </div>
        )}

        {successMsg && (
          <div className="mb-3 bg-green-100 text-green-700 p-2 rounded">
            {successMsg}
          </div>
        )}

        {!editMode ? (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h3 className="text-xl font-semibold">{user.nomVendeur}</h3>
              {user.certifie && (
                <BsPatchCheckFill
                  className="text-blue-600"
                  title="Vendeur certifié"
                />
              )}
            </div>

            <p className="font-medium mt-1">{user.nomBoutique}</p>
            <p className="text-gray-600 italic mt-2">{user.description}</p>

            {!user.certifie && (
              <div className="mt-4 bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg text-sm shadow-sm">
                <p className="font-semibold text-blue-700">🚀 Boostez votre visibilité</p>
                <p className="text-gray-700 mt-1">
                  Les vendeurs <strong>certifiés</strong> sont priorisés sur Kolwaz.
                </p>
                <button
                  onClick={() =>
                    navigate("/certification", { state: { vendeurId: user._id } })
                  }
                  className="mt-3 text-blue-600 font-semibold hover:underline"
                >
                  Devenir vendeur certifié →
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mt-4">
              <p>
                <strong>Email :</strong> {user.email}
              </p>
              <p>
                <strong>Téléphone :</strong> {user.telephone}
              </p>
              <p>
                <strong>Adresse :</strong> {user.adresseBoutique}
              </p>
              <p>
                <strong>Type :</strong> {user.typeBoutique}
              </p>
            </div>
          </>
        ) : (
          <div className="space-y-2">
            {["nomVendeur", "nomBoutique", "adresseBoutique", "email"].map((f) => (
              <input
                key={f}
                className="w-full border rounded px-3 py-2"
                value={user[f] || ""}
                placeholder={f}
                onChange={(e) => setUser({ ...user, [f]: e.target.value })}
              />
            ))}

            <textarea
              className="w-full border rounded px-3 py-2"
              placeholder="Description"
              value={user.description || ""}
              onChange={(e) => setUser({ ...user, description: e.target.value })}
            />

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={saveProfile}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 flex-1 text-center"
              >
                {loading ? "..." : "Enregistrer"}
              </button>

              <button
                onClick={() => setEditMode(false)}
                className="bg-gray-200 px-4 py-2 rounded flex-1 text-center"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Menu */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded hover:bg-gray-100"
        >
          <FiSettings size={22} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white border rounded shadow z-50">
            <button
              onClick={() => {
                setEditMode(true);
                setMenuOpen(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100"
            >
              Modifier le profil
            </button>

            {/* ✅ TOUJOURS AFFICHÉ */}
            <button
              onClick={() => navigate("/certification")}
              className="w-full px-4 py-2 text-left text-blue-600 hover:bg-gray-100"
            >
              Devenir vendeur certifié
            </button>

            <button
              onClick={handleLogout}
              className="flex gap-2 w-full px-4 py-2 text-left hover:bg-red-50"
            >
              <FiLogOut /> Déconnexion
            </button>

            <button
              onClick={handleDeleteAccount}
              className="flex gap-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
            >
              <FiTrash2 /> Supprimer compte
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
