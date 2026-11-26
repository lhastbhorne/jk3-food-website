import { useState, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { ShoppingBag, Menu, X, Sun, Moon, Leaf } from "lucide-react";

function Header({ theme = "light", onToggleTheme, cartCount = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);

  const isDark = theme === "dark";

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Shop", to: "/shop" },
  ];

  const desktopLinkClass = ({ isActive }) =>
    `text-sm font-semibold transition-colors hover:text-[#629467] ${
      isActive ? "text-[#629467]" : isDark ? "text-[#d5ddd2]" : "text-[#424d40]"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `flex w-full items-center rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
      isActive
        ? isDark
          ? "bg-[#629467]/20 text-[#a6d5a5]"
          : "bg-[#47784a]/15 text-[#47784a]"
        : isDark
          ? "text-[#f0f4ed] hover:bg-white/10"
          : "text-[#424d40] hover:bg-[#e8eddf]"
    }`;

  const actionClass = `inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
    isDark ? "hover:bg-white/10" : "hover:bg-[#e8eddf]"
  }`;

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b backdrop-blur-xl ${
        isDark
          ? "border-white/10 bg-[#141d17]/95 text-[#f4f5ef]"
          : "border-[#e5e9df] bg-[#f7f8f1]/95 text-[#203b2b]"
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 px-3 py-2.5 sm:gap-4 sm:px-5 sm:py-3 lg:px-8">
        {/* Brand */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex min-w-0 shrink items-center gap-2"
          aria-label="JK3 Foods homepage"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#203b2b] text-white sm:h-10 sm:w-10">
            <Leaf size={20} />
          </span>

          <span className="min-w-0 leading-tight">
            <span className="block whitespace-nowrap text-base font-extrabold tracking-tight sm:text-lg">
              JK3 Foods
            </span>

            <span
              className={`hidden text-[9px] uppercase tracking-[0.16em] sm:block ${
                isDark ? "text-[#b8c6b5]" : "text-[#6b7968]"
              }`}
            >
              Everyday essentials
            </span>
          </span>
        </Link>

        {/* Desktop navigation: visible from 768px */}
        <nav
          className="hidden items-center gap-5 md:flex lg:gap-8"
          aria-label="Main navigation"
        >
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={desktopLinkClass}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Navbar actions */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {/* Theme toggle: tablet and desktop */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
            className={`${actionClass} hidden sm:inline-flex`}
          >
            {isDark ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {/* Cart remains in the navbar */}
          <Link
            to="/cart"
            onClick={closeMenu}
            aria-label={`Shopping cart with ${cartCount} items`}
            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-[#47784a] px-2.5 text-xs font-bold text-white transition-colors hover:bg-[#38653c] sm:gap-2 sm:px-3.5 sm:text-sm"
          >
            <ShoppingBag size={17} />
            <span className="hidden sm:inline">Cart</span>
            <span>({cartCount})</span>
          </Link>

          {/* Hamburger: visible below 768px */}
          <button
            ref={menuButtonRef}
            type="button"
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={menuOpen}
            aria-controls="jk3-mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
            className={`${actionClass} md:hidden`}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile navigation: hidden on medium and larger screens */}
      <div
        id="jk3-mobile-navigation"
        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-in-out md:hidden ${
          menuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div className="overflow-hidden">
          <nav
            aria-label="Mobile navigation"
            className={`border-t px-3 py-3 sm:px-5 ${
              isDark
                ? "border-white/10 bg-[#18251c]"
                : "border-[#e5e9df] bg-[#f7f8f1]"
            }`}
          >
            <div className="mx-auto grid max-w-7xl gap-1">
              {navLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={closeMenu}
                  className={mobileLinkClass}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
