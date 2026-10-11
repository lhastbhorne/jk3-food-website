import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  Check,
  ChevronDown,
  Clock,
  Eye,
  LoaderCircle,
  MapPin,
  MessageCircle,
  Package,
  RefreshCw,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";

import {
  getAllOrders,
  updateOrderStatus,
  ORDER_STATUSES,
} from "../../services/orderService";

const STATUS_STYLES = {
  pending: {
    light: "bg-amber-50 text-amber-700 border-amber-200",
    dark: "bg-amber-400/10 text-amber-300 border-amber-400/20",
    dot: "bg-amber-500",
  },
  confirmed: {
    light: "bg-blue-50 text-blue-700 border-blue-200",
    dark: "bg-blue-400/10 text-blue-300 border-blue-400/20",
    dot: "bg-blue-500",
  },
  processing: {
    light: "bg-violet-50 text-violet-700 border-violet-200",
    dark: "bg-violet-400/10 text-violet-300 border-violet-400/20",
    dot: "bg-violet-500",
  },
  ready: {
    light: "bg-cyan-50 text-cyan-700 border-cyan-200",
    dark: "bg-cyan-400/10 text-cyan-300 border-cyan-400/20",
    dot: "bg-cyan-500",
  },
  completed: {
    light: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dark: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
    dot: "bg-emerald-500",
  },
  cancelled: {
    light: "bg-red-50 text-red-700 border-red-200",
    dark: "bg-red-400/10 text-red-300 border-red-400/20",
    dot: "bg-red-500",
  },
};

const formatStatus = (status = "pending") =>
  status.charAt(0).toUpperCase() + status.slice(1);

const formatMoney = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const formatDate = (timestamp) => {
  if (!timestamp) return "Date unavailable";

  const date =
    typeof timestamp.toDate === "function"
      ? timestamp.toDate()
      : new Date(timestamp);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const normalizeStatus = (status) =>
  ORDER_STATUSES.includes(status) ? status : "pending";

function StatusBadge({ status, theme }) {
  const dark = theme === "dark";
  const normalizedStatus = normalizeStatus(status);
  const styles = STATUS_STYLES[normalizedStatus];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${
        dark ? styles.dark : styles.light
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
      {formatStatus(normalizedStatus)}
    </span>
  );
}

/* Custom, theme-aware status dropdown. */
function StatusDropdown({ status, theme, disabled, onChange, label }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dark = theme === "dark";
  const currentStatus = normalizeStatus(status);
  const currentStyles = STATUS_STYLES[currentStatus];

  useEffect(() => {
    if (!open) return undefined;

    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`flex min-h-11 w-full items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-orange-500/30 disabled:cursor-not-allowed disabled:opacity-60 ${
          dark
            ? "border-[#34463a] bg-[#1b2920] text-[#f4f5ef] hover:bg-[#24352a]"
            : "border-stone-200 bg-white text-stone-800 hover:bg-stone-50"
        }`}
      >
        <span className="flex min-w-0 items-center gap-2">
          <span
            className={`h-2 w-2 shrink-0 rounded-full ${currentStyles.dot}`}
          />
          <span className="truncate">{formatStatus(currentStatus)}</span>
        </span>

        {disabled ? (
          <LoaderCircle
            size={16}
            className="shrink-0 animate-spin text-orange-500"
          />
        ) : (
          <ChevronDown
            size={16}
            className={`shrink-0 transition-transform ${
              open ? "rotate-180" : ""
            } ${dark ? "text-[#a5b5a7]" : "text-stone-400"}`}
          />
        )}
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Select order status"
          className={`absolute right-0 top-full z-40 mt-2 max-h-64 w-full min-w-48 overflow-y-auto rounded-xl border p-1.5 shadow-xl ${
            dark
              ? "border-[#34463a] bg-[#1b2920] shadow-black/30"
              : "border-stone-200 bg-white shadow-stone-900/10"
          }`}
        >
          {ORDER_STATUSES.map((option) => {
            const optionStyles = STATUS_STYLES[option];
            const selected = currentStatus === option;

            return (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  setOpen(false);
                  onChange(option);
                }}
                className={`flex min-h-10 w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
                  dark ? "hover:bg-[#2a3a2f]" : "hover:bg-stone-50"
                } ${selected ? (dark ? "bg-[#2a3a2f]" : "bg-stone-100") : ""}`}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${optionStyles.dot}`}
                  />
                  <span
                    className={`font-medium ${
                      dark ? "text-[#f4f5ef]" : "text-stone-700"
                    }`}
                  >
                    {formatStatus(option)}
                  </span>
                </span>

                {selected && (
                  <Check size={15} className="shrink-0 text-orange-500" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}


function CustomStatusFilter({ value, onChange, theme }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dark = theme === "dark";

  const options = [
    { value: "all", label: "All statuses" },
    ...ORDER_STATUSES.map((status) => ({
      value: status,
      label: formatStatus(status),
    })),
  ];

  const selected =
    options.find((option) => option.value === value) || options[0];

  useEffect(() => {
    if (!open) return undefined;

    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const selectedStyles =
    value === "all" ? null : STATUS_STYLES[normalizeStatus(value)];

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm font-semibold outline-none transition focus:ring-2 focus:ring-orange-500/30 ${
          dark
            ? "border-[#34463a] bg-[#17221b] text-[#f4f5ef] hover:bg-[#24352a]"
            : "border-stone-200 bg-stone-50 text-stone-800 hover:bg-stone-100"
        }`}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <span
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${
              selectedStyles?.dot || "bg-orange-500"
            }`}
          />
          <span className="truncate">{selected.label}</span>
        </span>

        <ChevronDown
          size={17}
          className={`shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          } ${dark ? "text-[#a5b5a7]" : "text-stone-400"}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Filter orders by status"
          className={`absolute right-0 top-full z-50 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border p-1.5 shadow-xl ${
            dark
              ? "border-[#34463a] bg-[#1b2920] shadow-black/30"
              : "border-stone-200 bg-white shadow-stone-900/10"
          }`}
        >
          {options.map((option) => {
            const isSelected = value === option.value;
            const styles =
              option.value === "all" ? null : STATUS_STYLES[option.value];

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                  dark ? "hover:bg-[#2a3a2f]" : "hover:bg-stone-50"
                } ${
                  isSelected ? (dark ? "bg-[#2a3a2f]" : "bg-stone-100") : ""
                }`}
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                      styles?.dot || "bg-orange-500"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      dark ? "text-[#f4f5ef]" : "text-stone-700"
                    }`}
                  >
                    {option.label}
                  </span>
                </span>

                {isSelected && (
                  <Check size={16} className="shrink-0 text-orange-500" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value, icon: Icon, iconStyle, theme, loading }) {
  const dark = theme === "dark";

  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm transition-colors ${
        dark ? "border-[#2b3c30] bg-[#1b2920]" : "border-stone-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <p
          className={`text-sm font-medium ${dark ? "text-[#a5b5a7]" : "text-stone-500"}`}
        >
          {label}
        </p>
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconStyle}`}
        >
          <Icon size={19} />
        </span>
      </div>

      <p
        className={`mt-4 text-3xl font-bold ${dark ? "text-[#f4f5ef]" : "text-stone-900"}`}
      >
        {loading ? "—" : value}
      </p>
    </div>
  );
}

export default function AdminOrders({ theme = "light" }) {
  const dark = theme === "dark";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState("");

  const pageBg = dark
    ? "bg-[#141d17] text-[#f4f5ef]"
    : "bg-[#f7f8f1] text-[#203b2b]";
  const cardBg = dark
    ? "border-[#2b3c30] bg-[#1b2920]"
    : "border-stone-200 bg-white";
  const mutedText = dark ? "text-[#a5b5a7]" : "text-stone-500";
  const headingText = dark ? "text-[#f4f5ef]" : "text-stone-900";
  const inputStyle = dark
    ? "border-[#34463a] bg-[#17221b] text-[#f4f5ef] placeholder:text-[#788b7c] focus:border-orange-500"
    : "border-stone-200 bg-stone-50 text-stone-800 placeholder:text-stone-400 focus:border-orange-400";

  const loadOrders = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const result = await getAllOrders();
      setOrders(result);
    } catch (err) {
      console.error("Failed to load orders:", err);
      setError(
        "We couldn't load the orders. Check your connection and Firestore permissions.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    if (!notification) return undefined;

    const timer = setTimeout(() => setNotification(null), 3500);
    return () => clearTimeout(timer);
  }, [notification]);

  const filteredOrders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      const searchableText = [
        order.orderNumber,
        order.customerName,
        order.customerPhone,
        order.deliveryAddress,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && searchableText.includes(term);
    });
  }, [orders, searchTerm, statusFilter]);

  const summary = useMemo(
    () => ({
      total: orders.length,
      pending: orders.filter((order) => order.status === "pending").length,
      processing: orders.filter((order) =>
        ["confirmed", "processing", "ready"].includes(order.status),
      ).length,
      completed: orders.filter((order) => order.status === "completed").length,
    }),
    [orders],
  );

  const handleStatusChange = async (orderId, nextStatus) => {
    if (!ORDER_STATUSES.includes(nextStatus)) return;

    const previousOrder = orders.find((order) => order.id === orderId);

    if (!previousOrder || previousOrder.status === nextStatus) return;

    setUpdatingOrderId(orderId);
    setNotification(null);

    try {
      await updateOrderStatus(orderId, nextStatus);

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId ? { ...order, status: nextStatus } : order,
        ),
      );

      setSelectedOrder((currentOrder) =>
        currentOrder?.id === orderId
          ? { ...currentOrder, status: nextStatus }
          : currentOrder,
      );

      setNotification({
        type: "success",
        message: `Order ${previousOrder.orderNumber || ""} updated to ${formatStatus(nextStatus)}.`,
      });
    } catch (err) {
      console.error("Failed to update order:", err);

      setNotification({
        type: "error",
        message: "Couldn't update the order status. Please try again.",
      });
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const openWhatsApp = (order) => {
    const phone = String(order.customerPhone || "").replace(/\D/g, "");

    if (!phone) {
      setNotification({
        type: "error",
        message: "This order doesn't have a valid phone number.",
      });
      return;
    }

    const message = [
      `Hello ${order.customerName || "Customer"},`,
      "",
      `We're contacting you about your JK3 Foods order ${order.orderNumber || ""}.`,
      `Current status: ${formatStatus(order.status || "pending")}.`,
      "",
      "Thank you for choosing JK3 Foods!",
    ].join("\n");

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const searchAndFilter = (
    <div className={`rounded-2xl border p-4 shadow-sm sm:p-5 ${cardBg}`}>
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${mutedText}`}
          />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search order number, customer or phone..."
            className={`min-h-12 w-full rounded-xl border py-3 pl-11 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-orange-500/20 ${inputStyle}`}
          />
        </div>

        <div className="relative lg:w-56">
          <CustomStatusFilter
            value={statusFilter}
            onChange={setStatusFilter}
            theme={theme}
          />
        </div>
      </div>

      <p className={`mt-3 text-xs ${mutedText}`}>
        Showing {filteredOrders.length} of {orders.length} orders
      </p>
    </div>
  );

  return (
    <div
      className={`min-h-screen px-4 py-6 transition-colors duration-200 sm:px-6 lg:px-8 ${pageBg}`}
    >
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold text-orange-500">
              JK3 Foods Admin
            </p>
            <h1
              className={`text-2xl font-bold tracking-tight sm:text-3xl ${headingText}`}
            >
              Order Management
            </h1>
            <p className={`mt-2 max-w-2xl text-sm ${mutedText}`}>
              View customer orders, follow their progress and keep customers
              informed.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadOrders(true)}
            disabled={loading || refreshing}
            className={`inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl border px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto ${
              dark
                ? "border-[#34463a] bg-[#1b2920] text-[#f4f5ef] hover:bg-[#24352a]"
                : "border-stone-200 bg-white text-stone-700 hover:bg-stone-100"
            }`}
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Refresh orders
          </button>
        </div>

        {/* Notifications */}
        {notification && (
          <div
            role="status"
            className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
              notification.type === "success"
                ? dark
                  ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                  : "border-emerald-200 bg-emerald-50 text-emerald-800"
                : dark
                  ? "border-red-400/20 bg-red-400/10 text-red-300"
                  : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {notification.type === "success" ? (
              <Check size={19} className="mt-0.5 shrink-0" />
            ) : (
              <AlertCircle size={19} className="mt-0.5 shrink-0" />
            )}
            <p className="flex-1">{notification.message}</p>
            <button
              type="button"
              onClick={() => setNotification(null)}
              aria-label="Dismiss notification"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Total orders"
            value={summary.total}
            icon={ShoppingBag}
            iconStyle="bg-orange-400/15 text-orange-500"
            theme={theme}
            loading={loading}
          />
          <SummaryCard
            label="Awaiting confirmation"
            value={summary.pending}
            icon={Clock}
            iconStyle="bg-amber-400/15 text-amber-500"
            theme={theme}
            loading={loading}
          />
          <SummaryCard
            label="In progress"
            value={summary.processing}
            icon={Package}
            iconStyle="bg-violet-400/15 text-violet-500"
            theme={theme}
            loading={loading}
          />
          <SummaryCard
            label="Completed"
            value={summary.completed}
            icon={Check}
            iconStyle="bg-emerald-400/15 text-emerald-500"
            theme={theme}
            loading={loading}
          />
        </div>

        {searchAndFilter}

        {/* Orders list */}
        <div
          className={`overflow-visible rounded-2xl border shadow-sm ${cardBg}`}
        >
          <div
            className={`flex items-center justify-between border-b px-5 py-4 sm:px-6 ${
              dark ? "border-[#2b3c30]" : "border-stone-100"
            }`}
          >
            <h2 className={`font-bold ${headingText}`}>Customer orders</h2>
            <span className={`text-xs ${mutedText}`}>
              {filteredOrders.length} found
            </span>
          </div>

          {loading ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 px-6 text-center">
              <LoaderCircle
                size={30}
                className="animate-spin text-orange-500"
              />
              <p className={`text-sm ${mutedText}`}>Loading orders...</p>
            </div>
          ) : error ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
              <AlertCircle size={32} className="mb-3 text-red-500" />
              <p className={`max-w-lg text-sm ${mutedText}`}>{error}</p>
              <button
                type="button"
                onClick={() => loadOrders()}
                className="mt-4 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700"
              >
                Try again
              </button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
              <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
                <ShoppingBag size={25} />
              </span>
              <h3 className={`font-semibold ${headingText}`}>
                {orders.length === 0 ? "No orders yet" : "No matching orders"}
              </h3>
              <p className={`mt-2 max-w-sm text-sm ${mutedText}`}>
                {orders.length === 0
                  ? "Customer orders will appear here once checkout is connected."
                  : "Try another search term or select a different status."}
              </p>
            </div>
          ) : (
            <div
              className={`divide-y ${dark ? "divide-[#2b3c30]" : "divide-stone-100"}`}
            >
              {filteredOrders.map((order) => (
                <article
                  key={order.id}
                  className={`p-5 transition sm:px-6 ${
                    dark ? "hover:bg-[#202f25]" : "hover:bg-stone-50/70"
                  }`}
                >
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className={`font-bold ${headingText}`}>
                          {order.orderNumber || "Order reference unavailable"}
                        </h3>
                        <StatusBadge status={order.status} theme={theme} />
                      </div>

                      <div
                        className={`mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2 ${mutedText}`}
                      >
                        <p className="flex items-center gap-2">
                          <UserRound size={15} className="shrink-0" />
                          <span className="truncate">
                            {order.customerName || "Customer"}
                          </span>
                        </p>
                        <p className="flex items-center gap-2">
                          <CalendarDays size={15} className="shrink-0" />
                          <span>{formatDate(order.createdAt)}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Package size={15} className="shrink-0" />
                          <span>
                            {(order.items || []).reduce(
                              (sum, item) => sum + (Number(item.quantity) || 0),
                              0,
                            )}{" "}
                            item(s)
                          </span>
                        </p>
                        {order.deliveryAddress && (
                          <p className="flex items-center gap-2">
                            <MapPin size={15} className="shrink-0" />
                            <span className="truncate">
                              {order.deliveryAddress}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div
                      className={`flex flex-col gap-3 border-t pt-4 xl:min-w-64 xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0 ${
                        dark ? "border-[#2b3c30]" : "border-stone-100"
                      }`}
                    >
                      <div>
                        <p className={`text-xs ${mutedText}`}>Order total</p>
                        <p className={`mt-1 text-xl font-bold ${headingText}`}>
                          {formatMoney(order.total)}
                        </p>
                      </div>

                      <StatusDropdown
                        status={order.status}
                        theme={theme}
                        disabled={updatingOrderId === order.id}
                        label={`Update status for ${order.orderNumber || "order"}`}
                        onChange={(nextStatus) =>
                          handleStatusChange(order.id, nextStatus)
                        }
                      />

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className={`inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                            dark
                              ? "border-[#34463a] text-[#e1e9df] hover:bg-[#2a3a2f]"
                              : "border-stone-200 text-stone-700 hover:bg-stone-100"
                          }`}
                        >
                          <Eye size={16} />
                          Details
                        </button>

                        <button
                          type="button"
                          onClick={() => openWhatsApp(order)}
                          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                          title="Contact customer on WhatsApp"
                        >
                          <MessageCircle size={16} />
                          <span className="hidden sm:inline">WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order details modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedOrder(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-detail-title"
            className={`max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl shadow-2xl sm:rounded-3xl ${
              dark ? "bg-[#1b2920] text-[#f4f5ef]" : "bg-white text-stone-900"
            }`}
          >
            <div
              className={`sticky top-0 flex items-start justify-between gap-4 border-b px-5 py-5 sm:px-7 ${
                dark
                  ? "border-[#2b3c30] bg-[#1b2920]"
                  : "border-stone-100 bg-white"
              }`}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
                  Order details
                </p>
                <h2 id="order-detail-title" className="mt-1 text-xl font-bold">
                  {selectedOrder.orderNumber || "Customer order"}
                </h2>
                <p className={`mt-1 text-sm ${mutedText}`}>
                  {formatDate(selectedOrder.createdAt)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                aria-label="Close order details"
                className={`rounded-xl p-2 transition ${
                  dark
                    ? "text-[#a5b5a7] hover:bg-[#2a3a2f] hover:text-white"
                    : "text-stone-500 hover:bg-stone-100 hover:text-stone-900"
                }`}
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className={`text-sm ${mutedText}`}>Current status</span>
                <StatusBadge status={selectedOrder.status} theme={theme} />
              </div>

              <div
                className={`rounded-2xl p-4 sm:p-5 ${
                  dark ? "bg-[#17221b]" : "bg-stone-50"
                }`}
              >
                <h3 className="mb-4 text-sm font-bold">Customer information</h3>

                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <UserRound size={17} className={`mt-0.5 ${mutedText}`} />
                    <div>
                      <p className={`text-xs ${mutedText}`}>Full name</p>
                      <p className="mt-1 font-medium">
                        {selectedOrder.customerName || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MessageCircle
                      size={17}
                      className={`mt-0.5 ${mutedText}`}
                    />
                    <div>
                      <p className={`text-xs ${mutedText}`}>Phone number</p>
                      <p className="mt-1 font-medium">
                        {selectedOrder.customerPhone || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin size={17} className={`mt-0.5 ${mutedText}`} />
                    <div>
                      <p className={`text-xs ${mutedText}`}>Delivery address</p>
                      <p className="mt-1 font-medium">
                        {selectedOrder.deliveryAddress || "Not provided"}
                      </p>
                    </div>
                  </div>

                  {selectedOrder.notes && (
                    <div>
                      <p className={`text-xs ${mutedText}`}>Order notes</p>
                      <p className="mt-1 whitespace-pre-wrap font-medium">
                        {selectedOrder.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-bold">Items ordered</h3>
                <div
                  className={`overflow-hidden rounded-2xl border ${
                    dark ? "border-[#34463a]" : "border-stone-200"
                  }`}
                >
                  {(selectedOrder.items || []).map((item, index) => (
                    <div
                      key={`${item.productId || item.name}-${index}`}
                      className={`flex items-start justify-between gap-4 border-b p-4 last:border-b-0 ${
                        dark ? "border-[#2b3c30]" : "border-stone-100"
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="font-semibold">{item.name}</p>
                        <p className={`mt-1 text-sm ${mutedText}`}>
                          {formatMoney(item.price)} × {item.quantity}
                        </p>
                      </div>
                      <p className="shrink-0 font-semibold">
                        {formatMoney(
                          (Number(item.price) || 0) *
                            (Number(item.quantity) || 0),
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className={`space-y-3 rounded-2xl p-4 sm:p-5 ${
                  dark ? "bg-[#17221b]" : "bg-stone-50"
                }`}
              >
                <div
                  className={`flex justify-between gap-4 text-sm ${mutedText}`}
                >
                  <span>Subtotal</span>
                  <span>{formatMoney(selectedOrder.subtotal)}</span>
                </div>
                <div
                  className={`flex justify-between gap-4 text-sm ${mutedText}`}
                >
                  <span>Delivery fee</span>
                  <span>{formatMoney(selectedOrder.deliveryFee)}</span>
                </div>
                <div
                  className={`flex justify-between gap-4 border-t pt-3 ${
                    dark ? "border-[#34463a]" : "border-stone-200"
                  }`}
                >
                  <span className="font-bold">Total</span>
                  <span className="text-lg font-bold text-orange-500">
                    {formatMoney(selectedOrder.total)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className={`min-h-11 rounded-xl border px-5 py-3 text-sm font-semibold transition ${
                    dark
                      ? "border-[#34463a] text-[#e1e9df] hover:bg-[#2a3a2f]"
                      : "border-stone-200 text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  Close details
                </button>

                <button
                  type="button"
                  onClick={() => openWhatsApp(selectedOrder)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  <MessageCircle size={17} />
                  Contact customer
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
