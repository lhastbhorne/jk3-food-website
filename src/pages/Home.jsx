import { useState } from "react";
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

const categories = [
  { id: "groceries", name: "Groceries", emoji: "🥬" },
  { id: "provisions", name: "Provisions", emoji: "🥫" },
  { id: "drinks", name: "Drinks", emoji: "🥤" },
  { id: "snacks", name: "Snacks", emoji: "🍪" },
  { id: "household", name: "Household", emoji: "🧼" },
];


const featuredProducts = [
  {
    id: "rice",
    variantId: "rice-50kg",
    name: "Premium Rice",
    category: "Groceries",
    price: 85000,
    unit: "50 kg bag",
    size: "50 kg",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=700&q=85",
    label: "Customer favourite",
  },
  {
    id: "oil",
    variantId: "oil-5l",
    name: "Cooking Oil",
    category: "Groceries",
    price: 12500,
    unit: "5 litres",
    size: "5 litres",
    image:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=700&q=85",
    label: "Everyday essential",
  },
  {
    id: "cereal",
    variantId: "cereal-large",
    name: "Breakfast Cereal",
    category: "Provisions",
    price: 6500,
    unit: "Family pack",
    size: "Family pack",
    image:
      "https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?auto=format&fit=crop&w=700&q=85",
    label: "Stock up",
  },
  {
    id: "biscuits",
    variantId: "default",
    name: "Crunchy Biscuits",
    category: "Snacks",
    price: 1200,
    unit: "Per pack",
    size: "Per pack",
    image:
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=700&q=85",
    label: "Something tasty",
  },
];


const formatPrice = (price) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);

function Home({ theme = "light", onAddToCart }) {
  const [addedProduct, setAddedProduct] = useState("");
  const isDark = theme === "dark";

  const colors = {
    text: isDark ? "text-[#f4f5ef]" : "text-[#203b2b]",
    muted: isDark ? "text-[#b8c6b5]" : "text-[#6b7968]",
    card: isDark ? "border-white/10 bg-[#202a22]" : "border-[#e5e9df] bg-white",
    surface: isDark ? "bg-[#1b261e]" : "bg-[#eef2e8]",
  };

  function handleAdd(product) {
    onAddToCart?.(product);
    setAddedProduct(product.id);
    window.setTimeout(() => setAddedProduct(""), 1600);
  }

  return (
    <main className={colors.text}>
      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d4dfce] bg-[#e6eddf] px-4 py-2 text-xs font-bold text-[#294b30]">
            <Leaf size={15} />
            YOUR EVERYDAY SHOPPING PARTNER
          </div>

          <h1 className="max-w-2xl text-5xl font-black leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            Good food.
            <br />
            <span className="text-[#629467]">Better living.</span>
          </h1>

          <p
            className={`mt-6 max-w-lg text-base leading-8 sm:text-lg ${colors.muted}`}
          >
            From groceries and provisions to household essentials, discover
            everyday products that make shopping simpler.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-[#47784a] px-7 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#38653c]"
            >
              Explore the shop <ArrowRight size={18} />
            </Link>

            <a
              href="#featured"
              className={`inline-flex items-center gap-2 rounded-full border px-7 py-4 text-sm font-bold transition ${
                isDark
                  ? "border-white/15 hover:bg-white/5"
                  : "border-[#dce2d5] hover:bg-white"
              }`}
            >
              Featured products
            </a>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-3 border-t border-[#8b9d85]/20 pt-6">
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
              className="h-[340px] w-full object-cover sm:h-[440px] lg:h-[520px]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#17251a]/75 via-transparent to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 text-white sm:bottom-8 sm:left-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#dce9cf]">
                Welcome to JK3 Foods
              </p>
              <h2 className="mt-3 max-w-sm text-3xl font-bold leading-tight sm:text-4xl">
                Stock your home with the good stuff.
              </h2>
            </div>

            <div className="absolute right-5 top-5 flex h-20 w-20 flex-col items-center justify-center rounded-full bg-[#f7f8f1] text-center text-[#203b2b] shadow-lg sm:right-7 sm:top-7">
              <Leaf size={19} />
              <span className="mt-1 text-[9px] font-extrabold uppercase tracking-wider">
                Shop better
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Categories */}
      <section className={`${colors.surface} px-4 py-12 sm:px-6 lg:px-8`}>
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

          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
              >
                <Link
                  to={`/shop?category=${category.id}`}
                  className={`group flex min-h-36 flex-col justify-between rounded-2xl border p-5 transition duration-300 hover:-translate-y-1 hover:border-[#629467] ${
                    colors.card
                  }`}
                >
                  <span className="text-3xl">{category.emoji}</span>
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
        </div>
      </section>

      {/* Featured products */}
      <section
        id="featured"
        className="scroll-mt-24 px-4 py-14 sm:px-6 sm:py-20 lg:px-8"
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

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product, index) => (
              <motion.article
                key={product.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
                className={`group overflow-hidden rounded-3xl border transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  colors.card
                }`}
              >
                <Link
                  to={`/product/${product.id}`}
                  className="relative block overflow-hidden"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <span className="absolute left-3 top-3 rounded-full bg-[#f7f8f1]/95 px-3 py-1.5 text-xs font-bold text-[#203b2b]">
                    {product.label}
                  </span>
                </Link>

                <div className="p-5">
                  <p className="text-xs font-semibold text-[#629467]">
                    {product.category}
                  </p>

                  <Link to={`/product/${product.id}`}>
                    <h3 className="mt-2 text-lg font-bold transition hover:text-[#629467]">
                      {product.name}
                    </h3>
                  </Link>

                  <p className={`mt-1 text-sm ${colors.muted}`}>
                    {product.unit}
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <p className="text-lg font-black">
                      {formatPrice(product.price)}
                    </p>

                    <button
                      type="button"
                      onClick={() => handleAdd(product)}
                      className="rounded-full bg-[#47784a] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#38653c]"
                    >
                      {addedProduct === product.id ? "Added ✓" : "+ Add"}
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
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
