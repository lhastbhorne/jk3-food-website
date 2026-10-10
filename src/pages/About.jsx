import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  ShieldCheck,
  ShoppingBasket,
  Truck,
} from "lucide-react";

function About({ theme = "light" }) {
  const isDark = theme === "dark";

  const headingColor = isDark ? "text-white" : "text-[#203b2b]";

  const textColor = isDark ? "text-[#c7d3c9]" : "text-[#526657]";

  const cardStyle = isDark
    ? "border-white/10 bg-[#19251d]"
    : "border-[#dce5d9] bg-white";

  const values = [
    {
      icon: ShieldCheck,
      title: "Quality You Can Trust",
      description:
        "We aim to make everyday shopping easier by offering products customers can feel confident buying.",
    },
    {
      icon: Heart,
      title: "Customer First",
      description:
        "We believe good service starts with listening to customers and making their shopping experience convenient.",
    },
    {
      icon: ShoppingBasket,
      title: "Everyday Essentials",
      description:
        "From groceries and provisions to drinks, snacks and household items, we bring everyday needs together.",
    },
    {
      icon: Truck,
      title: "Convenient Shopping",
      description:
        "Our goal is to make finding and ordering your everyday essentials simpler and more accessible.",
    },
  ];

  const commitments = [
    "A convenient way to explore everyday products",
    "Clear product information and prices",
    "A simple and user-friendly shopping experience",
    "Customer support when you need assistance",
  ];

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[2rem] bg-[#2f6b3b] px-6 py-16 text-white sm:px-12 sm:py-20 lg:px-16">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold">
            About JK3 Foods
          </span>

          <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Everyday essentials,
            <span className="block text-[#d8e9bd]">made easier.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-sm leading-7 text-white/80 sm:text-base sm:leading-8">
            We are building a convenient shopping experience for groceries,
            provisions, drinks, snacks and household essentials, all in one
            place.
          </p>

          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#203b2b] transition hover:bg-[#edf2e8]"
          >
            Explore our products
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border-[35px] border-white/10 sm:h-80 sm:w-80" />
        <div className="pointer-events-none absolute -bottom-24 right-24 h-52 w-52 rounded-full bg-white/5" />
      </section>

      {/* Introduction */}
      <section className="grid items-center gap-10 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
        <div>
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#629467]">
            Who we are
          </span>

          <h2
            className={`mt-4 text-3xl font-black leading-tight sm:text-4xl ${headingColor}`}
          >
            Shopping for everyday needs should be simple.
          </h2>

          <p
            className={`mt-5 text-sm leading-7 sm:text-base sm:leading-8 ${textColor}`}
          >
            JK3 Foods is focused on bringing everyday shopping essentials
            together in one convenient place. Our product range includes
            groceries, provisions, drinks, snacks and household products.
          </p>

          <p
            className={`mt-4 text-sm leading-7 sm:text-base sm:leading-8 ${textColor}`}
          >
            This website is designed to help customers browse products, compare
            available options, add items to their cart and prepare their orders
            through a straightforward interface.
          </p>
        </div>

        <div className={`rounded-[2rem] border p-7 sm:p-10 ${cardStyle}`}>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#629467]/10 text-[#629467]">
            <ShoppingBasket size={30} />
          </div>

          <h3 className={`mt-6 text-2xl font-black ${headingColor}`}>
            Everything in one place
          </h3>

          <p className={`mt-3 text-sm leading-7 ${textColor}`}>
            Discover products across different categories without needing to
            navigate multiple shopping pages or complicated menus.
          </p>

          <div className="mt-7 grid grid-cols-2 gap-3">
            {[
              "Groceries",
              "Provisions",
              "Drinks",
              "Snacks",
              "Household items",
            ].map((category) => (
              <div
                key={category}
                className={`flex items-center gap-2 rounded-xl p-3 text-sm font-medium ${
                  isDark ? "bg-white/5" : "bg-[#f3f6ef]"
                } ${headingColor}`}
              >
                <CheckCircle2 size={17} className="shrink-0 text-[#629467]" />
                {category}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#629467]">
            What matters to us
          </span>

          <h2
            className={`mt-4 text-3xl font-black sm:text-4xl ${headingColor}`}
          >
            The experience we want to deliver
          </h2>

          <p className={`mt-4 text-sm leading-7 sm:text-base ${textColor}`}>
            Our focus is on making everyday shopping more convenient and
            creating a positive experience for our customers.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => {
            const Icon = value.icon;

            return (
              <article
                key={value.title}
                className={`rounded-3xl border p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg ${cardStyle}`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#629467]/10 text-[#629467]">
                  <Icon size={24} />
                </div>

                <h3 className={`mt-5 text-lg font-bold ${headingColor}`}>
                  {value.title}
                </h3>

                <p className={`mt-3 text-sm leading-7 ${textColor}`}>
                  {value.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Customer commitment */}
      <section className="my-16 grid gap-10 rounded-[2rem] bg-[#edf2e8] p-7 dark:bg-[#19251d] sm:p-10 lg:grid-cols-2 lg:items-center lg:p-14">
        <div>
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#629467]">
            Our commitment
          </span>

          <h2 className="mt-4 text-3xl font-black leading-tight text-[#203b2b] dark:text-white sm:text-4xl">
            A better experience, one order at a time.
          </h2>

          <p className="mt-5 text-sm leading-7 text-[#526657] dark:text-[#c7d3c9] sm:text-base">
            We want customers to find the products they need, understand their
            options and move through the shopping process with ease.
          </p>
        </div>

        <div className="space-y-4">
          {commitments.map((commitment) => (
            <div
              key={commitment}
              className="flex items-start gap-3 rounded-2xl bg-white p-4 dark:bg-[#101812]"
            >
              <CheckCircle2
                size={21}
                className="mt-0.5 shrink-0 text-[#629467]"
              />

              <p className="text-sm font-medium text-[#203b2b] dark:text-[#e1e9df]">
                {commitment}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to action */}
      <section className="pb-8 text-center">
        <h2 className={`text-3xl font-black sm:text-4xl ${headingColor}`}>
          Ready to explore JK3 Foods?
        </h2>

        <p className={`mx-auto mt-4 max-w-xl text-sm leading-7 ${textColor}`}>
          Browse our available products and find the everyday essentials you
          need.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-4">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 rounded-xl bg-[#2f6b3b] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#255831]"
          >
            Start shopping
            <ArrowRight size={18} />
          </Link>

          <Link
            to="/contact"
            className={`rounded-xl border px-6 py-3.5 text-sm font-bold transition hover:border-[#629467] ${
              isDark
                ? "border-white/15 text-white"
                : "border-[#dce5d9] text-[#203b2b]"
            }`}
          >
            Contact us
          </Link>
        </div>
      </section>
    </main>
  );
}

export default About;
