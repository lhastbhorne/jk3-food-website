import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import {
  Link,
  NavLink,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingCart,
  ArrowLeft,
  Menu,
  X,
  Store,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
    end: true,
  },
  {
    name: "Products",
    path: "/admin/products",
    icon: Package,
  },
  {
    name: "Categories",
    path: "/admin/categories",
    icon: Layers,
  },
  {
    name: "Orders",
    path: "/admin/orders",
    icon: ShoppingCart,
  },
];

function AdminLayout({ theme = "light", onToggleTheme }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isDark = theme === "dark";
  const navigate = useNavigate();
  const location = useLocation();

  const colors = {
    page: isDark
      ? "bg-[#141d17] text-[#f4f5ef]"
      : "bg-[#f7f8f1] text-[#203b2b]",

    sidebar: isDark
      ? "border-white/10 bg-[#1b261e]"
      : "border-[#e5e9df] bg-white",

    header: isDark
      ? "border-white/10 bg-[#141d17]/95"
      : "border-[#e5e9df] bg-[#f7f8f1]/95",

    muted: isDark ? "text-[#aebdac]" : "text-[#71806d]",

    hover: isDark ? "hover:bg-white/5" : "hover:bg-[#eef2e8]",

    border: isDark ? "border-white/10" : "border-[#e5e9df]",
  };

  async function handleLogout() {
    try {
      await signOut(auth);
      navigate("/admin/login", { replace: true });
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  }

  return (
    <div className={`min-h-screen ${colors.page}`}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r transition-transform duration-300 ${
          colors.sidebar
        } ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Brand */}
        <div
          className={`flex h-20 shrink-0 items-center justify-between border-b px-6 ${colors.border}`}
        >
          <Link
            to="/admin"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#47784a] text-white">
              <Store size={23} />
            </div>

            <div>
              <p className="text-lg font-black tracking-tight">JK3 Foods</p>

              <p className={`text-xs ${colors.muted}`}>Admin workspace</p>
            </div>
          </Link>

          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className={`rounded-lg p-2 transition ${colors.hover} lg:hidden`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-5 py-7">
          <p
            className={`px-3 text-xs font-bold uppercase tracking-[0.18em] ${colors.muted}`}
          >
            Management
          </p>

          <nav className="mt-4 space-y-2">
            {navigation.map(({ name, path, icon: Icon, end }) => (
              <NavLink
                key={path}
                to={path}
                end={end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-[#47784a] text-white shadow-sm"
                      : `${colors.muted} ${colors.hover}`
                  }`
                }
              >
                <Icon size={19} />
                <span>{name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar footer */}
        <div className={`shrink-0 space-y-2 border-t p-5 ${colors.border}`}>
          <Link
            to="/"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${colors.muted} ${colors.hover}`}
          >
            <ArrowLeft size={18} />
            View customer website
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${colors.muted} ${colors.hover}`}
          >
            <LogOut size={18} />
            Exit admin
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="min-h-screen lg:pl-72">
        {/* Header */}
        <header
          className={`sticky top-0 z-30 flex h-20 items-center justify-between border-b px-4 backdrop-blur sm:px-8 ${colors.header}`}
        >
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Open navigation menu"
              onClick={() => setSidebarOpen(true)}
              className={`rounded-xl border border-[#8b9d85]/30 p-2.5 transition ${colors.hover} lg:hidden`}
            >
              <Menu size={21} />
            </button>

            <div className="min-w-0">
              <p className="text-sm font-bold">Admin workspace</p>

              <p className={`mt-1 hidden text-xs sm:block ${colors.muted}`}>
                Manage your JK3 Foods store
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            {/* Theme toggle */}
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={
                isDark ? "Switch to light mode" : "Switch to dark mode"
              }
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className={`rounded-xl border border-[#8b9d85]/30 p-2.5 transition ${colors.hover}`}
            >
              {isDark ? <Sun size={19} /> : <Moon size={19} />}
            </button>

            {/* Admin avatar */}
            <div
              title="JK3 Foods admin"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#47784a] text-sm font-black text-white"
            >
              JK
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="px-4 py-7 sm:px-8 sm:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
