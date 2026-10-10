import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ShoppingBag, Search, Menu, X, Sun, Moon, Leaf } from "lucide-react";

function Header({ theme = "light", onToggleTheme, cartCount = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isDark = theme === "dark";

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Shop", to: "/shop" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
        isDark
          ? "border-white/10 bg-[#141d17]/95 text-[#f4f5ef]"
          : "border-[#e5e9df] bg-[#f7f8f1]/95 text-[#203b2b]"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="flex shrink-0 items-center gap-2.5"
          aria-label="JK3 Foods homepage"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#203b2b] text-white">
            <Leaf size={23} />
          </span>

          <span>
            <span className="block text-xl font-extrabold tracking-tight">
              JK3 Foods
            </span>
            <span
              className={`block text-[10px] uppercase tracking-[0.18em] ${
                isDark ? "text-[#b8c6b5]" : "text-[#6b7968]"
              }`}
            >
              Everyday essentials
            </span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `text-sm font-semibold transition hover:text-[#629467] ${
                  isActive
                    ? "text-[#629467]"
                    : isDark
                      ? "text-[#d5ddd2]"
                      : "text-[#424d40]"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Search products"
            title="Search products"
            onClick={() => {
              window.location.href = "/shop";
            }}
            className={`hidden rounded-full p-2.5 transition sm:inline-flex ${
              isDark ? "hover:bg-white/10" : "hover:bg-[#e8eddf]"
            }`}
          >
            <Search size={20} />
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
            className={`rounded-full p-2.5 transition ${
              isDark ? "hover:bg-white/10" : "hover:bg-[#e8eddf]"
            }`}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <Link
            to="/cart"
            className="relative flex items-center gap-2 rounded-full bg-[#47784a] px-3 py-2.5 text-sm font-bold text-white transition hover:bg-[#38653c] sm:px-4"
          >
            <ShoppingBag size={19} />
            <span className="hidden sm:inline">Cart</span>
            <span>({cartCount})</span>
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            className={`rounded-full p-2.5 transition md:hidden ${
              isDark ? "hover:bg-white/10" : "hover:bg-[#e8eddf]"
            }`}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {menuOpen && (
        <nav
          className={`border-t px-4 py-4 md:hidden ${
            isDark ? "border-white/10" : "border-[#e5e9df]"
          }`}
        >
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block rounded-xl px-4 py-3 text-sm font-semibold ${
                  isActive
                    ? "bg-[#47784a]/15 text-[#78b47d]"
                    : isDark
                      ? "text-[#e0e7dc]"
                      : "text-[#424d40]"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}

export default Header;
