import { useMemo, useState } from "react";
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
} from "lucide-react";
import { motion } from "motion/react";

const categories = [
  { id: "all", name: "All products" },
  { id: "groceries", name: "Groceries" },
  { id: "provisions", name: "Provisions" },
  { id: "drinks", name: "Drinks" },
  { id: "snacks", name: "Snacks" },
  { id: "household", name: "Household" },
];

const products = [
  {
    id: "rice",
    name: "Premium Rice",
    categoryId: "groceries",
    categoryName: "Groceries",
    price: 85000,
    unit: "50 kg bag",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=700&q=85",
    featured: true,
    inStock: true,
  },
  {
    id: "oil",
    name: "Cooking Oil",
    categoryId: "groceries",
    categoryName: "Groceries",
    price: 12500,
    unit: "5 litres",
    image:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=700&q=85",
    featured: true,
    inStock: true,
  },
  {
    id: "tomato",
    name: "Tomato Paste",
    categoryId: "provisions",
    categoryName: "Provisions",
    price: 4500,
    unit: "Carton",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=85",
    featured: false,
    inStock: true,
  },
  {
    id: "cereal",
    name: "Breakfast Cereal",
    categoryId: "provisions",
    categoryName: "Provisions",
    price: 6500,
    unit: "Pack",
    image:
      "https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?auto=format&fit=crop&w=700&q=85",
    featured: true,
    inStock: true,
  },
  {
    id: "drink",
    name: "Fruit Drink",
    categoryId: "drinks",
    categoryName: "Drinks",
    price: 1800,
    unit: "Bottle",
    image:
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=700&q=85",
    featured: false,
    inStock: true,
  },
  {
    id: "biscuits",
    name: "Crunchy Biscuits",
    categoryId: "snacks",
    categoryName: "Snacks",
    price: 1200,
    unit: "Pack",
    image:
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=700&q=85",
    featured: false,
    inStock: true,
  },
  {
    id: "detergent",
    name: "Laundry Detergent",
    categoryId: "household",
    categoryName: "Household",
    price: 3500,
    unit: "Pack",
    image:
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=700&q=85",
    featured: false,
    inStock: true,
  },
  {
    id: "tomatoes",
    name: "Fresh Tomatoes",
    categoryId: "groceries",
    categoryName: "Groceries",
    price: 2500,
    unit: "Basket",
    image:
      "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=700&q=85",
    featured: false,
    inStock: true,
  },
];

const formatPrice = (price) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);

function Shop({ theme = "light", onAddToCart }) {
  const [searchParams, setSearchParams] = useSearchParams();

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
      ? "border-white/10 bg-[#202a22] text-[#f4f5ef]"
      : "border-[#dfe5d9] bg-white text-[#203b2b]",
  };

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" || product.categoryId === selectedCategory;

      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.categoryName.toLowerCase().includes(search.toLowerCase());

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
  }, [selectedCategory, search, sortBy, inStockOnly]);

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

  return (
    <main
      className={`min-h-screen px-4 py-10 sm:px-6 sm:py-14 lg:px-8 ${colors.text}`}
    >
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="mb-9">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#629467]">
            The JK3 Foods collection
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Shop our products
          </h1>

          <p className={`mt-3 max-w-xl leading-7 ${colors.muted}`}>
            Find your everyday groceries, provisions, drinks, snacks and
            household essentials.
          </p>
        </div>

        {/* Existing customer order tracking */}
        <div
          className={`mb-8 flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 ${
            isDark
              ? "border-white/10 bg-[#19251d]"
              : "border-[#dce5d9] bg-[#edf2e8]"
          }`}
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
                Use the unique order number sent to your email to track your
                order.
              </p>
            </div>
          </div>

          <Link
            to="/track-order"
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-[#2f6b3b] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#255831] sm:self-center"
          >
            Track order
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-7">
          <Search
            size={20}
            className={`absolute left-4 top-1/2 -translate-y-1/2 ${colors.muted}`}
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search for products or categories..."
            className={`w-full rounded-2xl border py-4 pl-12 pr-12 text-sm outline-none transition focus:border-[#629467] ${colors.input}`}
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

        {/* Category filters */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <SlidersHorizontal size={17} />
            <h2 className="text-sm font-bold">Categories</h2>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => {
              const active = selectedCategory === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => selectCategory(category.id)}
                  className={`shrink-0 rounded-full border px-5 py-3 text-sm font-semibold transition ${
                    active
                      ? "border-[#47784a] bg-[#47784a] text-white"
                      : isDark
                        ? "border-white/10 hover:border-[#629467]"
                        : "border-[#dfe5d9] bg-white hover:border-[#629467]"
                  }`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results and sorting */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="font-bold">
              {selectedCategory === "all"
                ? "All products"
                : categories.find((item) => item.id === selectedCategory)
                    ?.name || "Products"}
            </p>
            <p className={`mt-1 text-sm ${colors.muted}`}>
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"} found
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
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
                  className={`transition-transform duration-200 ${
                    sortOpen ? "rotate-180" : ""
                  }`}
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

        {/* Product grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product, index) => (
              <motion.article
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                className={`group overflow-hidden rounded-3xl border transition hover:-translate-y-1 hover:shadow-xl ${colors.card}`}
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

                  {product.featured && (
                    <span className="absolute left-3 top-3 rounded-full bg-[#e6eddf] px-3 py-1.5 text-xs font-bold text-[#203b2b]">
                      Featured
                    </span>
                  )}

                  {!product.inStock && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/50 font-bold text-white">
                      Out of stock
                    </span>
                  )}
                </Link>

                <div className="p-5">
                  <p className="text-xs font-semibold text-[#629467]">
                    {product.categoryName}
                  </p>

                  <Link to={`/product/${product.id}`}>
                    <h3 className="mt-2 text-lg font-bold hover:text-[#629467]">
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
                      disabled={!product.inStock}
                      onClick={() => onAddToCart?.(product)}
                      className="flex items-center gap-2 rounded-full bg-[#47784a] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#38653c] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <ShoppingBag size={16} />
                      Add
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className={`rounded-3xl border p-12 text-center ${colors.card}`}>
            <ShoppingBag className="mx-auto text-[#629467]" size={38} />
            <h2 className="mt-4 text-xl font-bold">No products found</h2>
            <p className={`mt-2 text-sm ${colors.muted}`}>
              Try another search or change your filters.
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
      </div>
    </main>
  );
}

export default Shop;
