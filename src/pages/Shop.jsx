import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ShoppingBag,
  X,
  Check,
  ChevronDown,
  PackageCheck,
  ArrowRight,
  LayoutGrid,
  Sparkles,
  Tag,
  Utensils,
} from "lucide-react";
import { motion } from "motion/react";

import { getActiveProducts } from "../services/productService";
import { getAllCategories } from "../services/categoryService";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(price) || 0);

const categoryVisuals = [
  "from-emerald-100 to-lime-50 text-emerald-800",
  "from-amber-100 to-orange-50 text-amber-800",
  "from-sky-100 to-cyan-50 text-sky-800",
  "from-rose-100 to-pink-50 text-rose-800",
  "from-violet-100 to-fuchsia-50 text-violet-800",
  "from-teal-100 to-green-50 text-teal-800",
];

const categoryEmoji = (name = "") => {
  const value = name.toLowerCase();

  if (
    value.includes("drink") ||
    value.includes("beverage") ||
    value.includes("water")
  )
    return "🥤";
  if (
    value.includes("snack") ||
    value.includes("biscuit") ||
    value.includes("sweet")
  )
    return "🍪";
  if (
    value.includes("fruit") ||
    value.includes("vegetable") ||
    value.includes("produce")
  )
    return "🥑";
  if (value.includes("oil")) return "🫒";
  if (value.includes("household") || value.includes("clean")) return "🧼";
  if (
    value.includes("rice") ||
    value.includes("grain") ||
    value.includes("food")
  )
    return "🍚";
  if (value.includes("personal") || value.includes("beauty")) return "🧴";
  if (value.includes("grocery") || value.includes("provision")) return "🛒";

  return "🧺";
};

function normalizeProduct(product, categories) {
  const rawCategory =
    product.categoryId ??
    (typeof product.category === "string"
      ? product.category
      : product.category?.id) ??
    "";

  const category = categories.find(
    (item) =>
      item.id === String(rawCategory) ||
      item.name?.toLowerCase() === String(rawCategory).toLowerCase() ||
      item.name?.toLowerCase() ===
        String(product.categoryName || "").toLowerCase(),
  );

  const categoryName =
    product.categoryName ||
    product.category?.name ||
    category?.name ||
    (typeof product.category === "string" ? product.category : "") ||
    "Other";

  const image =
    product.image ||
    product.imageUrl ||
    product.imageURL ||
    (Array.isArray(product.images) ? product.images[0] : "") ||
    "";

  const stockValue =
    product.stock ?? product.quantityInStock ?? product.inventory;
  const inStock =
    typeof product.inStock === "boolean"
      ? product.inStock
      : typeof stockValue === "number"
        ? stockValue > 0
        : true;

  return {
    ...product,
    id: product.id,
    productId: product.id,
    name: String(product.name || product.title || "Unnamed product"),
    price: Number(product.price) || 0,
    categoryName,
    // Prefer the Firestore category document ID for reliable filtering.
    categoryId: category?.id || String(rawCategory || ""),
    image,
    unit: product.unit || product.size || product.packaging || "",
    featured: Boolean(product.featured),
    inStock,
  };
}

function Shop({ theme = "light", onAddToCart }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [adminCategories, setAdminCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const selectedCategory = searchParams.get("category") || "all";
  const isDark = theme === "dark";

  const colors = {
    text: isDark ? "text-[#f4f5ef]" : "text-[#203b2b]",
    muted: isDark ? "text-[#b8c6b5]" : "text-[#6b7968]",
    card: isDark ? "border-white/10 bg-[#202a22]" : "border-[#e5e9df] bg-white",
    input: isDark
      ? "border-white/10 bg-[#202a22] text-[#f4f5ef] placeholder:text-[#93a293]"
      : "border-[#dfe5d9] bg-white text-[#203b2b] placeholder:text-[#8b9788]",
    panel: isDark
      ? "border-white/10 bg-[#19251d]"
      : "border-[#dce5d9] bg-[#f5f8f1]",
  };

  useEffect(() => {
    let isMounted = true;

    async function loadShopData() {
      try {
        setLoadingProducts(true);
        setProductsError("");

        const [productData, categoryData] = await Promise.all([
          getActiveProducts(),
          getAllCategories(),
        ]);

        if (!isMounted) return;

        const activeCategories = (
          Array.isArray(categoryData) ? categoryData : []
        )
          .filter((category) => category?.isActive === true)
          .map((category) => ({
            ...category,
            id: String(category.id),
            name: String(category.name || "Unnamed category"),
          }));

        setAdminCategories(activeCategories);
        setProducts(
          (Array.isArray(productData) ? productData : []).map((product) =>
            normalizeProduct(product, activeCategories),
          ),
        );
      } catch (error) {
        console.error("Failed to load shop data:", error);
        if (isMounted) {
          setProductsError(
            "We couldn't load the shop right now. Please refresh and try again.",
          );
        }
      } finally {
        if (isMounted) setLoadingProducts(false);
      }
    }

    loadShopData();

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const categoryItems = adminCategories.map((category, index) => ({
      ...category,
      emoji: category.emoji || categoryEmoji(category.name),
      visual: categoryVisuals[index % categoryVisuals.length],
      count: products.filter(
        (product) =>
          product.categoryId === category.id ||
          product.categoryName.toLowerCase() === category.name.toLowerCase(),
      ).length,
    }));

    return [
      {
        id: "all",
        name: "All products",
        emoji: "🛍️",
        count: products.length,
        visual: "from-[#dcebd8] to-[#f2f7ed] text-[#2f6b3b]",
      },
      ...categoryItems,
    ];
  }, [adminCategories, products]);

  const filteredProducts = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    const result = products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" ||
        product.categoryId === selectedCategory ||
        adminCategories.some(
          (category) =>
            category.id === selectedCategory &&
            category.name.toLowerCase() === product.categoryName.toLowerCase(),
        );

      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm) ||
        product.categoryName.toLowerCase().includes(searchTerm) ||
        String(product.description || "")
          .toLowerCase()
          .includes(searchTerm);

      const matchesStock = !inStockOnly || product.inStock;

      return matchesCategory && matchesSearch && matchesStock;
    });

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      result.sort((a, b) => Number(b.featured) - Number(a.featured));
    }

    return result;
  }, [
    products,
    selectedCategory,
    search,
    sortBy,
    inStockOnly,
    adminCategories,
  ]);

  function selectCategory(categoryId) {
    const nextParams = new URLSearchParams(searchParams);

    if (categoryId === "all") {
      nextParams.delete("category");
    } else {
      nextParams.set("category", categoryId);
    }

    setSearchParams(nextParams);
  }

  function resetFilters() {
    setSearch("");
    setInStockOnly(false);
    setSortBy("recommended");
    setSearchParams({});
  }

  const activeCategoryName =
    categories.find((category) => category.id === selectedCategory)?.name ||
    "All products";

  return (
    <main
      className={`min-h-screen px-4 py-8 sm:px-6 sm:py-12 lg:px-8 ${colors.text}`}
    >
      <div className="mx-auto max-w-7xl">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#173d28] via-[#285b38] to-[#47784a] px-6 py-9 text-white shadow-lg sm:px-10 sm:py-12"
        >
          <div className="pointer-events-none absolute -right-8 -top-12 h-48 w-48 rounded-full border-[28px] border-white/5 sm:h-64 sm:w-64" />
          <div className="pointer-events-none absolute -bottom-16 right-1/4 h-40 w-40 rounded-full bg-lime-200/10 blur-2xl" />
          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em]">
              <Sparkles size={14} />
              The JK3 Foods collection
            </span>
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Your everyday essentials,
              <span className="block text-[#d9edb8]">all in one place.</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
              Shop your favourites, discover something new, and get the things
              your home needs without the stress.
            </p>
            <a
              href="#shop-products"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#203b2b] transition hover:bg-[#eaf2e3]"
            >
              Browse products <ArrowRight size={16} />
            </a>
          </div>
        </motion.header>

        <div
          className={`mb-8 flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 ${colors.panel}`}
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#629467]/15 text-[#629467]">
              <PackageCheck size={21} />
            </div>
            <div>
              <h2 className={`text-sm font-bold ${colors.text}`}>
                Already ordered from us?
              </h2>
              <p className={`mt-1 text-sm leading-6 ${colors.muted}`}>
                Use your unique order number to track your order.
              </p>
            </div>
          </div>
          <Link
            to="/track-order"
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-[#2f6b3b] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#255831] sm:self-center"
          >
            Track order <ArrowRight size={15} />
          </Link>
        </div>

        <section aria-labelledby="categories-heading" className="mb-10">
          <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#629467]">
                Find what you need
              </p>
              <h2
                id="categories-heading"
                className="mt-1 text-2xl font-black sm:text-3xl"
              >
                Shop by category
              </h2>
              <p className={`mt-1 text-sm ${colors.muted}`}>
                Choose a category to narrow down the collection.
              </p>
            </div>
            <span className={`text-xs ${colors.muted}`}>
              {adminCategories.length}{" "}
              {adminCategories.length === 1 ? "category" : "categories"}{" "}
              available
            </span>
          </div>

          {loadingProducts ? (
            <div className="flex gap-3 overflow-hidden pb-2">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className={`h-28 min-w-36 animate-pulse rounded-2xl border ${colors.card}`}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {categories.map((category, index) => {
                const active = selectedCategory === category.id;

                return (
                  <motion.button
                    key={category.id}
                    type="button"
                    onClick={() => selectCategory(category.id)}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    aria-pressed={active}
                    className={`group relative overflow-hidden rounded-2xl border p-3 text-left transition sm:p-4 ${
                      active
                        ? "border-[#47784a] bg-[#47784a] text-white shadow-md shadow-[#47784a]/15"
                        : `${colors.card} hover:border-[#8bb58b] hover:shadow-md`
                    }`}
                  >
                    <div
                      className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl transition group-hover:scale-105 ${
                        active ? "from-white/20 to-white/10" : category.visual
                      }`}
                    >
                      {category.id === "all" ? (
                        <LayoutGrid size={22} />
                      ) : (
                        <span aria-hidden="true">{category.emoji}</span>
                      )}
                    </div>
                    <p className="line-clamp-2 text-sm font-bold leading-5">
                      {category.name}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span
                        className={`text-xs ${active ? "text-white/75" : colors.muted}`}
                      >
                        {category.count}{" "}
                        {category.count === 1 ? "item" : "items"}
                      </span>
                      {active ? (
                        <Check size={15} />
                      ) : (
                        <ArrowRight
                          size={14}
                          className="opacity-40 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                        />
                      )}
                    </div>
                    {active && (
                      <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-[#d9edb8]" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          )}
        </section>

        <section id="shop-products" className="scroll-mt-24">
          <div className="relative mb-6">
            <Search
              size={20}
              className={`absolute left-4 top-1/2 -translate-y-1/2 ${colors.muted}`}
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products, categories or descriptions..."
              className={`w-full rounded-2xl border py-4 pl-12 pr-12 text-sm outline-none transition focus:border-[#629467] focus:ring-4 focus:ring-[#629467]/10 ${colors.input}`}
            />
            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <Tag size={17} className="text-[#629467]" />
                <h2 className="text-lg font-black sm:text-xl">
                  {activeCategoryName}
                </h2>
              </div>
              <p className={`mt-1 text-sm ${colors.muted}`}>
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "product" : "products"} found
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label
                className={`flex items-center gap-2 text-sm ${colors.muted}`}
              >
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(event) => setInStockOnly(event.target.checked)}
                  className="h-4 w-4 accent-[#47784a]"
                />
                In stock only
              </label>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSortOpen((open) => !open)}
                  aria-expanded={sortOpen}
                  aria-haspopup="listbox"
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                    isDark
                      ? "border-white/10 bg-[#202a22] text-[#f4f5ef] hover:border-[#629467]"
                      : "border-[#dfe5d9] bg-white text-[#203b2b] hover:border-[#629467]"
                  }`}
                >
                  <ArrowUpDown size={17} className="text-[#629467]" />
                  <span className={colors.muted}>Sort:</span>
                  <span>
                    {
                      {
                        recommended: "Recommended",
                        "price-low": "Price: low to high",
                        "price-high": "Price: high to low",
                        name: "Name: A–Z",
                      }[sortBy]
                    }
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {sortOpen && (
                  <>
                    <button
                      type="button"
                      aria-label="Close sort menu"
                      className="fixed inset-0 z-20 cursor-default"
                      onClick={() => setSortOpen(false)}
                    />
                    <div
                      role="listbox"
                      aria-label="Sort products"
                      className={`absolute right-0 top-full z-30 mt-2 w-60 overflow-hidden rounded-2xl border p-1.5 shadow-xl ${
                        isDark
                          ? "border-white/10 bg-[#202a22] text-[#f4f5ef]"
                          : "border-[#e5e9df] bg-white text-[#203b2b]"
                      }`}
                    >
                      {[
                        { value: "recommended", label: "Recommended" },
                        { value: "price-low", label: "Price: low to high" },
                        { value: "price-high", label: "Price: high to low" },
                        { value: "name", label: "Name: A–Z" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          role="option"
                          aria-selected={sortBy === option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            setSortOpen(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm transition ${
                            sortBy === option.value
                              ? isDark
                                ? "bg-[#47784a]/25 font-semibold text-[#a9d6a8]"
                                : "bg-[#e6eddf] font-semibold text-[#203b2b]"
                              : isDark
                                ? "hover:bg-white/5"
                                : "hover:bg-[#f3f6ef]"
                          }`}
                        >
                          {option.label}
                          {sortBy === option.value && (
                            <Check size={16} className="text-[#629467]" />
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {loadingProducts ? (
            <div
              className={`rounded-3xl border p-12 text-center ${colors.card}`}
            >
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#629467]/20 border-t-[#629467]" />
              <p className={`mt-4 text-sm ${colors.muted}`}>
                Loading products...
              </p>
            </div>
          ) : productsError ? (
            <div
              className={`rounded-3xl border p-12 text-center ${colors.card}`}
            >
              <ShoppingBag className="mx-auto text-[#629467]" size={38} />
              <h2 className="mt-4 text-xl font-bold">The shop couldn't load</h2>
              <p className={`mt-2 text-sm ${colors.muted}`}>{productsError}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-5 rounded-full bg-[#47784a] px-5 py-3 text-sm font-bold text-white hover:bg-[#38653c]"
              >
                Try again
              </button>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product, index) => (
                <motion.article
                  key={product.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: Math.min(index * 0.035, 0.25),
                  }}
                  className={`group overflow-hidden rounded-2xl border transition hover:-translate-y-1 hover:shadow-xl sm:rounded-3xl ${colors.card}`}
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
                        className="h-36 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-52"
                      />
                    ) : (
                      <div className="flex h-36 items-center justify-center bg-gradient-to-br from-[#edf4e8] to-[#f9fbf6] text-[#47784a] sm:h-52">
                        <Utensils size={36} />
                      </div>
                    )}
                    {product.featured && (
                      <span className="absolute left-2 top-2 rounded-full bg-[#e6eddf] px-2.5 py-1 text-[10px] font-bold text-[#203b2b] sm:left-3 sm:top-3 sm:px-3 sm:py-1.5 sm:text-xs">
                        Featured
                      </span>
                    )}
                    {!product.inStock && (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/50 px-2 text-center text-xs font-bold text-white sm:text-sm">
                        Out of stock
                      </span>
                    )}
                  </Link>

                  <div className="p-3 sm:p-5">
                    <p className="truncate text-[10px] font-bold uppercase tracking-wide text-[#629467] sm:text-xs">
                      {product.categoryName}
                    </p>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="mt-1.5 line-clamp-2 min-h-10 text-sm font-bold leading-5 transition hover:text-[#629467] sm:mt-2 sm:min-h-0 sm:text-lg">
                        {product.name}
                      </h3>
                    </Link>
                    {product.unit && (
                      <p
                        className={`mt-1 line-clamp-1 text-xs ${colors.muted} sm:text-sm`}
                      >
                        {product.unit}
                      </p>
                    )}
                    <div className="mt-4 flex flex-col gap-2 sm:mt-5 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm font-black sm:text-lg">
                        {formatPrice(product.price)}
                      </p>
                      <button
                        type="button"
                        disabled={!product.inStock}
                        onClick={() =>
                          onAddToCart?.({
                            ...product,
                            productId: product.id,
                            variantId: "default",
                          })
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#47784a] px-3 py-2.5 text-xs font-bold text-white transition hover:bg-[#38653c] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-4 sm:text-sm"
                      >
                        <ShoppingBag size={15} />
                        Add to cart
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div
              className={`rounded-3xl border p-10 text-center sm:p-12 ${colors.card}`}
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#629467]/10 text-[#629467]">
                <ShoppingBag size={32} />
              </div>
              <h2 className="mt-4 text-xl font-bold">No products found</h2>
              <p
                className={`mx-auto mt-2 max-w-md text-sm leading-6 ${colors.muted}`}
              >
                {products.length === 0
                  ? "There are no active products available right now."
                  : "Try another search or choose a different category."}
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 rounded-full bg-[#47784a] px-5 py-3 text-sm font-bold text-white hover:bg-[#38653c]"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Shop;
