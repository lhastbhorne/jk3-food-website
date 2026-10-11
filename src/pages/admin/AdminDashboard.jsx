import {
  Package,
  ShoppingCart,
  Users,
  Wallet,
  ArrowUpRight,
  ArrowRight,
  Plus,
  Clock3,
  CheckCircle2,
  Truck,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  {
    title: "Total products",
    value: "0",
    description: "Products in your catalogue",
    icon: Package,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    title: "Total orders",
    value: "0",
    description: "Orders received",
    icon: ShoppingCart,
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    title: "Customers",
    value: "0",
    description: "Registered customers",
    icon: Users,
    color: "bg-orange-500/10 text-orange-500",
  },
  {
    title: "Sales revenue",
    value: "₦0",
    description: "Revenue from completed sales",
    icon: Wallet,
    color: "bg-[#629467]/15 text-[#629467]",
  },
];

const recentOrders = [
  {
    id: "JK3-2026-001",
    customer: "Sample Customer",
    date: "Oct 8, 2026",
    amount: 110000,
    status: "Processing",
  },
  {
    id: "JK3-2026-002",
    customer: "Sample Customer",
    date: "Oct 7, 2026",
    amount: 13000,
    status: "Delivered",
  },
  {
    id: "JK3-2026-003",
    customer: "Sample Customer",
    date: "Oct 6, 2026",
    amount: 6500,
    status: "Pending",
  },
];

const statusStyles = {
  Processing: "bg-blue-500/10 text-blue-600 dark:text-blue-300",
  Delivered: "bg-green-500/10 text-green-700 dark:text-green-300",
  Pending: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
};

const formatPrice = (price) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);

function AdminDashboard({ theme = "light" }) {
  const isDark = theme === "dark";

  const colors = {
    text: isDark ? "text-[#f0f4ed]" : "text-[#243328]",
    muted: isDark ? "text-[#bdc9ba]" : "text-[#647361]",
    card: isDark ? "bg-[#1b261e]" : "bg-white",
    border: isDark ? "border-[#405044]" : "border-[#8b9d85]/25",
    tableHeader: isDark ? "bg-[#141d17]" : "bg-[#f7f8f1]",
    hover: isDark ? "hover:bg-[#243328]" : "hover:bg-[#f7f8f1]",
  };

  const cardClass = `rounded-2xl border ${colors.border} ${colors.card}`;

  return (
    <div
      className={`mx-auto max-w-7xl space-y-8 ${colors.text}`}
    >
      {/* Page heading */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#629467]">
            Store overview
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Dashboard
          </h1>

          <p className={`mt-2 text-sm leading-6 ${colors.muted}`}>
            Welcome back. Here's an overview of your JK3 Foods store.
          </p>
        </div>

        <Link
          to="/admin/products"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#47784a] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#38653c]"
        >
          <Plus size={18} />
          Add product
        </Link>
      </section>

      {/* Demo data notice */}
      <div
        className={`flex items-start gap-3 rounded-2xl border border-amber-500/30 p-4 ${
          isDark ? "bg-amber-500/10" : "bg-amber-50"
        }`}
      >
        <AlertCircle
          size={20}
          className="mt-0.5 shrink-0 text-amber-500"
        />

        <div>
          <p className="text-sm font-bold">Dashboard preview</p>
          <p className={`mt-1 text-sm leading-6 ${colors.muted}`}>
            Statistics and recent orders are currently sample data. Live store
            information will appear after Firebase integration.
          </p>
        </div>
      </div>

      {/* Statistics cards */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold">Store statistics</h2>
          <p className={`mt-1 text-sm ${colors.muted}`}>
            Key information about your store.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.title}
                className={`${cardClass} p-5 transition hover:-translate-y-0.5 hover:shadow-sm`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
                  >
                    <Icon size={23} />
                  </div>

                  <ArrowUpRight
                    size={18}
                    className={colors.muted}
                  />
                </div>

                <p className={`mt-5 text-sm font-medium ${colors.muted}`}>
                  {stat.title}
                </p>

                <p className="mt-1 text-3xl font-black">
                  {stat.value}
                </p>

                <p className={`mt-2 text-xs ${colors.muted}`}>
                  {stat.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Recent orders */}
      <section className={`${cardClass} overflow-hidden`}>
        <div
          className={`flex flex-col gap-3 border-b ${colors.border} p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6`}
        >
          <div>
            <h2 className="text-lg font-bold">Recent orders</h2>
            <p className={`mt-1 text-sm ${colors.muted}`}>
              A preview of customer orders.
            </p>
          </div>

          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#629467] hover:underline"
          >
            View all orders
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left">
            <thead>
              <tr
                className={`${colors.tableHeader} text-xs uppercase tracking-wider ${colors.muted}`}
              >
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className={`border-t ${colors.border} transition ${colors.hover}`}
                >
                  <td className="whitespace-nowrap px-6 py-5 text-sm font-bold">
                    {order.id}
                  </td>

                  <td className="whitespace-nowrap px-6 py-5 text-sm">
                    {order.customer}
                  </td>

                  <td
                    className={`whitespace-nowrap px-6 py-5 text-sm ${colors.muted}`}
                  >
                    {order.date}
                  </td>

                  <td className="whitespace-nowrap px-6 py-5 text-sm font-bold">
                    {formatPrice(order.amount)}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${statusStyles[order.status]}`}
                    >
                      {order.status === "Delivered" ? (
                        <CheckCircle2 size={13} />
                      ) : order.status === "Processing" ? (
                        <Truck size={13} />
                      ) : (
                        <Clock3 size={13} />
                      )}

                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quick actions */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold">Quick actions</h2>
          <p className={`mt-1 text-sm ${colors.muted}`}>
            Shortcuts to common store management tasks.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Link
            to="/admin/products"
            className={`group flex items-center gap-4 rounded-2xl border ${colors.border} ${colors.card} p-5 transition hover:border-[#629467]/60 hover:shadow-sm`}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#629467]/15 text-[#629467]">
              <Package size={23} />
            </div>

            <div className="flex-1">
              <p className="font-bold">Manage products</p>
              <p className={`mt-1 text-sm ${colors.muted}`}>
                Update your product catalogue.
              </p>
            </div>

            <ArrowRight
              size={18}
              className={`transition group-hover:translate-x-1 ${colors.muted}`}
            />
          </Link>

          <Link
            to="/admin/categories"
            className={`group flex items-center gap-4 rounded-2xl border ${colors.border} ${colors.card} p-5 transition hover:border-[#629467]/60 hover:shadow-sm`}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
              <Package size={23} />
            </div>

            <div className="flex-1">
              <p className="font-bold">Manage categories</p>
              <p className={`mt-1 text-sm ${colors.muted}`}>
                Organise your store catalogue.
              </p>
            </div>

            <ArrowRight
              size={18}
              className={`transition group-hover:translate-x-1 ${colors.muted}`}
            />
          </Link>

          <Link
            to="/admin/orders"
            className={`group flex items-center gap-4 rounded-2xl border ${colors.border} ${colors.card} p-5 transition hover:border-[#629467]/60 hover:shadow-sm`}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
              <ShoppingCart size={23} />
            </div>

            <div className="flex-1">
              <p className="font-bold">View orders</p>
              <p className={`mt-1 text-sm ${colors.muted}`}>
                Review and manage customer orders.
              </p>
            </div>

            <ArrowRight
              size={18}
              className={`transition group-hover:translate-x-1 ${colors.muted}`}
            />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;