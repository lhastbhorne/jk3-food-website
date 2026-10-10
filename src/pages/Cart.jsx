import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  PackageCheck,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useCart } from "../context/CartContext";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);

function Cart({ theme = "light" }) {
  const { items, cartCount, subtotal, updateQuantity, removeFromCart } =
    useCart();

  const isDark = theme === "dark";

  const colors = {
    text: isDark ? "text-[#f4f5ef]" : "text-[#203b2b]",
    muted: isDark ? "text-[#b8c6b5]" : "text-[#6b7968]",
    card: isDark ? "border-white/10 bg-[#202a22]" : "border-[#e5e9df] bg-white",
    surface: isDark ? "bg-[#1b261e]" : "bg-[#eef2e8]",
    trackingSurface: isDark ? "bg-[#19251d]" : "bg-[#edf2e8]",
    trackingBorder: isDark ? "border-white/10" : "border-[#dce5d9]",
  };

  // Reusable order-tracking section
  function OrderTrackingPrompt() {
    return (
      <section
        className={`rounded-2xl border p-5 sm:p-6 ${colors.trackingSurface} ${colors.trackingBorder}`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#629467]/15 text-[#629467]">
              <PackageCheck size={23} />
            </div>

            <div>
              <h2 className={`font-bold ${colors.text}`}>
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
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-[#2f6b3b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#255831] focus:outline-none focus:ring-2 focus:ring-[#629467] focus:ring-offset-2 sm:self-center"
          >
            Track order
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    );
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <main
        className={`min-h-screen px-4 py-10 sm:px-6 sm:py-14 lg:px-8 ${colors.text}`}
      >
        <div className="mx-auto max-w-4xl">
          <div className="flex min-h-[45vh] flex-col items-center justify-center px-5 text-center">
            <div className={`rounded-full p-6 ${colors.surface}`}>
              <ShoppingBag size={38} className="text-[#629467]" />
            </div>

            <h1 className="mt-6 text-3xl font-black">Your cart is empty</h1>

            <p className={`mt-3 max-w-md leading-7 ${colors.muted}`}>
              Your next shopping trip starts here. Browse our products and add
              something you need.
            </p>

            <Link
              to="/shop"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-[#47784a] px-7 py-4 font-bold text-white transition hover:bg-[#38653c]"
            >
              <ShoppingBag size={18} />
              Start shopping
            </Link>
          </div>

          <div className="mt-8">
            <OrderTrackingPrompt />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      className={`min-h-screen px-4 py-10 sm:px-6 sm:py-14 lg:px-8 ${colors.text}`}
    >
      <div className="mx-auto max-w-7xl">
        {/* Continue shopping */}
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#629467] transition hover:underline"
        >
          <ArrowLeft size={17} />
          Continue shopping
        </Link>

        {/* Page heading */}
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#629467]">
              Your selections
            </p>

            <h1 className="mt-2 text-4xl font-black sm:text-5xl">
              Shopping cart
            </h1>
          </div>

          <p className={colors.muted}>
            {cartCount} {cartCount === 1 ? "item" : "items"}
          </p>
        </div>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1fr_350px]">
          {/* Cart items */}
          <div className="space-y-4">
            {items.map((item) => (
              <article
                key={item.id}
                className={`flex flex-col gap-4 rounded-3xl border p-4 sm:flex-row sm:items-center sm:p-5 ${colors.card}`}
              >
                {/* Product image */}
                <div className="h-28 w-full shrink-0 overflow-hidden rounded-2xl sm:w-28">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      className={`flex h-full items-center justify-center ${colors.surface}`}
                    >
                      <ShoppingBag size={30} className="text-[#629467]" />
                    </div>
                  )}
                </div>

                {/* Product information */}
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-bold">{item.name}</h2>

                  {item.size && (
                    <p className={`mt-1 text-sm ${colors.muted}`}>
                      Size: {item.size}
                    </p>
                  )}

                  <p className="mt-2 text-sm font-semibold text-[#629467]">
                    {formatPrice(item.price)} each
                  </p>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm text-red-500 transition hover:text-red-600"
                  >
                    <Trash2 size={15} />
                    Remove
                  </button>
                </div>

                {/* Quantity and item total */}
                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                  <div
                    className={`flex items-center rounded-full border p-1 ${colors.card}`}
                  >
                    <button
                      type="button"
                      aria-label={`Decrease ${item.name} quantity`}
                      disabled={item.quantity <= 1}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="rounded-full p-2 transition hover:bg-[#47784a]/10 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="min-w-9 text-center text-sm font-bold">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      aria-label={`Increase ${item.name} quantity`}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="rounded-full p-2 transition hover:bg-[#47784a]/10"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <p className="text-lg font-black">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* Order summary */}
          <aside
            className={`rounded-3xl border p-6 lg:sticky lg:top-28 ${colors.card}`}
          >
            <h2 className="text-xl font-black">Order summary</h2>

            <div
              className={`mt-6 flex justify-between gap-4 text-sm ${colors.muted}`}
            >
              <span>Subtotal ({cartCount} items)</span>
              <span className={colors.text}>{formatPrice(subtotal)}</span>
            </div>

            <div
              className={`mt-4 flex justify-between gap-4 text-sm ${colors.muted}`}
            >
              <span>Delivery</span>
              <span className="text-right">Calculated at checkout</span>
            </div>

            <div className="my-5 border-t border-[#8b9d85]/25" />

            <div className="flex items-center justify-between gap-4">
              <span className="font-bold">Total before delivery</span>

              <span className="text-xl font-black text-[#629467]">
                {formatPrice(subtotal)}
              </span>
            </div>

            <Link
              to="/checkout"
              className="mt-6 flex w-full items-center justify-center rounded-full bg-[#47784a] px-6 py-4 font-bold text-white transition hover:bg-[#38653c]"
            >
              Proceed to checkout
            </Link>

            <p className={`mt-4 text-center text-xs leading-5 ${colors.muted}`}>
              Delivery fees and the final total will be confirmed at checkout.
            </p>
          </aside>
        </div>

        {/* Existing customer tracking */}
        <div className="mt-10">
          <OrderTrackingPrompt />
        </div>
      </div>
    </main>
  );
}

export default Cart;
