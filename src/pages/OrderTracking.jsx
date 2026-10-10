import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock3,
  MapPin,
  Package,
  Search,
  ShoppingBag,
  Truck,
} from "lucide-react";

const ORDER_STAGES = [
  {
    label: "Order Placed",
    description: "Your order has been received.",
    icon: ShoppingBag,
  },
  {
    label: "Confirmed",
    description: "Your order has been confirmed.",
    icon: CheckCircle2,
  },
  {
    label: "Processing",
    description: "Your items are being prepared.",
    icon: Package,
  },
  {
    label: "Out for Delivery",
    description: "Your order is on its way.",
    icon: Truck,
  },
  {
    label: "Delivered",
    description: "Your order has been delivered.",
    icon: CheckCircle2,
  },
];

// Demonstration data only. These are not real customer orders.
const SAMPLE_ORDERS = [
  {
    orderNumber: "JK3-2026-001",
    status: "Out for Delivery",
    orderDate: "October 8, 2026",
    customerName: "Sample Customer",
    deliveryAddress: "Ikeja, Lagos, Nigeria",
    items: [
      {
        id: "rice",
        name: "Premium Rice",
        size: "50 kg bag",
        quantity: 1,
        price: 85000,
      },
      {
        id: "oil",
        name: "Cooking Oil",
        size: "5 litres",
        quantity: 2,
        price: 12500,
      },
    ],
  },
  {
    orderNumber: "JK3-2026-002",
    status: "Delivered",
    orderDate: "October 6, 2026",
    customerName: "Sample Customer",
    deliveryAddress: "Yaba, Lagos, Nigeria",
    items: [
      {
        id: "cereal",
        name: "Breakfast Cereal",
        size: "Family pack",
        quantity: 2,
        price: 6500,
      },
    ],
  },
];

function OrderTracking({ theme = "light" }) {
  const isDark = theme === "dark";

  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState(null);
  const [searched, setSearched] = useState(false);

  const headingColor = isDark ? "text-white" : "text-[#203b2b]";

  const textColor = isDark ? "text-[#c7d3c9]" : "text-[#526657]";

  const cardStyle = isDark
    ? "border-white/10 bg-[#19251d]"
    : "border-[#dce5d9] bg-white";

  const inputStyle = `w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-[#629467] focus:ring-2 focus:ring-[#629467]/20 ${
    isDark
      ? "border-white/10 bg-[#101812] text-white placeholder:text-gray-500"
      : "border-[#dce5d9] bg-white text-[#203b2b] placeholder:text-gray-400"
  }`;

  function handleTrackOrder(event) {
    event.preventDefault();

    const normalizedNumber = orderNumber.trim().toUpperCase();

    if (!normalizedNumber) {
      setOrder(null);
      setSearched(true);
      return;
    }

    const matchingOrder = SAMPLE_ORDERS.find(
      (item) => item.orderNumber.toUpperCase() === normalizedNumber,
    );

    setOrder(matchingOrder ?? null);
    setSearched(true);
  }

  const currentStage = order
    ? ORDER_STAGES.findIndex((stage) => stage.label === order.status)
    : -1;

  const subtotal = order
    ? order.items.reduce((total, item) => total + item.price * item.quantity, 0)
    : 0;

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
      {/* Back link */}
      <Link
        to="/"
        className={`mb-8 inline-flex items-center gap-2 text-sm font-semibold transition hover:text-[#629467] ${textColor}`}
      >
        <ArrowLeft size={17} />
        Back to home
      </Link>

      {/* Heading */}
      <section className="mb-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#629467]/10 text-[#629467]">
          <Truck size={28} />
        </div>

        <h1
          className={`mt-5 text-3xl font-black tracking-tight sm:text-5xl ${headingColor}`}
        >
          Track Your Order
        </h1>

        <p
          className={`mx-auto mt-4 max-w-xl text-sm leading-7 sm:text-base ${textColor}`}
        >
          Enter your order number to check its progress and view your order
          details.
        </p>
      </section>

      {/* Tracking form */}
      <section
        className={`mx-auto max-w-3xl rounded-3xl border p-6 sm:p-8 ${cardStyle}`}
      >
        <form
          onSubmit={handleTrackOrder}
          className="flex flex-col gap-4 sm:flex-row"
        >
          <div className="min-w-0 flex-1">
            <label
              htmlFor="order-number"
              className={`mb-2 block text-sm font-semibold ${headingColor}`}
            >
              Order number
            </label>

            <input
              id="order-number"
              name="orderNumber"
              value={orderNumber}
              onChange={(event) => setOrderNumber(event.target.value)}
              placeholder="e.g. JK3-2026-001"
              className={inputStyle}
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 self-end rounded-xl bg-[#2f6b3b] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#255831] sm:min-h-[46px]"
          >
            <Search size={17} />
            Track order
          </button>
        </form>

        <p className={`mt-4 text-xs leading-5 ${textColor}`}>
          UI demo: try JK3-2026-001 or JK3-2026-002 to preview the tracking
          interface.
        </p>
      </section>

      {/* Invalid order */}
      {searched && !order && (
        <section
          role="status"
          className={`mx-auto mt-8 max-w-3xl rounded-2xl border border-amber-500/30 p-6 ${
            isDark ? "bg-amber-500/5" : "bg-amber-50"
          }`}
        >
          <h2 className={`font-bold ${headingColor}`}>
            We couldn't find that order
          </h2>

          <p className={`mt-2 text-sm leading-6 ${textColor}`}>
            Check the order number and try again. Only the sample order numbers
            listed above work in this demonstration. Real order lookup will be
            connected later.
          </p>
        </section>
      )}

      {/* Order results */}
      {order && (
        <div className="mx-auto mt-10 max-w-5xl space-y-8">
          {/* Order heading */}
          <section className={`rounded-3xl border p-6 sm:p-8 ${cardStyle}`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className={`text-sm ${textColor}`}>Order number</p>

                <h2 className={`mt-1 text-2xl font-black ${headingColor}`}>
                  {order.orderNumber}
                </h2>

                <p className={`mt-2 text-sm ${textColor}`}>
                  Placed on {order.orderDate}
                </p>
              </div>

              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#629467]/10 px-4 py-2 text-sm font-semibold text-[#629467]">
                <Clock3 size={16} />
                {order.status}
              </span>
            </div>
          </section>

          {/* Progress tracker */}
          <section className={`rounded-3xl border p-6 sm:p-8 ${cardStyle}`}>
            <h2 className={`text-xl font-bold ${headingColor}`}>
              Order progress
            </h2>

            <p className={`mt-2 text-sm ${textColor}`}>
              Follow the stages of your order.
            </p>

            <div className="mt-8">
              {ORDER_STAGES.map((stage, index) => {
                const StageIcon = stage.icon;
                const isComplete = index <= currentStage;
                const isCurrent = index === currentStage;

                return (
                  <div
                    key={stage.label}
                    className="relative flex gap-4 pb-8 last:pb-0"
                  >
                    {index < ORDER_STAGES.length - 1 && (
                      <div
                        className={`absolute left-[19px] top-10 h-[calc(100%-16px)] w-0.5 ${
                          index < currentStage
                            ? "bg-[#629467]"
                            : isDark
                              ? "bg-white/10"
                              : "bg-[#dce5d9]"
                        }`}
                      />
                    )}

                    <div
                      className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        isComplete
                          ? "bg-[#2f6b3b] text-white"
                          : isDark
                            ? "bg-white/5 text-gray-500"
                            : "bg-[#edf2e8] text-gray-400"
                      }`}
                    >
                      {isComplete ? (
                        <StageIcon size={19} />
                      ) : (
                        <Circle size={19} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1 pt-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className={`font-bold ${
                            isComplete ? headingColor : textColor
                          }`}
                        >
                          {stage.label}
                        </h3>

                        {isCurrent && (
                          <span className="rounded-full bg-[#629467]/10 px-2.5 py-1 text-xs font-semibold text-[#629467]">
                            Current status
                          </span>
                        )}
                      </div>

                      <p className={`mt-1 text-sm leading-6 ${textColor}`}>
                        {stage.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Delivery information */}
          <section className={`rounded-3xl border p-6 sm:p-8 ${cardStyle}`}>
            <div className="flex items-center gap-3">
              <MapPin size={22} className="text-[#629467]" />

              <h2 className={`text-xl font-bold ${headingColor}`}>
                Delivery information
              </h2>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <p className={`text-sm ${textColor}`}>Customer</p>

                <p className={`mt-2 font-semibold ${headingColor}`}>
                  {order.customerName}
                </p>
              </div>

              <div>
                <p className={`text-sm ${textColor}`}>Delivery address</p>

                <p className={`mt-2 font-semibold ${headingColor}`}>
                  {order.deliveryAddress}
                </p>
              </div>
            </div>
          </section>

          {/* Order items */}
          <section className={`rounded-3xl border p-6 sm:p-8 ${cardStyle}`}>
            <div className="flex items-center gap-3">
              <Package size={22} className="text-[#629467]" />

              <h2 className={`text-xl font-bold ${headingColor}`}>
                Items in your order
              </h2>
            </div>

            <div className="mt-6 divide-y divide-[#dce5d9] dark:divide-white/10">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-4 py-5 first:pt-0 last:pb-0"
                >
                  <div>
                    <h3 className={`font-semibold ${headingColor}`}>
                      {item.name}
                    </h3>

                    <p className={`mt-1 text-sm ${textColor}`}>
                      {item.size} · Qty: {item.quantity}
                    </p>
                  </div>

                  <p className={`shrink-0 text-sm font-bold ${headingColor}`}>
                    ₦{(item.price * item.quantity).toLocaleString("en-NG")}
                  </p>
                </div>
              ))}
            </div>

            <div
              className={`mt-6 flex items-center justify-between border-t pt-5 ${isDark ? "border-white/10" : "border-[#dce5d9]"}`}
            >
              <span className={`font-semibold ${headingColor}`}>
                Items subtotal
              </span>

              <span className={`text-xl font-black ${headingColor}`}>
                ₦{subtotal.toLocaleString("en-NG")}
              </span>
            </div>

            <p className={`mt-3 text-xs leading-5 ${textColor}`}>
              This demonstration does not include delivery fees or payment
              records.
            </p>
          </section>
        </div>
      )}

      {/* Bottom help section */}

      <section
        className={`mx-auto mt-12 max-w-3xl rounded-3xl border p-7 text-center shadow-sm sm:p-9 ${
          isDark
            ? "border-white/10 bg-[#19251d]"
            : "border-[#dce5d9] bg-[#edf2e8]"
        }`}
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#629467]/15 text-[#629467]">
          <Package size={24} />
        </div>

        <h2
          className={`mt-4 text-xl font-bold sm:text-2xl ${
            isDark ? "text-white" : "text-[#203b2b]"
          }`}
        >
          Need help with your order?
        </h2>

        <p
          className={`mx-auto mt-3 max-w-lg text-sm leading-7 sm:text-base ${
            isDark ? "text-[#d1ddd3]" : "text-[#46594a]"
          }`}
        >
          Have a question about your delivery or order status? Our team is here
          to help. Contact us for assistance with your enquiry.
        </p>

        <Link
          to="/contact"
          className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#2f6b3b] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#255831] focus:outline-none focus:ring-2 focus:ring-[#629467] focus:ring-offset-2 focus:ring-offset-[#edf2e8] dark:focus:ring-offset-[#19251d]"
        >
          Contact us
          <ArrowRight size={17} />
        </Link>
      </section>
    </main>
  );
}

export default OrderTracking;
