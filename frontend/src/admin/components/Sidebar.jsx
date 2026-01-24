import {
  FiHome,
  FiUsers,
  FiBox,
  FiShoppingCart,
  FiZap,
  FiAward, // <-- ajouté pour Certification
} from "react-icons/fi";

export default function Sidebar({ active, setActive }) {
  const items = [
    { id: "home", label: "Accueil", Icon: FiHome },
    { id: "vendeurs", label: "Vendeurs", Icon: FiUsers },
    { id: "produits", label: "Produits", Icon: FiBox },
    { id: "commandes", label: "Commandes", Icon: FiShoppingCart },
    { id: "boosts", label: "Boosts", Icon: FiZap },
    { id: "certification", label: "Certification", Icon: FiAward }, // <-- ajouté
  ];

  /* =====================
     DESKTOP ITEM
  ===================== */
  const desktopItem = (id, label, Icon) => (
    <button
      key={id}
      onClick={() => setActive(id)}
      className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg transition
        ${
          active === id
            ? "bg-orange-500 text-white shadow"
            : "text-gray-300 hover:bg-gray-800"
        }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  /* =====================
     MOBILE ITEM
  ===================== */
  const mobileItem = (id, label, Icon) => (
    <button
      key={id}
      onClick={() => setActive(id)}
      className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 transition
        ${
          active === id
            ? "text-orange-500"
            : "text-gray-400"
        }`}
    >
      <Icon size={22} />
      <span className="text-xs">{label}</span>
    </button>
  );

  return (
    <>
      {/* =====================
         SIDEBAR DESKTOP
      ===================== */}
      <aside className="hidden md:flex w-64 min-h-screen bg-gray-900 text-white p-4 flex-col">
        {/* Logo */}
        <h1 className="text-xl font-bold mb-8 tracking-wide">
          KOLWAZ <span className="text-orange-400">ADMIN</span>
        </h1>

        {/* Navigation */}
        <div className="space-y-2">
          {items.map(({ id, label, Icon }) =>
            desktopItem(id, label, Icon)
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-10 text-xs text-gray-400">
          © {new Date().getFullYear()} Kolwaz
        </div>
      </aside>

      {/* =====================
         BOTTOM BAR MOBILE
      ===================== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex z-50">
        {items.map(({ id, label, Icon }) =>
          mobileItem(id, label, Icon)
        )}
      </nav>
    </>
  );
}
