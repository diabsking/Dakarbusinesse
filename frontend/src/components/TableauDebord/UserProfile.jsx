function UserProfileMobile() {
  const [user, setUser] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState(null);
  const [profilIncomplet, setProfilIncomplet] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const isProfilIncomplet = (vendeur) => {
    const champs = ["nomVendeur", "nomBoutique", "description", "adresseBoutique", "typeBoutique", "avatar"];
    return champs.some((c) => !vendeur?.[c]);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/vendeur/auth/me");
        const vendeur = res.data.vendeur || res.data;
        setUser(vendeur);
        setProfilIncomplet(isProfilIncomplet(vendeur));
      } catch {
        setError("Impossible de charger le profil");
      }
    };
    fetchUser();
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUser((prev) => ({ ...prev, avatarFile: file }));
    setAvatarPreview(URL.createObjectURL(file));
  };

  const saveProfile = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      ["nomVendeur", "nomBoutique", "typeBoutique", "adresseBoutique", "description", "email"].forEach((key) => user[key] && formData.append(key, user[key]));
      if (user.avatarFile) formData.append("avatar", user.avatarFile);
      const res = await api.put("/api/vendeur/auth/profile", formData);
      setUser(res.data.vendeur);
      setAvatarPreview(null);
      setProfilIncomplet(isProfilIncomplet(res.data.vendeur));
      setEditMode(false);
      setSuccessMsg("Profil mis à jour !");
      setTimeout(() => setSuccessMsg(""), 2500);
    } catch {
      setError("Erreur mise à jour profil");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="p-3 bg-red-50 text-red-600 rounded text-center text-sm">{error}</div>;
  if (!user) return <ProfileSkeleton />;

  return (
    <div className="max-w-sm mx-auto mt-6 bg-white rounded-xl shadow p-4 text-center space-y-4">
      {/* Avatar */}
      <div className="relative">
        <img
          src={avatarPreview || user.avatar || "/avatar-default.png"}
          alt="Avatar"
          className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-orange-600"
        />
        {editMode && (
          <button
            onClick={() => fileInputRef.current.click()}
            className="absolute bottom-0 right-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-full shadow"
          >
            Changer
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

      {/* Nom et boutique */}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">{user.nomVendeur}</h2>
        <p className="text-sm text-gray-500">{user.nomBoutique}</p>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-600 italic">{user.description}</p>

      {/* Profil incomplet */}
      {profilIncomplet && !editMode && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-2 rounded text-yellow-700 text-xs">
          ⚠️ Profil incomplet
          <button
            onClick={() => setEditMode(true)}
            className="ml-2 bg-yellow-600 text-white px-2 py-0.5 rounded text-xs"
          >
            Compléter
          </button>
        </div>
      )}

      {/* Infos */}
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 mt-2">
        <div>
          <strong>Email:</strong> {user.email}
        </div>
        <div>
          <strong>Téléphone:</strong> {user.telephone}
        </div>
        <div>
          <strong>Adresse:</strong> {user.adresseBoutique}
        </div>
        <div>
          <strong>Type:</strong> {user.typeBoutique}
        </div>
      </div>

      {/* Boutons actions */}
      <div className="flex flex-col gap-2 mt-3">
        {editMode ? (
          <>
            <button
              onClick={saveProfile}
              disabled={loading}
              className="bg-blue-600 text-white text-sm px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? "..." : "Enregistrer"}
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-200 text-sm px-4 py-2 rounded"
            >
              Annuler
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-600 text-white text-sm px-4 py-2 rounded"
            >
              Modifier le profil
            </button>
            <button
              onClick={() => navigate("/certification")}
              className="bg-gray-100 text-blue-600 text-sm px-4 py-2 rounded"
            >
              Devenir vendeur certifié
            </button>
          </>
        )}
      </div>
    </div>
  );
}
