import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  Leaf,
  ShieldCheck,
  ShoppingBasket,
  Truck,
} from "lucide-react";

import { motion } from "motion/react";

import OrderTrackingBanner from "../components/common/OrderTrackingBanner";

import { getActiveProducts } from "../services/productService";

import { getAllCategories } from "../services/categoryService";

const CATEGORY_EMOJIS = ["🥬", "🥫", "🥤", "🍪", "🧼", "🛒"];

const formatPrice = (price) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",

    currency: "NGN",

    maximumFractionDigits: 0,
  }).format(Number(price) || 0);

const getImage = (product) =>
  product.image ||
  product.imageUrl ||
  product.imageURL ||
  product.images?.[0] ||
  "";

const getUnit = (product) =>
  product.unit || product.size || product.packaging || "";

function Home({ theme = "light", onAddToCart }) {
  const [addedProduct, setAddedProduct] = useState("");

  const [products, setProducts] = useState([]);

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState("");

  const isDark = theme === "dark";

  const colors = {
    text: isDark ? "text-[#f4f5ef]" : "text-[#203b2b]",

    muted: isDark ? "text-[#b8c6b5]" : "text-[#6b7968]",

    card: isDark ? "border-white/10 bg-[#202a22]" : "border-[#e5e9df] bg-white",

    surface: isDark ? "bg-[#1b261e]" : "bg-[#eef2e8]",
  };

  useEffect(() => {
    let cancelled = false;

    async function loadHomeData() {
      try {
        setLoading(true);

        setLoadError("");

        const [productData, categoryData] = await Promise.all([
          getActiveProducts(),

          getAllCategories(),
        ]);

        if (cancelled) return;

        const activeCategories = categoryData.filter(
          (category) => category.isActive === true,
        );

        const categoryMap = new Map(
          activeCategories.map((category) => [category.id, category.name]),
        );

        const normalizedProducts = productData

          .filter((product) => product.isActive === true)

          .map((product) => {
            const categoryId = String(
              product.categoryId ?? product.category ?? "",
            );

            return {
              ...product,

              id: product.id,

              productId: product.id,

              categoryId,

              category:
                categoryMap.get(categoryId) ||
                product.categoryName ||
                "Uncategorized",

              image: getImage(product),

              unit: getUnit(product),

              price: Number(product.price) || 0,

              featured: product.featured === true,

              inStock:
                typeof product.stock === "number"
                  ? product.stock > 0
                  : product.inStock !== false,
            };
          })

          // Only show products assigned to an active admin category.

          .filter(
            (product) =>
              product.categoryId && categoryMap.has(product.categoryId),
          );

        setCategories(activeCategories);

        setProducts(normalizedProducts);
      } catch (error) {
        console.error("Failed to load homepage data:", error);

        if (!cancelled) {
          setLoadError(
            "We couldn't load our products right now. Please try again.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadHomeData();

    return () => {
      cancelled = true;
    };
  }, []);

  const featuredProducts = [...products]

    .sort((a, b) => Number(b.featured) - Number(a.featured))

    .slice(0, 4);

  function handleAdd(product) {
    onAddToCart?.({
      ...product,

      id: product.id,

      productId: product.id,

      variantId: "default",

      name: product.name,

      price: product.price,

      image: product.image,

      size: product.unit,

      quantity: 1,
    });

    setAddedProduct(product.id);

    window.setTimeout(() => setAddedProduct(""), 1600);
  }

  return (
    <main className={colors.text}>
      {/* Hero */}

      <section className="mx-auto grid w-full max-w-7xl items-center gap-7 px-4 py-8 sm:gap-10 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-[#d4dfce] bg-[#e6eddf] px-3 py-2 text-[10px] font-bold text-[#294b30] sm:mb-6 sm:px-4 sm:text-xs">
            <Leaf size={15} />
            YOUR EVERYDAY SHOPPING PARTNER
          </div>

          <h1 className="max-w-2xl text-[2.65rem] font-black leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
            Good food.
            <br />
            <span className="text-[#629467]">Better living.</span>
          </h1>

          <p
            className={`mt-4 max-w-lg text-sm leading-7 sm:mt-6 sm:text-lg sm:leading-8 ${colors.muted}`}
          >
            From groceries and provisions to household essentials, discover
            everyday products that make shopping simpler.
          </p>

          <div className="mt-6 flex w-full flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap sm:mt-8">
            <Link
              to="/shop"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#47784a] px-5 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#38653c] min-[420px]:w-auto sm:px-7 sm:py-4"
            >
              Explore the shop <ArrowRight size={18} />
            </Link>

            <a
              href="#featured"
              className={`inline-flex w-full items-center justify-center gap-2 rounded-full border px-5 py-3.5 text-sm font-bold transition min-[420px]:w-auto sm:px-7 sm:py-4 ${
                isDark
                  ? "border-white/15 hover:bg-white/5"
                  : "border-[#dce2d5] hover:bg-white"
              }`}
            >
              Featured products
            </a>
          </div>

          <div className="mt-7 grid grid-cols-3 gap-2 border-t border-[#8b9d85]/20 pt-5 sm:mt-10 sm:gap-3 sm:pt-6">
            <div>
              <ShoppingBasket className="mb-2 text-[#629467]" size={22} />

              <p className="text-xs font-bold sm:text-sm">Everyday goods</p>
            </div>

            <div>
              <ShieldCheck className="mb-2 text-[#629467]" size={22} />

              <p className="text-xs font-bold sm:text-sm">Secure shopping</p>
            </div>

            <div>
              <Truck className="mb-2 text-[#629467]" size={22} />

              <p className="text-xs font-bold sm:text-sm">
                Convenient delivery
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative"
        >
          <div className="absolute -inset-4 rounded-[2rem] bg-[#7d9b6c]/15 blur-2xl" />

          <div className="relative overflow-hidden rounded-[2rem]">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85"
              alt="Fresh produce at a grocery market"
              className="h-[260px] w-full object-cover sm:h-[440px] lg:h-[520px]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#17251a]/75 via-transparent to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 text-white sm:bottom-8 sm:left-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#dce9cf]">
                Welcome to JK3 Foods
              </p>

              <h2 className="mt-2 max-w-sm text-2xl font-bold leading-tight sm:mt-3 sm:text-4xl">
                Stock your home with the good stuff.
              </h2>
            </div>

            <div className="absolute right-3 top-3 flex h-16 w-16 flex-col items-center justify-center rounded-full bg-[#f7f8f1] text-center text-[#203b2b] shadow-lg sm:right-7 sm:top-7 sm:h-20 sm:w-20">
              <Leaf size={19} />

              <span className="mt-1 text-[9px] font-extrabold uppercase tracking-wider">
                Shop better
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Categories created in the admin dashboard */}

      <section
        className={`${colors.surface} px-4 py-9 sm:px-6 sm:py-12 lg:px-8`}
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#629467]">
                Find what you need
              </p>

              <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                Shop by category
              </h2>
            </div>

            <Link
              to="/shop"
              className="hidden items-center gap-1 text-sm font-bold text-[#629467] sm:flex"
            >
              View everything <ArrowUpRight size={17} />
            </Link>
          </div>

          {loading ? (
            <p className={`mt-7 py-8 text-center ${colors.muted}`}>
              Loading categories...
            </p>
          ) : categories.length === 0 ? (
            <p className={`mt-7 py-8 text-center ${colors.muted}`}>
              No active categories are available yet.
            </p>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-7 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                >
                  <Link
                    to={`/shop?category=${encodeURIComponent(category.id)}`}
                    className={`group flex min-h-32 min-w-0 flex-col justify-between rounded-2xl border p-3 transition duration-300 hover:-translate-y-1 hover:border-[#629467] sm:min-h-36 sm:p-5 ${colors.card}`}
                  >
                    <span className="text-3xl">
                      {category.emoji ||
                        CATEGORY_EMOJIS[index % CATEGORY_EMOJIS.length]}
                    </span>

                    <span className="mt-5 flex items-center justify-between gap-2 font-bold">
                      <span>{category.name}</span>

                      <ArrowUpRight
                        size={17}
                        className="shrink-0 text-[#629467] transition group-hover:-translate-y-1 group-hover:translate-x-1"
                      />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured products loaded from Firestore */}

      <section
        id="featured"
        className="scroll-mt-20 px-3 py-10 sm:scroll-mt-24 sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#629467]">
                Picked for you
              </p>

              <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                Featured products
              </h2>

              <p className={`mt-3 max-w-lg leading-7 ${colors.muted}`}>
                Explore a few everyday essentials to get your shopping started.
              </p>
            </div>

            <Link
              to="/shop"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-[#8b9d85]/40 px-5 py-3 text-sm font-bold transition hover:border-[#47784a] hover:bg-[#47784a]/10"
            >
              Shop all products <ArrowRight size={17} />
            </Link>
          </div>

          {loading ? (
            <p className={`mt-8 py-10 text-center ${colors.muted}`}>
              Loading products...
            </p>
          ) : loadError ? (
            <div className="mt-8 rounded-2xl border border-red-300/40 p-8 text-center">
              <p className="text-sm text-red-500">{loadError}</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 rounded-full bg-[#47784a] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#38653c]"
              >
                Try again
              </button>
            </div>
          ) : featuredProducts.length === 0 ? (
            <p className={`mt-8 py-10 text-center ${colors.muted}`}>
              Products will appear here once they have been added in the admin
              dashboard.
            </p>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-3 min-[480px]:gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
              {featuredProducts.map((product, index) => (
                <motion.article
                  key={product.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.4, delay: index * 0.07 }}
                  className={`group min-w-0 overflow-hidden rounded-2xl border transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-3xl ${colors.card}`}
                >
                  <Link
                    to={`/product/${product.id}`}
                    className="relative block overflow-hidden"
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="h-36 w-full object-cover transition duration-500 group-hover:scale-105 min-[480px]:h-44 sm:h-52"
                      />
                    ) : (
                      <div className="flex h-36 w-full items-center justify-center bg-[#eef2e8] text-[#47784a] min-[480px]:h-44 sm:h-52">
                        <ShoppingBasket size={42} />
                      </div>
                    )}

                    {product.featured && (
                      <span className="absolute left-3 top-3 rounded-full bg-[#f7f8f1]/95 px-3 py-1.5 text-xs font-bold text-[#203b2b]">
                        Featured
                      </span>
                    )}
                  </Link>

                  <div className="p-3 min-[480px]:p-4 sm:p-5">
                    <p className="text-xs font-semibold text-[#629467]">
                      {product.category}
                    </p>

                    <Link to={`/product/${product.id}`}>
                      <h3 className="mt-2 line-clamp-2 min-h-10 text-sm font-bold leading-5 transition hover:text-[#629467] sm:min-h-0 sm:text-lg">
                        {product.name}
                      </h3>
                    </Link>

                    {product.unit && (
                      <p className={`mt-1 text-sm ${colors.muted}`}>
                        {product.unit}
                      </p>
                    )}

                    <div className="mt-4 flex flex-col items-stretch gap-2 min-[480px]:flex-row min-[480px]:items-center min-[480px]:justify-between sm:mt-5">
                      <p className="text-sm font-black min-[480px]:text-base sm:text-lg">
                        {formatPrice(product.price)}
                      </p>

                      <button
                        type="button"
                        onClick={() => handleAdd(product)}
                        disabled={!product.inStock}
                        className="w-full rounded-full bg-[#47784a] px-3 py-2.5 text-xs font-bold text-white transition hover:bg-[#38653c] disabled:cursor-not-allowed disabled:opacity-50 min-[480px]:w-auto min-[480px]:text-sm sm:px-4"
                      >
                        {!product.inStock
                          ? "Out of stock"
                          : addedProduct === product.id
                            ? "Added ✓"
                            : "+ Add"}
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      <OrderTrackingBanner theme={theme} />

      {/* Promotional banner */}

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 overflow-hidden rounded-[2rem] bg-[#203b2b] p-7 text-white sm:p-10 md:flex-row md:items-center lg:p-14">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c4d9b9]">
              Make shopping simpler
            </p>

            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
              Your everyday essentials are just a few clicks away.
            </h2>

            <p className="mt-4 max-w-xl leading-7 text-white/70">
              Browse our collection and find the items you need for your home.
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#dce9cf] px-6 py-4 text-sm font-bold text-[#203b2b] transition hover:bg-white"
          >
            Start shopping <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;
