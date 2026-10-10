import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";

function Contact({ theme = "light" }) {
  const isDark = theme === "dark";

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const inputClass = `w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-[#629467] focus:ring-2 focus:ring-[#629467]/20 ${
    isDark
      ? "border-white/10 bg-[#1b2820] text-white placeholder:text-gray-500"
      : "border-[#dce5d9] bg-white text-[#203b2b] placeholder:text-gray-400"
  }`;

  const cardClass = isDark
    ? "border-white/10 bg-[#19251d]"
    : "border-[#dce5d9] bg-white";

  const mutedText = isDark ? "text-[#b7c5ba]" : "text-[#647468]";

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

    setSubmitted(false);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Please enter your name.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.subject.trim()) {
      nextErrors.subject = "Please enter a subject.";
    }

    if (form.message.trim().length < 10) {
      nextErrors.message = "Your message must contain at least 10 characters.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    // UI demonstration only: no message is sent yet.
    setSubmitted(true);
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
      <Link
        to="/"
        className={`mb-8 inline-flex items-center gap-2 text-sm font-semibold transition hover:text-[#629467] ${mutedText}`}
      >
        <ArrowLeft size={17} />
        Back to home
      </Link>

      {/* Page heading */}
      <section className="mb-12 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#629467]/10 px-4 py-2 text-sm font-semibold text-[#629467]">
          <MessageCircle size={16} />
          We're here to help
        </span>

        <h1
          className={`mt-5 text-4xl font-black tracking-tight sm:text-5xl ${
            isDark ? "text-white" : "text-[#203b2b]"
          }`}
        >
          Contact Us
        </h1>

        <p
          className={`mx-auto mt-4 max-w-2xl text-sm leading-7 sm:text-base ${mutedText}`}
        >
          Have a question about our products or your shopping experience? Send
          us a message and let us know how we can help.
        </p>
      </section>

      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        {/* Contact information */}
        <section className="space-y-5">
          <div className={`rounded-3xl border p-7 sm:p-8 ${cardClass}`}>
            <h2
              className={`text-xl font-bold ${
                isDark ? "text-white" : "text-[#203b2b]"
              }`}
            >
              Get in touch
            </h2>

            <p className={`mt-3 text-sm leading-7 ${mutedText}`}>
              We want your experience with JK3 Foods to be simple and
              convenient. Use the contact form to send us your enquiry.
            </p>

            <div className="mt-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#629467]/10 text-[#629467]">
                  <Phone size={21} />
                </div>

                <div>
                  <h3
                    className={`font-semibold ${isDark ? "text-white" : "text-[#203b2b]"}`}
                  >
                    Phone
                  </h3>
                  <p className={`mt-1 text-sm ${mutedText}`}>
                    Business number coming soon
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#629467]/10 text-[#629467]">
                  <Mail size={21} />
                </div>

                <div>
                  <h3
                    className={`font-semibold ${isDark ? "text-white" : "text-[#203b2b]"}`}
                  >
                    Email
                  </h3>
                  <p className={`mt-1 text-sm ${mutedText}`}>
                    Business email coming soon
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#629467]/10 text-[#629467]">
                  <MapPin size={21} />
                </div>

                <div>
                  <h3
                    className={`font-semibold ${isDark ? "text-white" : "text-[#203b2b]"}`}
                  >
                    Location
                  </h3>
                  <p className={`mt-1 text-sm ${mutedText}`}>
                    Business address coming soon
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-[#2f6b3b] p-7 text-white sm:p-8">
            <MessageCircle size={28} />

            <h2 className="mt-4 text-xl font-bold">
              Need everyday essentials?
            </h2>

            <p className="mt-3 text-sm leading-7 text-white/80">
              Explore our range of groceries, provisions, drinks, snacks and
              household products.
            </p>

            <Link
              to="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#203b2b] transition hover:bg-[#edf2e8]"
            >
              Browse products
            </Link>
          </div>
        </section>

        {/* Contact form */}
        <section className={`rounded-3xl border p-6 sm:p-9 ${cardClass}`}>
          <h2
            className={`text-2xl font-bold ${
              isDark ? "text-white" : "text-[#203b2b]"
            }`}
          >
            Send us a message
          </h2>

          <p className={`mt-2 text-sm ${mutedText}`}>
            Fill in the form below with your enquiry.
          </p>

          {submitted ? (
            <div className="mt-8 rounded-2xl border border-[#629467]/30 bg-[#629467]/10 p-6">
              <h3 className="font-bold text-[#629467]">
                Form validation successful
              </h3>

              <p className={`mt-2 text-sm leading-6 ${mutedText}`}>
                Your details are valid, but your message has not been sent.
                Message delivery will be connected later.
              </p>

              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-5 text-sm font-semibold text-[#629467] underline"
              >
                Back to form
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="contact-name"
                  className={`mb-2 block text-sm font-semibold ${isDark ? "text-white" : "text-[#203b2b]"}`}
                >
                  Full name
                </label>

                <input
                  id="contact-name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={inputClass}
                  aria-invalid={Boolean(errors.name)}
                />

                {errors.name && (
                  <p className="mt-2 text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className={`mb-2 block text-sm font-semibold ${isDark ? "text-white" : "text-[#203b2b]"}`}
                >
                  Email address
                </label>

                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={inputClass}
                  aria-invalid={Boolean(errors.email)}
                />

                {errors.email && (
                  <p className="mt-2 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className={`mb-2 block text-sm font-semibold ${isDark ? "text-white" : "text-[#203b2b]"}`}
                >
                  Subject
                </label>

                <input
                  id="contact-subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="What is your enquiry about?"
                  className={inputClass}
                  aria-invalid={Boolean(errors.subject)}
                />

                {errors.subject && (
                  <p className="mt-2 text-xs text-red-500">{errors.subject}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className={`mb-2 block text-sm font-semibold ${isDark ? "text-white" : "text-[#203b2b]"}`}
                >
                  Message
                </label>

                <textarea
                  id="contact-message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Write your message here..."
                  className={`${inputClass} resize-y`}
                  aria-invalid={Boolean(errors.message)}
                />

                {errors.message && (
                  <p className="mt-2 text-xs text-red-500">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2f6b3b] px-6 py-4 font-bold text-white transition hover:bg-[#255831] sm:w-auto"
              >
                <Send size={17} />
                Validate message
              </button>

              <p className={`text-xs leading-5 ${mutedText}`}>
                This form currently validates your entries only. It does not
                send or store messages.
              </p>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}

export default Contact;
