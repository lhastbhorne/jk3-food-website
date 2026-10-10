import { Link } from "react-router-dom";
import { ArrowRight, PackageCheck } from "lucide-react";

function OrderTrackingBanner({ theme = "light" }) {
  const isDark = theme === "dark";

  return (
    <section
      className={`mx-auto my-12 max-w-7xl rounded-3xl border p-6 sm:p-8 lg:p-10 ${
        isDark
          ? "border-white/10 bg-[#19251d]"
          : "border-[#dce5d9] bg-[#edf2e8]"
      }`}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#2f6b3b] text-white">
            <PackageCheck size={25} />
          </div>

          <div className="max-w-2xl">
            <h2
              className={`text-xl font-black sm:text-2xl ${
                isDark ? "text-white" : "text-[#203b2b]"
              }`}
            >
              Already ordered from us?
            </h2>

            <p
              className={`mt-2 text-sm leading-7 sm:text-base ${
                isDark ? "text-[#d1ddd3]" : "text-[#46594a]"
              }`}
            >
              Track your order using the unique order number sent to your email
              after placing your order.
            </p>

            <p
              className={`mt-2 text-xs ${
                isDark ? "text-[#aab9ad]" : "text-[#647468]"
              }`}
            >
              For customers who have already placed an order.
            </p>
          </div>
        </div>

        <Link
          to="/track-order"
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#2f6b3b] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#255831] focus:outline-none focus:ring-2 focus:ring-[#629467] focus:ring-offset-2"
        >
          Track my order
          <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  );
}

export default OrderTrackingBanner;
