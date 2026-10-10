import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/common/Header";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

import { CartProvider, useCart } from "./context/CartContext";

function AppLayout({ theme, onToggleTheme }) {
  const { cartCount, addToCart } = useCart();

  return (
    <div
      className={
        theme === "dark"
          ? "min-h-screen bg-[#141d17] text-[#f4f5ef]"
          : "min-h-screen bg-[#f7f8f1] text-[#203b2b]"
      }
    >
      <Header
        theme={theme}
        onToggleTheme={onToggleTheme}
        cartCount={cartCount}
      />

      <Routes>
        <Route
          path="/"
          element={<Home theme={theme} onAddToCart={addToCart} />}
        />

        <Route
          path="/shop"
          element={<Shop theme={theme} onAddToCart={addToCart} />}
        />

        <Route
          path="/product/:productId"
          element={<ProductDetails theme={theme} onAddToCart={addToCart} />}
        />

        <Route path="/cart" element={<Cart theme={theme} />} />

        <Route path="/checkout" element={<Checkout theme={theme} />} />

        <Route
          path="*"
          element={
            <main className="px-5 py-20 text-center">
              <h1 className="text-3xl font-black">Page not found</h1>
              <a
                href="/"
                className="mt-5 inline-block text-[#629467] underline"
              >
                Return home
              </a>
            </main>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("jk3-theme") || "light",
  );

  function toggleTheme() {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === "light" ? "dark" : "light";

      localStorage.setItem("jk3-theme", nextTheme);

      return nextTheme;
    });
  }

  return (
    <BrowserRouter>
      <CartProvider>
        <AppLayout theme={theme} onToggleTheme={toggleTheme} />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
