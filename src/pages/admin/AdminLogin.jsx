import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Store,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
  LoaderCircle,
} from "lucide-react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../firebase";

const ADMIN_UID = "rMSPmEMDpghAW63Qp4Y2HvAAmZr2";

function AdminLogin({ theme = "light" }) {
  const navigate = useNavigate();
  const isDark = theme === "dark";

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const colors = {
    page: isDark
      ? "bg-[#141d17] text-[#f4f5ef]"
      : "bg-[#f7f8f1] text-[#203b2b]",

    card: isDark ? "border-white/10 bg-[#1b261e]" : "border-[#e5e9df] bg-white",

    muted: isDark ? "text-[#aebdac]" : "text-[#71806d]",

    inputBackground: isDark ? "bg-[#141d17]" : "bg-white",

    inputText: isDark ? "text-[#f4f5ef]" : "text-[#203b2b]",

    placeholder: isDark
      ? "placeholder:text-[#849181]"
      : "placeholder:text-[#92998d]",
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
      form: "",
    }));
  }

  function validateForm() {
    const nextErrors = {};
    const email = form.email.trim();

    if (!email) {
      nextErrors.email = "Enter your admin email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.password) {
      nextErrors.password = "Enter your password.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading || !validateForm()) return;

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email.trim(),
        form.password,
      );

      const user = userCredential.user;

      if (user.uid !== ADMIN_UID) {
        await signOut(auth);

        setErrors({
          form: "This account is not authorised to access the admin dashboard.",
        });

        return;
      }

      navigate("/admin", { replace: true });
    } catch (error) {
      console.error("Admin login error:", error.code);

      let message = "Sign-in failed. Please check your details and try again.";

      switch (error.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          message = "Incorrect email or password.";
          break;

        case "auth/invalid-email":
          message = "Please enter a valid email address.";
          break;

        case "auth/too-many-requests":
          message = "Too many attempts. Please wait and try again.";
          break;

        case "auth/network-request-failed":
          message = "Network error. Check your internet connection.";
          break;

        case "auth/operation-not-allowed":
          message = "Email/password sign-in is not enabled in Firebase.";
          break;

        default:
          break;
      }

      setErrors({ form: message });
    } finally {
      setLoading(false);
    }
  }

  const inputContainerClass = (field) =>
    `box-border flex w-full min-w-0 items-center gap-3 overflow-hidden rounded-xl border px-4 transition-all duration-200 ${
      errors[field]
        ? "border-red-500"
        : "border-[#dfe5d9] focus-within:border-[#629467] focus-within:ring-2 focus-within:ring-[#629467]/20"
    } ${colors.inputBackground}`;

  const inputClass = `block min-w-0 flex-1 appearance-none border-0 !outline-none !ring-0 !shadow-none bg-transparent py-3.5 text-sm ${colors.inputText} ${colors.placeholder}`;

  return (
    <main
      className={`flex min-h-screen items-center justify-center px-4 py-10 ${colors.page}`}
    >
      <div className="w-full max-w-md">
        <Link
          to="/"
          className={`mb-8 inline-flex items-center gap-2 text-sm font-semibold transition hover:text-[#629467] ${colors.muted}`}
        >
          <ArrowLeft size={17} />
          Back to store
        </Link>

        <section
          className={`rounded-3xl border p-6 shadow-sm sm:p-9 ${colors.card}`}
        >
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#47784a] text-white shadow-sm">
              <Store size={31} />
            </div>

            <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#629467]">
              JK3 Foods
            </p>

            <h1 className="mt-2 text-3xl font-black">Admin login</h1>

            <p className={`mt-3 text-sm leading-6 ${colors.muted}`}>
              Sign in to manage your store, products and orders.
            </p>
          </div>

          {/* Security notice */}
          <div className="mt-7 flex items-start gap-3 rounded-2xl bg-[#629467]/10 p-4">
            <ShieldCheck size={20} className="mt-0.5 shrink-0 text-[#629467]" />

            <p className={`text-xs leading-5 ${colors.muted}`}>
              This area is intended for authorised store administrators.
            </p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
            {/* Email */}
            <div className="min-w-0">
              <label htmlFor="admin-email" className="text-sm font-semibold">
                Email address
              </label>

              <div className={`mt-2 ${inputContainerClass("email")}`}>
                <Mail size={19} className={`shrink-0 ${colors.muted}`} />

                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? "admin-email-error" : undefined
                  }
                  className={inputClass}
                />
              </div>

              {errors.email && (
                <p id="admin-email-error" className="mt-2 text-sm text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="min-w-0">
              <label htmlFor="admin-password" className="text-sm font-semibold">
                Password
              </label>

              <div className={`mt-2 ${inputContainerClass("password")}`}>
                <LockKeyhole size={19} className={`shrink-0 ${colors.muted}`} />

                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    errors.password ? "admin-password-error" : undefined
                  }
                  className={inputClass}
                />

                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((current) => !current)}
                  className={`flex shrink-0 items-center justify-center border-0 bg-transparent p-1 ${colors.muted} hover:text-[#629467]`}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>

              {errors.password && (
                <p
                  id="admin-password-error"
                  className="mt-2 text-sm text-red-500"
                >
                  {errors.password}
                </p>
              )}
            </div>

            {/* General error */}
            {errors.form && (
              <p
                role="alert"
                className={`rounded-xl p-3 text-sm leading-6 ${
                  isDark
                    ? "bg-red-500/10 text-red-300"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {errors.form}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#47784a] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#38653c] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && <LoaderCircle size={18} className="animate-spin" />}

              {loading ? "Signing in..." : "Sign in to dashboard"}
            </button>
          </form>

          <p className={`mt-6 text-center text-xs leading-5 ${colors.muted}`}>
            Admin access only. Contact the store owner if you need access.
          </p>
        </section>

        <p className={`mt-6 text-center text-xs ${colors.muted}`}>
          © {new Date().getFullYear()} JK3 Foods
        </p>
      </div>
    </main>
  );
}

export default AdminLogin;
