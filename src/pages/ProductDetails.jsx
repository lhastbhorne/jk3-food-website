import { useEffect, useState } from "react";
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
  PackageCheck,
  AlertCircle,
} from "lucide-react";
import { motion } from "motion/react";

import { getProductById } from "../services/productService";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(price) || 0);

function getProductImage(product) {
  return (
    product?.image ||
    product?.imageUrl ||
    product?.imageURL ||
    (Array.isArray(product?.images) ? product.images[0] : "") ||
    ""
  );
}

function normalizeProduct(result) {
  const stockValue = result.stock ?? result.quantityInStock ?? result.inventory;
  const stock =
    typeof stockValue === "number" && Number.isFinite(stockValue)
      ? stockValue
      : null;

  return {
    ...result,
    id: result.id,
    name: String(result.name || result.title || "Unnamed product"),
    price: Number(result.price),
    categoryName:
      result.categoryName ||
      result.category?.name ||
      (typeof result.category === "string" ? result.category : "") ||
      "JK3 Foods",
    description: String(result.description || "").trim(),
    image: getProductImage(result),
    unit: result.unit || result.size || result.packaging || "",
    stock,
    inStock:
      typeof result.inStock === "boolean"
        ? result.inStock
        : stock === null
          ? true
          : stock > 0,
    featured: Boolean(result.featured),
  };
}

function ProductDetails({ theme = "light", onAddToCart }) {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const isDark = theme === "dark";

  const colors = {
    text: isDark ? "text-[#f4f5ef]" : "text-[#203b2b]",
    muted: isDark ? "text-[#b8c6b5]" : "text-[#6b7968]",
    surface: isDark ? "bg-[#1b261e]" : "bg-[#eef2e8]",
    card: isDark ? "border-white/10 bg-[#202a22]" : "border-[#e5e9df] bg-white",
    subtle: isDark ? "bg-white/5" : "bg-[#f7f9f4]",
  };

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");
        setProduct(null);
        setQuantity(1);
        setAdded(false);

        const result = await getProductById(productId);

        if (!isMounted) return;

        if (!result) {
          setError("We couldn't find this product. It may have been removed.");
          return;
        }

        if (result.isActive !== true) {
          setError("This product is currently unavailable.");
          return;
        }

        const normalized = normalizeProduct(result);

        if (!Number.isFinite(normalized.price) || normalized.price < 0) {
          setError(
            "This product has an invalid price. Please contact JK3 Foods.",
          );
          return;
        }

        setProduct(normalized);
      } catch (err) {
        console.error("Failed to load product details:", err);

        if (isMounted) {
          setError(
            "We couldn't load this product right now. Please try again.",
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (productId) {
      loadProduct();
    } else {
      setError("No product was specified.");
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [productId]);

  const outOfStock = Boolean(product) && !product.inStock;
  const stock = product?.stock ?? null;

  const canAdd =
    Boolean(product) &&
    Number.isFinite(product.price) &&
    product.price >= 0 &&
    !outOfStock &&
    (stock === null || quantity <= stock);

  const subtotal = (product?.price || 0) * quantity;

  function handleAddToCart() {
    if (!canAdd || !product) return;

    onAddToCart?.({
      id: product.id,
      productId: product.id,
      variantId: "default",
      name: product.name,
      size: product.unit || "",
      price: product.price,
      image: product.image,
      quantity,
    });

    setAdded(true);
    // The button feedback resets on its own; no timer is needed for cart state.
    setTimeout(() => setAdded(false), 1800);
  }

  if (loading) {
    return (
      <main
        className={`flex min-h-[65vh] items-center justify-center px-5 ${colors.text}`}
      >
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#629467]/20 border-t-[#629467]" />
          <p className={`mt-4 text-sm ${colors.muted}`}>
            Loading product details...
          </p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    const unavailable = error === "This product is currently unavailable.";

    return (
      <main
        className={`flex min-h-[65vh] flex-col items-center justify-center px-5 text-center ${colors.text}`}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#629467]/10 text-[#629467]">
          {unavailable ? <AlertCircle size={34} /> : <ShoppingBag size={34} />}
        </div>
        <h1 className="mt-5 text-2xl font-black">
          {unavailable ? "Product unavailable" : "Product not found"}
        </h1>
        <p className={`mt-2 max-w-md leading-7 ${colors.muted}`}>
          {error || "This product could not be found."}
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#47784a] px-6 py-3 font-bold text-white transition hover:bg-[#38653c]"
        >
          <ArrowLeft size={17} />
          Return to shop
        </Link>
      </main>
    );
  }

  return (
    <main
      className={`min-h-screen px-4 py-8 sm:px-6 sm:py-12 lg:px-8 ${colors.text}`}
    >
      <div className="mx-auto max-w-7xl">
        <nav
          aria-label="Breadcrumb"
          className={`mb-7 flex flex-wrap items-center gap-2 text-sm ${colors.muted}`}
        >
          <Link to="/" className="transition hover:text-[#629467]">
            Home
          </Link>
          <ChevronRight size={15} />
          <Link to="/shop" className="transition hover:text-[#629467]">
            Shop
          </Link>
          <ChevronRight size={15} />
          <span className={`max-w-[55vw] truncate ${colors.text}`}>
            {product.name}
          </span>
        </nav>

        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-14">
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div
              className={`relative overflow-hidden rounded-[2rem] border ${colors.card}`}
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="aspect-square max-h-[680px] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-square max-h-[680px] w-full items-center justify-center bg-gradient-to-br from-[#edf4e8] to-[#f9fbf6] text-[#47784a]">
                  <ShoppingBag size={64} strokeWidth={1.5} />
                </div>
              )}

              {product.featured && (
                <span className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#203b2b] shadow-sm">
                  Featured product
                </span>
              )}

              {outOfStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/45">
                  <span className="rounded-full bg-white px-5 py-3 text-sm font-bold text-[#203b2b]">
                    Currently out of stock
                  </span>
                </div>
              )}
            </div>

            <div
              className={`mt-4 flex items-start gap-3 rounded-2xl p-4 sm:p-5 ${colors.surface}`}
            >
              <ShieldCheck
                className="mt-0.5 shrink-0 text-[#629467]"
                size={24}
              />
              <div>
                <p className="font-bold">Shop with confidence</p>
                <p className={`mt-1 text-sm leading-6 ${colors.muted}`}>
                  Product details and pricing are provided by JK3 Foods. If you
                  have a question about this item, contact us before ordering.
                </p>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="lg:pt-3"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#629467]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#629467]">
                {product.categoryName}
              </span>
              {product.inStock && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                  <Check size={13} />
                  In stock
                </span>
              )}
            </div>

            <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>

            {product.description ? (
              <p
                className={`mt-5 whitespace-pre-line text-sm leading-7 sm:text-base sm:leading-8 ${colors.muted}`}
              >
                {product.description}
              </p>
            ) : (
              <p className={`mt-5 text-sm leading-7 ${colors.muted}`}>
                A quality everyday essential from JK3 Foods.
              </p>
            )}

            <div
              className={`mt-7 rounded-2xl border p-5 sm:p-6 ${colors.card}`}
            >
              <p className={`text-sm ${colors.muted}`}>
                {product.unit ? `Price per ${product.unit}` : "Product price"}
              </p>
              <p className="mt-1 text-3xl font-black text-[#629467] sm:text-4xl">
                {formatPrice(product.price)}
              </p>
              <div
                className={`mt-4 flex flex-wrap items-center gap-2 text-sm ${outOfStock ? "text-red-500" : colors.muted}`}
              >
                <PackageCheck size={17} />
                {outOfStock
                  ? "This item is currently unavailable."
                  : stock !== null
                    ? `${stock} ${stock === 1 ? "unit" : "units"} available`
                    : "Available to order"}
              </div>
            </div>

            <section className="mt-7">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-bold">Quantity</h2>
                {stock !== null && (
                  <span className={`text-xs ${colors.muted}`}>
                    Maximum: {stock}
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-4">
                <div
                  className={`inline-flex items-center rounded-full border p-1 ${colors.card}`}
                >
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                    onClick={() =>
                      setQuantity((current) => Math.max(1, current - 1))
                    }
                    className="rounded-full p-2.5 transition hover:bg-[#47784a]/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Minus size={17} />
                  </button>
                  <span className="min-w-10 text-center font-bold">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    disabled={stock !== null && quantity >= stock}
                    onClick={() =>
                      setQuantity((current) =>
                        stock === null
                          ? current + 1
                          : Math.min(stock, current + 1),
                      )
                    }
                    className="rounded-full p-2.5 transition hover:bg-[#47784a]/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus size={17} />
                  </button>
                </div>

                <p className={`text-sm ${colors.muted}`}>
                  Subtotal:{" "}
                  <span className={`font-bold ${colors.text}`}>
                    {formatPrice(subtotal)}
                  </span>
                </p>
              </div>
            </section>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!canAdd}
              className="mt-7 flex w-full items-center justify-center gap-3 rounded-full bg-[#47784a] px-6 py-4 font-bold text-white shadow-sm transition hover:bg-[#38653c] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            >
              {added ? <Check size={20} /> : <ShoppingBag size={20} />}
              {added
                ? "Added to cart"
                : outOfStock
                  ? "Out of stock"
                  : "Add to cart"}
            </button>

            <div
              className={`mt-5 flex items-start gap-3 rounded-2xl p-4 ${colors.subtle} ${colors.muted}`}
            >
              <Truck size={20} className="mt-0.5 shrink-0 text-[#629467]" />
              <p className="text-sm leading-6">
                Delivery options and fees will be displayed during checkout.
              </p>
            </div>

            <Link
              to="/shop"
              className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#629467] transition hover:gap-3"
            >
              <ArrowLeft size={17} />
              Continue shopping
            </Link>
          </motion.section>
        </div>
      </div>
    </main>
  );
}

export default ProductDetails;
