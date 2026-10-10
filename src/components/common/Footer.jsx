import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";

function Footer({ theme = "light" }) {
  const isDark = theme === "dark";

  const textColor = isDark ? "text-[#c7d3c9]" : "text-[#526657]";

  const headingColor = isDark ? "text-white" : "text-[#203b2b]";

  const borderColor = isDark ? "border-white/10" : "border-[#dce5d9]";

  return (
    <footer
      className={`mt-20 border-t ${
        isDark
          ? "border-white/10 bg-[#101812]"
          : "border-[#dce5d9] bg-[#edf2e8]"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              to="/"
              aria-label="JK3 Foods home"
              className="inline-flex items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2f6b3b] text-xl font-black text-white">
                JK3
              </div>

              <div>
                <p className={`text-xl font-black ${headingColor}`}>
                  JK3 Foods
                </p>

                <p className={`text-xs ${textColor}`}>Everyday essentials</p>
              </div>
            </Link>

            <p className={`mt-5 max-w-xs text-sm leading-7 ${textColor}`}>
              Your trusted destination for groceries, provisions, drinks, snacks
              and household essentials.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`mb-5 font-bold ${headingColor}`}>Quick Links</h3>

            <ul className={`space-y-3 text-sm ${textColor}`}>
              <li>
                <Link to="/" className="transition-colors hover:text-[#629467]">
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="transition-colors hover:text-[#629467]"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="/shop"
                  className="transition-colors hover:text-[#629467]"
                >
                  Shop All Products
                </Link>
              </li>

              <li>
                <Link
                  to="/cart"
                  className="transition-colors hover:text-[#629467]"
                >
                  Shopping Cart
                </Link>
              </li>

              <li>
                <Link
                  to="/checkout"
                  className="transition-colors hover:text-[#629467]"
                >
                  Checkout
                </Link>
              </li>

              <li>
                <Link
                  to="/track-order"
                  className="transition-colors hover:text-[#629467]"
                >
                  Track My Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className={`mb-5 font-bold ${headingColor}`}>
              Customer Support
            </h3>

            <p className={`mb-4 text-sm leading-6 ${textColor}`}>
              Have questions about our products or your shopping experience? Get
              in touch with us.
            </p>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#629467] transition-colors hover:text-[#3f7948]"
            >
              Contact us
              <ArrowUpRight size={16} />
            </Link>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className={`mb-5 font-bold ${headingColor}`}>Contact Us</h3>

            <div className={`space-y-4 text-sm ${textColor}`}>
              <p className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-[#629467]" />

                <span>Serving our customers with everyday essentials.</span>
              </p>

              <p className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-[#629467]" />

                <span>Contact details coming soon</span>
              </p>

              <p className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-[#629467]" />

                <span>Email address coming soon</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className={`mt-12 flex flex-col gap-3 border-t pt-6 text-sm sm:flex-row sm:items-center sm:justify-between ${borderColor} ${textColor}`}
        >
          <p>© {new Date().getFullYear()} JK3 Foods. All rights reserved.</p>

          <p>Good food. Everyday essentials. Trusted service.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
