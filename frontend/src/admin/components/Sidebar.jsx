import {
  FiHome,
  FiUsers,
  FiBox,
  FiShoppingCart,
  FiUser,
} from "react-icons/fi";

export default function Sidebar({ active, setActive }) {
  const item = (id, label, Icon) => (
    <button
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

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white p-4">
      {/* Logo */}
      <h1 className="text-xl font-bold mb-8 tracking-wide">
        KOLWAZ <span className="text-orange-400">ADMIN</span>
      </h1>

      {/* Navigation */}
      <div className="space-y-2">
        {item("home", "Dashboard", FiHome)}
        {item("vendeurs", "Vendeurs", FiUsers)}
        {item("produits", "Produits", FiBox)}
        {item("commandes", "Commandes", FiShoppingCart)}
      
      </div>

      {/* Footer sidebar */}
      <div className="mt-auto pt-10 text-xs text-gray-400">
        © {new Date().getFullYear()} Kolwaz
      </div>
    </aside>
  );
}
