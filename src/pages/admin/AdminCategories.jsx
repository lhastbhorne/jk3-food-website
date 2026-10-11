import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Layers,
  RefreshCw,
  AlertCircle,
  Power,
  CheckCircle2,
  X,
  Tag,
  FolderOpen,
} from "lucide-react";

import {
  getAllCategories,
  createCategory,
  setCategoryActive,
} from "../../services/categoryService";

function AdminCategories({ theme = "light" }) {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");
  const [notification, setNotification] = useState(null);

  const isDark = theme === "dark";

  const colors = {
    text: isDark ? "text-[#f0f4ed]" : "text-[#243328]",
    muted: isDark ? "text-[#bdc9ba]" : "text-[#647361]",
    card: isDark
      ? "border-[#405044] bg-[#1b261e]"
      : "border-[#e5e9df] bg-white",
    border: isDark ? "border-[#405044]" : "border-[#e5e9df]",
    subtle: isDark ? "bg-[#243328]" : "bg-[#f7f8f1]",
    input: isDark
      ? "border-[#405044] bg-[#141d17] text-[#f0f4ed] placeholder:text-[#849181]"
      : "border-[#dfe5d9] bg-white text-[#243328] placeholder:text-[#92998d]",
    hover: isDark ? "hover:bg-[#243328]" : "hover:bg-[#f7f8f1]",
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (!notification) return;

    const timeout = window.setTimeout(() => {
      setNotification(null);
    }, 3500);

    return () => window.clearTimeout(timeout);
  }, [notification]);

  async function loadCategories() {
    try {
      setLoading(true);
      setError("");

      const data = await getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories:", err);
      setError("Unable to load categories. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function showNotification(type, message) {
    setNotification({
      type,
      message,
      id: Date.now(),
    });
  }

  async function handleAddCategory(event) {
    event.preventDefault();

    if (saving) return;

    setError("");

    const trimmedName = categoryName.trim();

    if (!trimmedName) {
      showNotification("error", "Enter a category name.");
      return;
    }

    const duplicate = categories.some(
      (category) =>
        category.name?.trim().toLowerCase() === trimmedName.toLowerCase(),
    );

    if (duplicate) {
      showNotification("error", "A category with this name already exists.");
      return;
    }

    try {
      setSaving(true);

      await createCategory(trimmedName);
      setCategoryName("");

      await loadCategories();

      showNotification("success", `"${trimmedName}" was added successfully.`);
    } catch (err) {
      console.error("Failed to add category:", err);

      showNotification("error", err.message || "Unable to add category.");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleStatus(category) {
    if (updatingId) return;

    const nextIsActive = category.isActive !== true;

    try {
      setUpdatingId(category.id);
      setError("");

      await setCategoryActive(category.id, nextIsActive);

      setCategories((current) =>
        current.map((item) =>
          item.id === category.id ? { ...item, isActive: nextIsActive } : item,
        ),
      );

      showNotification(
        "success",
        `"${category.name}" was ${nextIsActive ? "activated" : "deactivated"}.`,
      );
    } catch (err) {
      console.error("Failed to update category:", err);

      showNotification(
        "error",
        "Unable to update category status. Please try again.",
      );
    } finally {
      setUpdatingId("");
    }
  }

  const filteredCategories = categories.filter((category) =>
    category.name?.toLowerCase().includes(searchTerm.trim().toLowerCase()),
  );

  const activeCount = categories.filter(
    (category) => category.isActive === true,
  ).length;

  const inactiveCount = categories.length - activeCount;

  return (
    <section className={`relative min-w-0 space-y-6 ${colors.text}`}>
      {/* Styled notifications */}
      {notification && (
        <div
          key={notification.id}
          role="status"
          aria-live="polite"
          className={`fixed right-4 top-4 z-[120] flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 rounded-2xl border p-4 shadow-xl ${
            notification.type === "success"
              ? isDark
                ? "border-green-800 bg-[#1b3022] text-green-200"
                : "border-green-200 bg-white text-green-800"
              : isDark
                ? "border-red-900 bg-[#351f1f] text-red-200"
                : "border-red-200 bg-white text-red-700"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 size={21} className="mt-0.5 shrink-0" />
          ) : (
            <AlertCircle size={21} className="mt-0.5 shrink-0" />
          )}

          <p className="min-w-0 flex-1 text-sm font-medium leading-6">
            {notification.message}
          </p>

          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => setNotification(null)}
            className="shrink-0 rounded-lg p-1 opacity-70 hover:opacity-100"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* Heading */}
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3d6847]/10">
            <Layers size={21} className="text-[#3d6847]" />
          </div>

          <h1 className="text-2xl font-bold">Categories</h1>
        </div>

        <p className={`mt-2 text-sm leading-6 ${colors.muted}`}>
          Organise your products into categories available in your store.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className={`min-w-0 rounded-2xl border p-4 sm:p-5 ${colors.card}`}>
          <div className="flex items-center justify-between gap-3">
            <p className={`text-sm ${colors.muted}`}>Total categories</p>
            <FolderOpen size={20} className="shrink-0 text-[#629467]" />
          </div>
          <p className="mt-3 text-2xl font-bold">{categories.length}</p>
        </div>

        <div className={`min-w-0 rounded-2xl border p-4 sm:p-5 ${colors.card}`}>
          <div className="flex items-center justify-between gap-3">
            <p className={`text-sm ${colors.muted}`}>Active</p>
            <CheckCircle2 size={20} className="shrink-0 text-green-600" />
          </div>
          <p className="mt-3 text-2xl font-bold">{activeCount}</p>
        </div>

        <div className={`min-w-0 rounded-2xl border p-4 sm:p-5 ${colors.card}`}>
          <div className="flex items-center justify-between gap-3">
            <p className={`text-sm ${colors.muted}`}>Inactive</p>
            <Power size={20} className="shrink-0 text-[#92998d]" />
          </div>
          <p className="mt-3 text-2xl font-bold">{inactiveCount}</p>
        </div>
      </div>

      {/* Add category form */}
      <form
        onSubmit={handleAddCategory}
        className={`min-w-0 rounded-2xl border p-4 sm:p-6 ${colors.card}`}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#3d6847]/10">
            <Plus size={21} className="text-[#3d6847]" />
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-semibold">Add a category</h2>
            <p className={`mt-1 text-sm leading-6 ${colors.muted}`}>
              Examples: Oils, Beverages, Rice &amp; Grains.
            </p>
          </div>
        </div>

        <div className="mt-5 flex min-w-0 flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={categoryName}
            onChange={(event) => setCategoryName(event.target.value)}
            placeholder="Enter category name"
            aria-label="New category name"
            maxLength={60}
            className={`block min-w-0 w-full flex-1 rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-[#629467] focus:ring-2 focus:ring-[#629467]/20 sm:w-auto ${colors.input}`}
          />

          <button
            type="submit"
            disabled={saving}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#3d6847] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#315539] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <RefreshCw size={17} className="animate-spin" />
            ) : (
              <Plus size={17} />
            )}
            {saving ? "Adding..." : "Add category"}
          </button>
        </div>

        <p className={`mt-3 text-xs ${colors.muted}`}>
          Category names can contain up to 60 characters.
        </p>
      </form>

      {/* Category list */}
      <div
        className={`min-w-0 overflow-hidden rounded-2xl border ${colors.card}`}
      >
        <div className={`border-b p-4 sm:p-5 ${colors.border}`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold">All categories</h2>
              <p className={`mt-1 text-sm ${colors.muted}`}>
                {categories.length} categor
                {categories.length === 1 ? "y" : "ies"} total
              </p>
            </div>

            <div className="relative w-full min-w-0 sm:max-w-xs">
              <Search
                size={17}
                className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${colors.muted}`}
              />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search categories..."
                aria-label="Search categories"
                className={`block w-full min-w-0 rounded-xl border py-3 pl-9 pr-3 text-sm outline-none transition focus:border-[#629467] focus:ring-2 focus:ring-[#629467]/20 ${colors.input}`}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div
            className={`flex items-center justify-center gap-3 p-12 ${colors.muted}`}
          >
            <RefreshCw size={20} className="animate-spin" />
            Loading categories...
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 p-10 text-center">
            <AlertCircle size={30} className="text-red-500" />
            <p className="text-sm">{error}</p>

            <button
              type="button"
              onClick={loadCategories}
              className="rounded-xl bg-[#3d6847] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#315539]"
            >
              Try again
            </button>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div
            className={`flex flex-col items-center gap-3 p-10 text-center sm:p-14 ${colors.muted}`}
          >
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl ${colors.subtle}`}
            >
              <Layers size={28} />
            </div>

            <p className={`font-semibold ${colors.text}`}>
              {searchTerm ? "No matching categories" : "No categories yet"}
            </p>

            <p className="max-w-sm text-sm leading-6">
              {searchTerm
                ? "Try another search term."
                : "Add your first category using the form above."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 sm:p-4 xl:grid-cols-3">
              {filteredCategories.map((category) => {
                const isActive = category.isActive === true;
                const isUpdating = updatingId === category.id;

                return (
                  <article
                    key={category.id}
                    className={`flex min-w-0 flex-col justify-between gap-4 rounded-xl border p-4 transition hover:shadow-sm ${colors.border} ${colors.hover}`}
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#3d6847]/10">
                        <Tag size={20} className="text-[#3d6847]" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="break-words font-semibold">
                          {category.name || "Unnamed category"}
                        </h3>

                        <p className={`mt-1 text-xs leading-5 ${colors.muted}`}>
                          {isActive
                            ? "Visible to customers"
                            : "Hidden from customers"}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleStatus(category)}
                      disabled={Boolean(updatingId)}
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${colors.border} ${colors.hover}`}
                    >
                      {isUpdating ? (
                        <RefreshCw size={16} className="animate-spin" />
                      ) : (
                        <Power size={16} />
                      )}

                      {isUpdating
                        ? "Updating..."
                        : isActive
                          ? "Deactivate category"
                          : "Activate category"}
                    </button>
                  </article>
                );
              })}
            </div>

            <div
              className={`border-t px-4 py-3 text-xs ${colors.muted} ${colors.border}`}
            >
              Showing {filteredCategories.length} of {categories.length}{" "}
              categories
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default AdminCategories;
