import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useCart } from "../context/CartContext";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "Lagos",
  deliveryInstructions: "",
};

function Checkout({ theme = "light" }) {
  const { items, cartCount, subtotal } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const isDark = theme === "dark";

  const colors = {
    text: isDark ? "text-[#f4f5ef]" : "text-[#203b2b]",
    muted: isDark ? "text-[#b8c6b5]" : "text-[#6b7968]",
    card: isDark ? "border-white/10 bg-[#202a22]" : "border-[#e5e9df] bg-white",
    input: isDark
      ? "border-white/10 bg-[#18221a] text-[#f4f5ef] placeholder:text-[#849181]"
      : "border-[#dfe5d9] bg-white text-[#203b2b] placeholder:text-[#92998d]",
    surface: isDark ? "bg-[#1b261e]" : "bg-[#eef2e8]",
  };

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
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

    if (!form.address.trim()) {
      nextErrors.address = "Please enter your delivery address.";
    }

    if (!form.city.trim()) {
      nextErrors.city = "Please enter your city or town.";
    }

    if (!form.state.trim()) {
      nextErrors.state = "Please enter your state.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) return;

    // Demo only: no order is created and no payment is taken here.
    setSubmitted(true);
  }

  if (items.length === 0) {
    return (
      <main
        className={`flex min-h-[65vh] flex-col items-center justify-center px-5 text-center ${colors.text}`}
      >
        <ShoppingBag size={42} className="text-[#629467]" />

        <h1 className="mt-5 text-3xl font-black">Your cart is empty</h1>

        <p className={`mt-3 ${colors.muted}`}>
          Add some products before proceeding to checkout.
        </p>

        <Link
          to="/shop"
          className="mt-6 rounded-full bg-[#47784a] px-6 py-3 font-bold text-white"
        >
          Browse products
        </Link>
      </main>
    );
  }

  if (submitted) {
    return (
      <main
        className={`flex min-h-[70vh] items-center justify-center px-4 py-12 ${colors.text}`}
      >
        <div
          className={`w-full max-w-xl rounded-3xl border p-7 text-center sm:p-10 ${colors.card}`}
        >
          <CheckCircle2 size={54} className="mx-auto text-[#629467]" />

          <h1 className="mt-5 text-3xl font-black">Details validated!</h1>

          <p className={`mt-4 leading-7 ${colors.muted}`}>
            Your checkout details have passed the initial form validation. We
            haven't created an order or processed a payment yet.
          </p>

          <div className={`mt-6 rounded-2xl p-5 text-left ${colors.surface}`}>
            <p className="text-sm font-bold">Delivery to</p>
            <p className="mt-2">{form.fullName}</p>
            <p className={`mt-1 text-sm ${colors.muted}`}>
              {form.address}, {form.city}, {form.state}
            </p>
            <p className={`mt-1 text-sm ${colors.muted}`}>{form.phone}</p>
            <div className="my-4 border-t border-[#8b9d85]/25" />
            <div className="flex justify-between gap-4">
              <span className={colors.muted}>Order subtotal</span>
              <span className="font-bold">{formatPrice(subtotal)}</span>
            </div>
          </div>

          <p className={`mt-4 text-xs leading-5 ${colors.muted}`}>
            Payment, delivery charges, and order confirmation will be connected
            in the next integration stage.
          </p>

          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="mt-7 rounded-full border border-[#8b9d85]/40 px-6 py-3 font-bold transition hover:bg-[#47784a]/10"
          >
            Return to cart
          </button>
        </div>
      </main>
    );
  }

  function fieldClass(name) {
    return `mt-2 w-full rounded-xl border px-4 py-3.5 text-sm outline-none transition focus:border-[#629467] ${
      errors[name] ? "border-red-500" : colors.input
    }`;
  }

  return (
    <main
      className={`min-h-screen px-4 py-10 sm:px-6 sm:py-14 lg:px-8 ${colors.text}`}
    >
      <div className="mx-auto max-w-7xl">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#629467] hover:underline"
        >
          <ArrowLeft size={17} />
          Back to cart
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

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-10 grid items-start gap-8 lg:grid-cols-[1fr_380px]"
        >
          {/* Customer information */}
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
                    required
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
                    required
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
                    required
                  />
                  {errors.phone && (
                    <p className="mt-1.5 text-sm text-red-500">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Delivery address */}
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
                    required
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
                      required
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
                      required
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

          {/* Order summary */}
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
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl ${colors.surface}`}
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ShoppingBag size={22} className="text-[#629467]" />
                      </div>
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
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="my-6 border-t border-[#8b9d85]/25" />

            <div
              className={`flex justify-between gap-4 text-sm ${colors.muted}`}
            >
              <span>Subtotal</span>
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
              <span className="font-bold">Order subtotal</span>
              <span className="text-xl font-black text-[#629467]">
                {formatPrice(subtotal)}
              </span>
            </div>

            <button
              type="submit"
              className="mt-7 w-full rounded-full bg-[#47784a] px-6 py-4 font-bold text-white transition hover:bg-[#38653c]"
            >
              Review delivery details
            </button>

            <div
              className={`mt-5 flex items-start gap-2 text-xs leading-5 ${colors.muted}`}
            >
              <ShieldCheck
                size={17}
                className="mt-0.5 shrink-0 text-[#629467]"
              />
              <p>
                Your details will be used to prepare your order. Payment
                processing will be added after the secure checkout backend is
                configured.
              </p>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}

export default Checkout;
