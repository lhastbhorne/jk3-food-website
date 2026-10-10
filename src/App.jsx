import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/common/Header";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PageTransition from "./components/common/PageTransition";
import Footer from "./components/common/Footer";
import Contact from "./pages/Contact";
import About from "./pages/About";
import OrderTracking from "./pages/OrderTracking";

import { CartProvider, useCart } from "./context/CartContext";


function AppLayout({ theme, onToggleTheme }) {
  const { cartCount, addToCart } = useCart();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [location.pathname, location.search]);

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
          element={
            <PageTransition>
              <Home theme={theme} onAddToCart={addToCart} />
            </PageTransition>
          }
        />

        <Route
          path="/shop"
          element={
            <PageTransition>
              <Shop theme={theme} onAddToCart={addToCart} />
            </PageTransition>
          }
        />

        <Route
          path="/product/:productId"
          element={
            <PageTransition>
              <ProductDetails theme={theme} onAddToCart={addToCart} />
            </PageTransition>
          }
        />

        <Route
          path="/cart"
          element={
            <PageTransition>
              <Cart theme={theme} />
            </PageTransition>
          }
        />

        <Route
          path="/checkout"
          element={
            <PageTransition>
              <Checkout theme={theme} />
            </PageTransition>
          }
        />

        <Route
          path="*"
          element={
            <PageTransition>
              <main className="px-5 py-20 text-center">
                <h1 className="text-3xl font-black">Page not found</h1>
                <a
                  href="/"
                  className="mt-5 inline-block text-[#629467] underline"
                >
                  Return home
                </a>
              </main>
            </PageTransition>
          }
        />

        <Route
          path="/contact"
          element={
            <PageTransition>
              <Contact theme={theme} />
            </PageTransition>
          }
        />

        <Route
          path="/about"
          element={
            <PageTransition>
              <About theme={theme} />
            </PageTransition>
          }
        />

        <Route
          path="/track-order"
          element={
            <PageTransition>
              <OrderTracking theme={theme} />
            </PageTransition>
          }
        />
      </Routes>
      <Footer theme={theme} />
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
