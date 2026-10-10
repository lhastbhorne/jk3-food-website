import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Minus,
  Plus,
  ShoppingBag,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { motion } from "motion/react";

const sampleProducts = [
  {
    id: "rice",
    name: "Premium Rice",
    categoryId: "groceries",
    categoryName: "Groceries",
    description:
      "Quality rice for everyday meals and family occasions. Choose the pack size that suits your household.",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=85",
    variants: [
      { id: "rice-1kg", size: "1 kg", price: 2200, stock: 20 },
      { id: "rice-5kg", size: "5 kg", price: 10500, stock: 12 },
      { id: "rice-10kg", size: "10 kg", price: 20500, stock: 8 },
      { id: "rice-50kg", size: "50 kg", price: 85000, stock: 4 },
    ],
  },
  {
    id: "oil",
    name: "Cooking Oil",
    categoryId: "groceries",
    categoryName: "Groceries",
    description:
      "Cooking oil for your everyday kitchen needs. Select the available size before adding it to your cart.",
    image:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1200&q=85",
    variants: [
      { id: "oil-1l", size: "1 litre", price: 2800, stock: 18 },
      { id: "oil-3l", size: "3 litres", price: 7600, stock: 10 },
      { id: "oil-5l", size: "5 litres", price: 12500, stock: 6 },
    ],
  },
  {
    id: "cereal",
    name: "Breakfast Cereal",
    categoryId: "provisions",
    categoryName: "Provisions",
    description:
      "A convenient breakfast cupboard staple. Choose your preferred pack size.",
    image:
      "https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?auto=format&fit=crop&w=1200&q=85",
    variants: [
      { id: "cereal-small", size: "Small pack", price: 2500, stock: 15 },
      { id: "cereal-large", size: "Family pack", price: 6500, stock: 7 },
    ],
  },
];

const formatPrice = (price) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);

function ProductDetails({ theme = "light", onAddToCart }) {
  const { productId } = useParams();
  const isDark = theme === "dark";

  const product = sampleProducts.find((item) => item.id === productId);

  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const colors = {
    text: isDark ? "text-[#f4f5ef]" : "text-[#203b2b]",
    muted: isDark ? "text-[#b8c6b5]" : "text-[#6b7968]",
    surface: isDark ? "bg-[#1b261e]" : "bg-[#eef2e8]",
    card: isDark ? "border-white/10 bg-[#202a22]" : "border-[#e5e9df] bg-white",
  };

  if (!product) {
    return (
      <main
        className={`flex min-h-[65vh] flex-col items-center justify-center px-5 text-center ${colors.text}`}
      >
        <ShoppingBag size={42} className="text-[#629467]" />
        <h1 className="mt-5 text-2xl font-black">Product not found</h1>
        <p className={`mt-2 ${colors.muted}`}>
          This product may have been removed or the link may be incorrect.
        </p>
        <Link
          to="/shop"
          className="mt-6 rounded-full bg-[#47784a] px-6 py-3 font-bold text-white"
        >
          Return to shop
        </Link>
      </main>
    );
  }

  const selectedVariant =
    product.variants.find((variant) => variant.id === selectedVariantId) ??
    product.variants[0];

  const stock = selectedVariant.stock;
  const canAdd = stock > 0 && quantity <= stock;
  const total = selectedVariant.price * quantity;

  function handleAddToCart() {
    if (!canAdd) return;

    onAddToCart?.({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      size: selectedVariant.size,
      price: selectedVariant.price,
      image: product.image,
      quantity,
    });

    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  function changeVariant(variant) {
    setSelectedVariantId(variant.id);
    setQuantity(1);
    setAdded(false);
  }

  return (
    <main
      className={`min-h-screen px-4 py-8 sm:px-6 sm:py-12 lg:px-8 ${colors.text}`}
    >
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <nav
          className={`mb-8 flex flex-wrap items-center gap-2 text-sm ${colors.muted}`}
        >
          <Link to="/" className="transition hover:text-[#629467]">
            Home
          </Link>
          <ChevronRight size={15} />
          <Link to="/shop" className="transition hover:text-[#629467]">
            Shop
          </Link>
          <ChevronRight size={15} />
          <span className={colors.text}>{product.name}</span>
        </nav>

        {/* Product details */}
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div
              className={`overflow-hidden rounded-[2rem] border ${colors.card}`}
            >
              <img
                src={product.image}
                alt={product.name}
                className="aspect-square w-full object-cover"
              />
            </div>

            <div
              className={`mt-4 flex items-center gap-3 rounded-2xl p-4 ${colors.surface}`}
            >
              <ShieldCheck className="shrink-0 text-[#629467]" size={24} />
              <div>
                <p className="font-bold">Shop with confidence</p>
                <p className={`mt-1 text-sm ${colors.muted}`}>
                  Product availability and pricing are shown for your selected
                  size.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#629467]">
              {product.categoryName}
            </p>

            <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>

            <p className={`mt-5 leading-8 ${colors.muted}`}>
              {product.description}
            </p>

            {/* Dynamic price */}
            <div className={`mt-7 rounded-2xl p-5 ${colors.surface}`}>
              <p className={`text-sm ${colors.muted}`}>
                Price for {selectedVariant.size}
              </p>
              <motion.p
                key={selectedVariant.id}
                initial={{ opacity: 0.5, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-3xl font-black text-[#629467] sm:text-4xl"
              >
                {formatPrice(selectedVariant.price)}
              </motion.p>
              <p className={`mt-2 text-sm ${colors.muted}`}>
                {stock > 0 ? `${stock} available` : "Currently out of stock"}
              </p>
            </div>

            {/* Size selector */}
            <section className="mt-8">
              <h2 className="text-sm font-bold">Choose a size</h2>

              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {product.variants.map((variant) => {
                  const active = selectedVariant.id === variant.id;

                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => changeVariant(variant)}
                      aria-pressed={active}
                      className={`relative rounded-2xl border p-4 text-left transition ${
                        active
                          ? "border-[#47784a] bg-[#47784a]/10 ring-1 ring-[#47784a]"
                          : isDark
                            ? "border-white/10 hover:border-[#629467]"
                            : "border-[#dfe5d9] hover:border-[#629467]"
                      }`}
                    >
                      {active && (
                        <Check
                          size={16}
                          className="absolute right-3 top-3 text-[#629467]"
                        />
                      )}

                      <span className="block text-sm font-bold">
                        {variant.size}
                      </span>

                      <span className={`mt-2 block text-sm ${colors.muted}`}>
                        {formatPrice(variant.price)}
                      </span>

                      <span
                        className={`mt-2 block text-xs ${
                          variant.stock > 0 ? "text-[#629467]" : "text-red-500"
                        }`}
                      >
                        {variant.stock > 0 ? "In stock" : "Out of stock"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Quantity selector */}
            <section className="mt-8">
              <h2 className="text-sm font-bold">Quantity</h2>

              <div className="mt-3 flex flex-wrap items-center gap-4">
                <div
                  className={`flex items-center rounded-full border p-1 ${colors.card}`}
                >
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                    onClick={() =>
                      setQuantity((current) => Math.max(1, current - 1))
                    }
                    className="rounded-full p-2.5 transition hover:bg-[#47784a]/10 disabled:opacity-40"
                  >
                    <Minus size={17} />
                  </button>

                  <span className="min-w-10 text-center font-bold">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    aria-label="Increase quantity"
                    disabled={quantity >= stock}
                    onClick={() =>
                      setQuantity((current) => Math.min(stock, current + 1))
                    }
                    className="rounded-full p-2.5 transition hover:bg-[#47784a]/10 disabled:opacity-40"
                  >
                    <Plus size={17} />
                  </button>
                </div>

                <p className={`text-sm ${colors.muted}`}>
                  Subtotal:{" "}
                  <span className={`font-bold ${colors.text}`}>
                    {formatPrice(total)}
                  </span>
                </p>
              </div>
            </section>

            {/* Add to cart */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!canAdd}
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-full bg-[#47784a] px-6 py-4 font-bold text-white transition hover:bg-[#38653c] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {added ? <Check size={20} /> : <ShoppingBag size={20} />}
              {added
                ? "Added to cart"
                : stock <= 0
                  ? "Out of stock"
                  : !canAdd
                    ? "Quantity exceeds available stock"
                    : "Add to cart"}
            </button>

            <div
              className={`mt-5 flex items-start gap-3 text-sm ${colors.muted}`}
            >
              <Truck size={20} className="mt-0.5 shrink-0 text-[#629467]" />
              <p>
                Delivery options and fees will be displayed during checkout.
              </p>
            </div>

            <Link
              to="/shop"
              className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#629467] hover:underline"
            >
              <ArrowLeft size={17} /> Continue shopping
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetails;
