import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  LoaderCircle,
  MapPin,
  MessageCircle,
  Package,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { getProductById } from "../services/productService";
import { createOrder } from "../services/orderService";

const WHATSAPP_BUSINESS_NUMBER =
  import.meta.env.VITE_WHATSAPP_BUSINESS_NUMBER || "";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(Number(price) || 0);

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "Lagos",
  deliveryInstructions: "",
};

function normalizeStock(product) {
  const value = product.stock ?? product.quantityInStock ?? product.inventory;
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function Checkout({ theme = "light" }) {
  const { items, cartCount, subtotal, clearCart } = useCart();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [pageError, setPageError] = useState("");
  const [savedOrder, setSavedOrder] = useState(null);
  const [whatsappError, setWhatsappError] = useState("");

  const isDark = theme === "dark";

  const colors = {
    text: isDark ? "text-[#f4f5ef]" : "text-[#203b2b]",
    muted: isDark ? "text-[#b8c6b5]" : "text-[#6b7968]",
    card: isDark ? "border-white/10 bg-[#202a22]" : "border-[#e5e9df] bg-white",
    input: isDark
      ? "border-white/10 bg-[#18221a] text-[#f4f5ef] placeholder:text-[#849181]"
      : "border-[#dfe5d9] bg-white text-[#203b2b] placeholder:text-[#92998d]",
    surface: isDark ? "bg-[#1b261e]" : "bg-[#eef2e8]",
    panel: isDark
      ? "border-white/10 bg-[#19251d]"
      : "border-[#dce5d9] bg-[#edf2e8]",
  };

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setPageError("");
  }

  function validateForm() {
    const nextErrors = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName = "Please enter your full name.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    const phoneDigits = form.phone.replace(/\D/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      nextErrors.phone = "Enter a valid phone number.";
    }

    if (!form.address.trim())
      nextErrors.address = "Please enter your delivery address.";
    if (!form.city.trim()) nextErrors.city = "Please enter your city or town.";
    if (!form.state.trim()) nextErrors.state = "Please enter your state.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting || !validateForm()) return;

    if (!items.length) {
      setPageError("Your cart is empty. Add products before checking out.");
      return;
    }

    setSubmitting(true);
    setPageError("");
    setWhatsappError("");

    try {
      // Re-fetch every product so the order uses current Firestore prices and stock.
      const verifiedItems = await Promise.all(
        items.map(async (item) => {
          const productId = item.productId || item.id;
          if (!productId) {
            throw new Error(
              `We couldn't identify "${item.name}" in your cart. Remove it and add it again.`,
            );
          }

          const product = await getProductById(productId);
          if (!product) {
            throw new Error(
              `"${item.name}" is no longer available. Please update your cart.`,
            );
          }

          if (product.isActive !== true) {
            throw new Error(
              `"${product.name || item.name}" is currently unavailable. Please remove it from your cart.`,
            );
          }

          const price = Number(product.price);
          const quantity = Number(item.quantity);
          const stock = normalizeStock(product);

          if (
            !Number.isFinite(price) ||
            price < 0 ||
            !Number.isInteger(quantity) ||
            quantity < 1
          ) {
            throw new Error(
              `We couldn't verify the price or quantity for "${product.name || item.name}".`,
            );
          }

          if (stock !== null && quantity > stock) {
            throw new Error(
              `Only ${stock} unit(s) of "${product.name || item.name}" are currently available. Please update your cart.`,
            );
          }

          return {
            productId: product.id || productId,
            name: String(product.name || product.title || item.name),
            price,
            quantity,
          };
        }),
      );

      const verifiedSubtotal = verifiedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      const deliveryAddress = [
        form.address.trim(),
        form.city.trim(),
        form.state.trim(),
      ].join(", ");

      const notes = [
        form.deliveryInstructions.trim()
          ? `Delivery instructions: ${form.deliveryInstructions.trim()}`
          : "",
        "Delivery fee: To be confirmed by JK3 Foods.",
      ]
        .filter(Boolean)
        .join("\n");

      const order = await createOrder({
        customerName: form.fullName.trim(),
        customerEmail: form.email.trim(),
        customerPhone: form.phone.trim(),
        deliveryAddress,
        notes,
        items: verifiedItems,
        subtotal: verifiedSubtotal,
        deliveryFee: 0,
        total: verifiedSubtotal,
      });

      // Only clear the cart once Firestore has successfully saved the order.
      setSavedOrder({
        ...order,
        customerName: order.customerName || form.fullName.trim(),
        customerEmail: order.customerEmail || form.email.trim(),
        customerPhone: order.customerPhone || form.phone.trim(),
        deliveryAddress: order.deliveryAddress || deliveryAddress,
        items: order.items || verifiedItems,
        subtotal: Number(order.subtotal ?? verifiedSubtotal),
        total: Number(order.total ?? verifiedSubtotal),
        notes: order.notes || notes,
      });
      clearCart();
    } catch (error) {
      console.error("Checkout failed:", error);
      setPageError(
        error?.message ||
          "We couldn't save your order. Please check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function openWhatsApp() {
    setWhatsappError("");
    const businessNumber = WHATSAPP_BUSINESS_NUMBER.replace(/\D/g, "");

    if (!businessNumber || businessNumber.includes("XXXXXXXXXX")) {
      setWhatsappError(
        "WhatsApp isn't configured yet. Add the business number to VITE_WHATSAPP_BUSINESS_NUMBER in your .env.local file, then restart the development server.",
      );
      return;
    }

    if (!savedOrder) return;

    const message = [
      "Hello JK3 Foods! 👋",
      "",
      "I'd like to place an order. Please find my order details below.",
      "",
      "*ORDER DETAILS*",
      `Order Reference: ${savedOrder.orderNumber || savedOrder.id || "Saved order"}`,
      "",
      "*CUSTOMER INFORMATION*",
      `Name: ${savedOrder.customerName}`,
      `Phone: ${savedOrder.customerPhone}`,
      `Email: ${savedOrder.customerEmail}`,
      `Delivery Address: ${savedOrder.deliveryAddress}`,
      "",
      "*ITEMS ORDERED*",
      ...savedOrder.items.map(
        (item, index) =>
          `${index + 1}. ${item.name} x ${item.quantity} — ${formatPrice(item.price * item.quantity)}`,
      ),
      "",
      "*PAYMENT SUMMARY*",
      `Subtotal: ${formatPrice(savedOrder.subtotal)}`,
      "Delivery Fee: To be confirmed",
      `*Total before delivery: ${formatPrice(savedOrder.total)}*`,
      ...(savedOrder.notes ? ["", "*ADDITIONAL NOTES*", savedOrder.notes] : []),
      "",
      "Please confirm product availability and the delivery fee before finalizing my order.",
      "",
      "Thank you! 😊",
    ];

    const url = `https://wa.me/${businessNumber}?text=${encodeURIComponent(message.join("\n"))}`;
    const popup = window.open(url, "_blank", "noopener,noreferrer");

    if (!popup) {
      setWhatsappError(
        "Your browser blocked the WhatsApp window. Allow pop-ups or use the button again.",
      );
    }
  }

  function fieldClass(name) {
    return `mt-2 w-full rounded-xl border px-4 py-3.5 text-sm outline-none transition focus:border-[#629467] focus:ring-2 focus:ring-[#629467]/20 ${
      errors[name] ? "border-red-500" : colors.input
    }`;
  }

  if (items.length === 0 && !savedOrder) {
    return (
      <main
        className={`flex min-h-[65vh] flex-col items-center justify-center px-5 text-center ${colors.text}`}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#629467]/10 text-[#629467]">
          <ShoppingBag size={34} />
        </div>
        <h1 className="mt-5 text-3xl font-black">Your cart is empty</h1>
        <p className={`mt-3 max-w-md leading-7 ${colors.muted}`}>
          Add some products before proceeding to checkout.
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#47784a] px-6 py-3 font-bold text-white transition hover:bg-[#38653c]"
        >
          Browse products <ArrowRight size={17} />
        </Link>
      </main>
    );
  }

  if (savedOrder) {
    return (
      <main
        className={`flex min-h-[70vh] items-center justify-center px-4 py-12 ${colors.text}`}
      >
        <section
          className={`w-full max-w-xl rounded-3xl border p-6 text-center shadow-sm sm:p-10 ${colors.card}`}
        >
          <CheckCircle2 size={58} className="mx-auto text-emerald-500" />
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#629467]">
            Order saved
          </p>
          <h1 className="mt-2 text-3xl font-black">
            Thank you, {savedOrder.customerName.split(" ")[0]}!
          </h1>
          <p className={`mt-3 leading-7 ${colors.muted}`}>
            Thank you for your order! 🎉 Your order details are ready.
            Continue to WhatsApp to send your order to JK3 Foods. We'll confirm
            product availability and delivery details with you shortly.
          </p>

          <div className={`mt-6 rounded-2xl p-5 text-left ${colors.surface}`}>
            <p className={`text-xs font-semibold ${colors.muted}`}>
              YOUR ORDER REFERENCE
            </p>
            <p className="mt-1 break-all text-xl font-black text-[#629467]">
              {savedOrder.orderNumber || savedOrder.id || "Order saved"}
            </p>
            <div className="my-4 border-t border-[#8b9d85]/25" />
            <div className="flex justify-between gap-4 text-sm">
              <span className={colors.muted}>Items</span>
              <span className="font-semibold">
                {savedOrder.items.reduce(
                  (sum, item) => sum + Number(item.quantity || 0),
                  0,
                )}
              </span>
            </div>
            <div className="mt-3 flex justify-between gap-4 text-sm">
              <span className={colors.muted}>Subtotal</span>
              <span className="font-semibold">
                {formatPrice(savedOrder.subtotal)}
              </span>
            </div>
            <div className="mt-3 flex justify-between gap-4 text-sm">
              <span className={colors.muted}>Delivery fee</span>
              <span className="font-semibold">To be confirmed</span>
            </div>
            <div className="my-4 border-t border-[#8b9d85]/25" />
            <div className="flex justify-between gap-4">
              <span className="font-bold">Total before delivery</span>
              <span className="text-lg font-black text-[#629467]">
                {formatPrice(savedOrder.total)}
              </span>
            </div>
          </div>

          {whatsappError && (
            <div className="mt-4 flex gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-left text-sm text-amber-700">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <p>{whatsappError}</p>
            </div>
          )}

          <button
            type="button"
            onClick={openWhatsApp}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3.5 font-bold text-white transition hover:bg-emerald-700"
          >
            <MessageCircle size={19} />
            Send order through WhatsApp
          </button>
          <p className={`mt-3 text-xs leading-5 ${colors.muted}`}>
            Your order is saved even if WhatsApp doesn't open. Sending the
            message is a separate step.
          </p>
          <Link
            to="/track-order"
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#629467] hover:underline"
          >
            Track your order <ArrowRight size={15} />
          </Link>
          <div>
            <Link
              to="/shop"
              className={`mt-4 inline-block text-sm ${colors.muted} hover:underline`}
            >
              Continue shopping
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main
      className={`min-h-screen px-4 py-8 sm:px-6 sm:py-12 lg:px-8 ${colors.text}`}
    >
      <div className="mx-auto max-w-7xl">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#629467] hover:underline"
        >
          <ArrowLeft size={17} /> Back to cart
        </Link>

        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#629467]">
            Almost there
          </p>
          <h1 className="mt-2 text-4xl font-black sm:text-5xl">Checkout</h1>
          <p className={`mt-3 ${colors.muted}`}>
            Where should we deliver your order?
          </p>
        </div>

        <div
          className={`mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3 ${colors.panel}`}
        >
          <p className={`text-sm ${colors.muted}`}>Already placed an order?</p>
          <Link
            to="/track-order"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#629467] hover:underline"
          >
            Track your order <ArrowRight size={15} />
          </Link>
        </div>

        {pageError && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-3 rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-600"
          >
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
            <p>{pageError}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_380px]"
        >
          <div className="space-y-6">
            <section className={`rounded-3xl border p-5 sm:p-7 ${colors.card}`}>
              <div className="flex items-center gap-3">
                <div className={`rounded-xl p-3 ${colors.surface}`}>
                  <MapPin className="text-[#629467]" size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-black">Contact information</h2>
                  <p className={`mt-1 text-sm ${colors.muted}`}>
                    Tell us how to reach you.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="fullName" className="text-sm font-semibold">
                    Full name *
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    autoComplete="name"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={fieldClass("fullName")}
                    aria-invalid={Boolean(errors.fullName)}
                  />
                  {errors.fullName && (
                    <p className="mt-1.5 text-sm text-red-500">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="text-sm font-semibold">
                    Email address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={fieldClass("email")}
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-sm text-red-500">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="text-sm font-semibold">
                    Phone number *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="e.g. 08012345678"
                    className={fieldClass("phone")}
                    aria-invalid={Boolean(errors.phone)}
                  />
                  {errors.phone && (
                    <p className="mt-1.5 text-sm text-red-500">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section className={`rounded-3xl border p-5 sm:p-7 ${colors.card}`}>
              <div className="flex items-center gap-3">
                <div className={`rounded-xl p-3 ${colors.surface}`}>
                  <Truck className="text-[#629467]" size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-black">Delivery address</h2>
                  <p className={`mt-1 text-sm ${colors.muted}`}>
                    Enter where you want your items delivered.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <label htmlFor="address" className="text-sm font-semibold">
                    Street address *
                  </label>
                  <input
                    id="address"
                    name="address"
                    autoComplete="street-address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="House number, street name, area"
                    className={fieldClass("address")}
                    aria-invalid={Boolean(errors.address)}
                  />
                  {errors.address && (
                    <p className="mt-1.5 text-sm text-red-500">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="city" className="text-sm font-semibold">
                      City or town *
                    </label>
                    <input
                      id="city"
                      name="city"
                      autoComplete="address-level2"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Enter city or town"
                      className={fieldClass("city")}
                      aria-invalid={Boolean(errors.city)}
                    />
                    {errors.city && (
                      <p className="mt-1.5 text-sm text-red-500">
                        {errors.city}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="state" className="text-sm font-semibold">
                      State *
                    </label>
                    <input
                      id="state"
                      name="state"
                      autoComplete="address-level1"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="Enter state"
                      className={fieldClass("state")}
                      aria-invalid={Boolean(errors.state)}
                    />
                    {errors.state && (
                      <p className="mt-1.5 text-sm text-red-500">
                        {errors.state}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="deliveryInstructions"
                    className="text-sm font-semibold"
                  >
                    Delivery instructions{" "}
                    <span className={`font-normal ${colors.muted}`}>
                      (optional)
                    </span>
                  </label>
                  <textarea
                    id="deliveryInstructions"
                    name="deliveryInstructions"
                    rows={3}
                    value={form.deliveryInstructions}
                    onChange={handleChange}
                    placeholder="Nearby landmark or other helpful details"
                    className={fieldClass("deliveryInstructions")}
                  />
                </div>
              </div>
            </section>
          </div>

          <aside
            className={`rounded-3xl border p-5 sm:p-7 lg:sticky lg:top-28 ${colors.card}`}
          >
            <h2 className="text-xl font-black">Your order</h2>
            <p className={`mt-1 text-sm ${colors.muted}`}>
              {cartCount} {cartCount === 1 ? "item" : "items"}
            </p>

            <div className="mt-6 space-y-5">
              {items.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div
                    className={`flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl ${colors.surface}`}
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ShoppingBag size={22} className="text-[#629467]" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold">{item.name}</p>
                    {item.size && (
                      <p className={`mt-1 text-xs ${colors.muted}`}>
                        Size: {item.size}
                      </p>
                    )}
                    <p className={`mt-1 text-xs ${colors.muted}`}>
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-bold">
                    {formatPrice(Number(item.price) * Number(item.quantity))}
                  </p>
                </div>
              ))}
            </div>

            <div className="my-6 border-t border-[#8b9d85]/25" />
            <div
              className={`flex justify-between gap-4 text-sm ${colors.muted}`}
            >
              <span>Cart subtotal</span>
              <span className={colors.text}>{formatPrice(subtotal)}</span>
            </div>
            <div
              className={`mt-4 flex justify-between gap-4 text-sm ${colors.muted}`}
            >
              <span>Delivery fee</span>
              <span>To be confirmed</span>
            </div>
            <div className="my-5 border-t border-[#8b9d85]/25" />
            <div className="flex items-center justify-between gap-3">
              <span className="font-bold">Subtotal before delivery</span>
              <span className="text-xl font-black text-[#629467]">
                {formatPrice(subtotal)}
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting || items.length === 0}
              className="mt-7 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#47784a] px-6 py-4 font-bold text-white transition hover:bg-[#38653c] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <LoaderCircle size={19} className="animate-spin" /> Saving
                  your order...
                </>
              ) : (
                <>
                  <Package size={19} /> Place order
                </>
              )}
            </button>

            <div
              className={`mt-5 flex items-start gap-2 text-xs leading-5 ${colors.muted}`}
            >
              <ShieldCheck
                size={17}
                className="mt-0.5 shrink-0 text-[#629467]"
              />
              <p>
                Your order is saved before WhatsApp opens. Delivery charges must
                be confirmed by JK3 Foods. No online payment is taken here.
              </p>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}

export default Checkout;
