import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  Link,
  useLocation,
} from "react-router-dom";

import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import PageTransition from "./components/common/PageTransition";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import OrderTracking from "./pages/OrderTracking";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductForm from "./pages/admin/AdminProductForm";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders";

import { CartProvider, useCart } from "./context/CartContext";
import { AdminAuthProvider, useAdminAuth } from "./context/AdminAuthContext";

function NotFound() {
  return (
    <main className="px-5 py-20 text-center">
      <h1 className="text-3xl font-black">Page not found</h1>

      <p className="mt-3 text-[#71806d]">
        The page you're looking for doesn't exist.
      </p>

      <Link to="/" className="mt-5 inline-block text-[#629467] underline">
        Return home
      </Link>
    </main>
  );
}

/* Protects the admin dashboard and all nested admin pages. */
function AdminRouteGuard() {
  const { isAdmin, authLoading } = useAdminAuth();

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8f1] px-4 text-[#203b2b]">
        <p className="text-sm font-semibold">Checking admin access...</p>
      </main>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}

/* Customer-facing website layout. */
function StoreLayout({ theme, onToggleTheme }) {
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
          path="/about"
          element={
            <PageTransition>
              <About theme={theme} />
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
          path="/track-order"
          element={
            <PageTransition>
              <OrderTracking theme={theme} />
            </PageTransition>
          }
        />

        <Route
          path="*"
          element={
            <PageTransition>
              <NotFound />
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
        <AdminAuthProvider>
          <Routes>
            {/* Admin login */}
            <Route path="/admin/login" element={<AdminLogin theme={theme} />} />

            {/* Protected admin section */}
            <Route element={<AdminRouteGuard />}>
              <Route
                path="/admin"
                element={
                  <AdminLayout theme={theme} onToggleTheme={toggleTheme} />
                }
              >
                <Route
                  index
                  element={
                    <PageTransition>
                      <AdminDashboard theme={theme} />
                    </PageTransition>
                  }
                />
                <Route
                  path="products"
                  element={<AdminProducts theme={theme} />}
                />
                <Route
                  path="products/new"
                  element={<AdminProductForm theme={theme} />}
                />
                ```jsx
                <Route
                  path="products/:productId/edit"
                  element={<AdminProductForm theme={theme} />}
                />
                <Route path="orders" element={<AdminOrders theme={theme} />} />
                <Route
                  path="categories"
                  element={<AdminCategories theme={theme} />}
                />
                {/* Future admin pages will go inside this route. */}
              </Route>
            </Route>

            {/* Customer-facing website */}
            <Route
              path="/*"
              element={
                <StoreLayout theme={theme} onToggleTheme={toggleTheme} />
              }
            />
          </Routes>
        </AdminAuthProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
