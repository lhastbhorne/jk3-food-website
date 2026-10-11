import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Package,
  Pencil,
  RefreshCw,
  AlertCircle,
  Eye,
  X,
  Layers,
  Boxes,
  Trash2,
  CheckCircle2,
  Power,
  ShoppingBag,
  Tag,
  Banknote,
  Warehouse,
  ChevronRight,
} from "lucide-react";

import {
  getAllProducts,
  updateProduct,
  deleteProduct,
} from "../../services/productService";

function AdminProducts({ theme = "light" }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [updatingProductId, setUpdatingProductId] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);
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
    loadProducts();
  }, []);

  useEffect(() => {
    if (!notification) return;

    const timeout = window.setTimeout(() => {
      setNotification(null);
    }, 3500);

    return () => window.clearTimeout(timeout);
  }, [notification]);

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products:", err);
      setError("Unable to load products. Please try again.");
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

  function formatPrice(price) {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 2,
    }).format(Number(price) || 0);
  }

  function getVariants(product) {
    return Array.isArray(product.variants) && product.variants.length
      ? product.variants
      : [
          {
            id: "default",
            size: "Standard",
            price: product.price,
            stock: product.stock,
            image: product.image,
          },
        ];
  }

  function getPriceSummary(product) {
    const variants = getVariants(product);
    const prices = variants.map((variant) => Number(variant.price) || 0);
    const minimum = Math.min(...prices);
    const maximum = Math.max(...prices);

    return minimum === maximum
      ? formatPrice(minimum)
      : `${formatPrice(minimum)} – ${formatPrice(maximum)}`;
  }

  function getTotalStock(product) {
    return getVariants(product).reduce(
      (total, variant) => total + Math.max(0, Number(variant.stock) || 0),
      0,
    );
  }

  function getVariantLabel(variant) {
    if (variant.quantity !== undefined && variant.quantity !== "") {
      return `${variant.quantity} ${variant.unit || ""}`.trim();
    }

    return variant.size || "Standard";
  }

  const filteredProducts = products.filter((product) => {
    const searchValue = searchTerm.trim().toLowerCase();

    if (!searchValue) return true;

    return (
      product.name?.toLowerCase().includes(searchValue) ||
      product.category?.toLowerCase().includes(searchValue) ||
      product.categoryName?.toLowerCase().includes(searchValue) ||
      product.description?.toLowerCase().includes(searchValue) ||
      getVariants(product).some((variant) =>
        `${variant.quantity ?? ""} ${variant.unit ?? ""} ${variant.size ?? ""}`
          .toLowerCase()
          .includes(searchValue),
      )
    );
  });

  async function handleToggleActive(product) {
    try {
      setUpdatingProductId(product.id);
      setError("");

      const nextIsActive = product.isActive !== true;

      await updateProduct(product.id, {
        isActive: nextIsActive,
      });

      setProducts((current) =>
        current.map((item) =>
          item.id === product.id ? { ...item, isActive: nextIsActive } : item,
        ),
      );

      setSelectedProduct((current) =>
        current?.id === product.id
          ? { ...current, isActive: nextIsActive }
          : current,
      );

      showNotification(
        "success",
        `${product.name || "Product"} ${
          nextIsActive ? "activated" : "deactivated"
        } successfully.`,
      );
    } catch (err) {
      console.error("Failed to update product status:", err);

      showNotification(
        "error",
        "Unable to update product status. Please try again.",
      );
    } finally {
      setUpdatingProductId(null);
    }
  }

  function handleDeleteProduct(product) {
    setProductToDelete(product);
  }

  async function confirmDeleteProduct() {
    if (!productToDelete || deletingProductId) return;

    const product = productToDelete;

    try {
      setDeletingProductId(product.id);
      setError("");

      await deleteProduct(product.id);

      setProducts((current) =>
        current.filter((item) => item.id !== product.id),
      );

      setSelectedProduct((current) =>
        current?.id === product.id ? null : current,
      );

      setProductToDelete(null);

      showNotification(
        "success",
        `${product.name || "Product"} was deleted successfully.`,
      );
    } catch (err) {
      console.error("Failed to delete product:", err);

      showNotification(
        "error",
        `Unable to delete "${product.name || "product"}". Please try again.`,
      );
    } finally {
      setDeletingProductId(null);
    }
  }

  function closeDeleteModal() {
    if (deletingProductId) return;
    setProductToDelete(null);
  }

  const activeCount = products.filter(
    (product) => product.isActive === true,
  ).length;

  const totalStock = products.reduce(
    (total, product) => total + getTotalStock(product),
    0,
  );

  return (
    <section className={`relative min-w-0 space-y-6 ${colors.text}`}>
      {/* Notification */}
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
            className="shrink-0 rounded-lg p-1 opacity-70 transition hover:opacity-100"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold">Products</h1>
          <p className={`mt-1 text-sm leading-6 ${colors.muted}`}>
            Manage your products, variants, prices and inventory.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#3d6847] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#315539]"
        >
          <Plus size={18} />
          Add product
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <div className={`min-w-0 rounded-2xl border p-4 sm:p-5 ${colors.card}`}>
          <div className="flex items-center justify-between gap-3">
            <p className={`text-sm ${colors.muted}`}>Total products</p>
            <Package size={20} className="shrink-0 text-[#629467]" />
          </div>
          <p className="mt-3 text-2xl font-bold">{products.length}</p>
        </div>

        <div className={`min-w-0 rounded-2xl border p-4 sm:p-5 ${colors.card}`}>
          <div className="flex items-center justify-between gap-3">
            <p className={`text-sm ${colors.muted}`}>Active products</p>
            <Eye size={20} className="shrink-0 text-[#629467]" />
          </div>
          <p className="mt-3 text-2xl font-bold">{activeCount}</p>
        </div>

        <div className={`min-w-0 rounded-2xl border p-4 sm:p-5 ${colors.card}`}>
          <div className="flex items-center justify-between gap-3">
            <p className={`text-sm ${colors.muted}`}>Total variant stock</p>
            <Boxes size={20} className="shrink-0 text-[#629467]" />
          </div>
          <p className="mt-3 text-2xl font-bold">{totalStock}</p>
        </div>
      </div>

      {/* Search */}
      <div className={`rounded-2xl border p-3 sm:p-4 ${colors.card}`}>
        <div className="relative w-full">
          <Search
            size={18}
            className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${colors.muted}`}
          />

          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search products, categories or variants..."
            aria-label="Search products"
            className={`block w-full min-w-0 rounded-xl border py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#629467] focus:ring-2 focus:ring-[#629467]/20 ${colors.input}`}
          />
        </div>

        <div
          className={`mt-3 flex items-center justify-between gap-3 text-xs ${colors.muted}`}
        >
          <span>
            Showing {filteredProducts.length} of {products.length} products
          </span>

          <button
            type="button"
            onClick={loadProducts}
            disabled={loading}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 font-semibold transition hover:text-[#629467] disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Product list */}
      {loading ? (
        <div
          className={`flex items-center justify-center gap-3 rounded-2xl border p-12 ${colors.card} ${colors.muted}`}
        >
          <RefreshCw size={20} className="animate-spin" />
          Loading products...
        </div>
      ) : error ? (
        <div
          className={`flex flex-col items-center gap-3 rounded-2xl border p-10 text-center ${colors.card}`}
        >
          <AlertCircle size={32} className="text-red-500" />
          <p className="text-sm">{error}</p>
          <button
            type="button"
            onClick={loadProducts}
            className="rounded-xl bg-[#3d6847] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#315539]"
          >
            Try again
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div
          className={`flex flex-col items-center gap-3 rounded-2xl border p-10 text-center sm:p-14 ${colors.card}`}
        >
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl ${colors.subtle}`}
          >
            <Package size={30} className={colors.muted} />
          </div>

          <h2 className="text-lg font-semibold">
            {searchTerm ? "No matching products" : "No products yet"}
          </h2>

          <p className={`max-w-sm text-sm leading-6 ${colors.muted}`}>
            {searchTerm
              ? "Try searching with a different product name, category or variant."
              : "Your products will appear here after you add them to your store."}
          </p>

          {!searchTerm && (
            <Link
              to="/admin/products/new"
              className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[#3d6847] px-4 py-3 text-sm font-semibold text-white hover:bg-[#315539]"
            >
              <Plus size={17} />
              Add your first product
            </Link>
          )}
        </div>
      ) : (
        <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {filteredProducts.map((product) => {
            const stock = getTotalStock(product);
            const isActive = product.isActive === true;
            const isUpdating = updatingProductId === product.id;
            const isDeleting = deletingProductId === product.id;

            return (
              <article
                key={product.id}
                className={`flex min-w-0 flex-col overflow-hidden rounded-2xl border transition-shadow hover:shadow-md ${colors.card}`}
              >
                {/* Product image and status */}
                <div
                  className={`relative flex h-44 items-center justify-center overflow-hidden sm:h-48 ${colors.subtle}`}
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name || "Product"}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Package size={42} className={colors.muted} />
                  )}

                  <span
                    className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
                      isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {isActive ? "Active" : "Inactive"}
                  </span>

                  {product.featured && (
                    <span className="absolute right-3 top-3 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                      Featured
                    </span>
                  )}
                </div>

                {/* Product information */}
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <div className="min-w-0">
                    <h2 className="break-words text-base font-bold sm:text-lg">
                      {product.name || "Unnamed product"}
                    </h2>

                    <p
                      className={`mt-1 flex items-start gap-2 text-sm ${colors.muted}`}
                    >
                      <Tag size={15} className="mt-0.5 shrink-0" />
                      <span className="min-w-0 break-words">
                        {product.categoryName ||
                          product.category ||
                          "Uncategorised"}
                      </span>
                    </p>
                  </div>

                  <div
                    className={`mt-4 grid grid-cols-2 gap-3 rounded-xl p-3 ${colors.subtle}`}
                  >
                    <div className="min-w-0">
                      <p
                        className={`flex items-center gap-1.5 text-xs ${colors.muted}`}
                      >
                        <Banknote size={14} />
                        Price
                      </p>
                      <p className="mt-1 break-words text-sm font-bold">
                        {getPriceSummary(product)}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p
                        className={`flex items-center gap-1.5 text-xs ${colors.muted}`}
                      >
                        <Warehouse size={14} />
                        Total stock
                      </p>
                      <p
                        className={`mt-1 text-sm font-bold ${
                          stock === 0 ? "text-red-500" : ""
                        }`}
                      >
                        {stock} {stock === 1 ? "unit" : "units"}
                      </p>
                    </div>

                    <div className="col-span-2">
                      <p
                        className={`flex items-center gap-1.5 text-xs ${colors.muted}`}
                      >
                        <Layers size={14} />
                        Available variants
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {getVariants(product).length}{" "}
                        {getVariants(product).length === 1
                          ? "variant"
                          : "variants"}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(product)}
                      className={`inline-flex min-w-0 items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${colors.border} ${colors.hover}`}
                    >
                      <Eye size={16} />
                      View
                    </button>

                    <Link
                      to={`/admin/products/${product.id}/edit`}
                      className="inline-flex min-w-0 items-center justify-center gap-1.5 rounded-xl bg-[#3d6847] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#315539]"
                    >
                      <Pencil size={15} />
                      Edit
                    </Link>

                    <button
                      type="button"
                      disabled={isUpdating || isDeleting}
                      onClick={() => handleToggleActive(product)}
                      className={`inline-flex min-w-0 items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-xs font-semibold transition sm:text-sm ${colors.border} ${colors.hover} disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      {isUpdating ? (
                        <RefreshCw size={15} className="animate-spin" />
                      ) : (
                        <Power size={15} />
                      )}
                      <span className="truncate">
                        {isUpdating
                          ? "Saving..."
                          : isActive
                            ? "Deactivate"
                            : "Activate"}
                      </span>
                    </button>

                    <button
                      type="button"
                      disabled={isDeleting || isUpdating}
                      onClick={() => handleDeleteProduct(product)}
                      className="inline-flex min-w-0 items-center justify-center gap-1.5 rounded-xl border border-red-200 px-2 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                    >
                      {isDeleting ? (
                        <RefreshCw size={15} className="animate-spin" />
                      ) : (
                        <Trash2 size={15} />
                      )}
                      <span className="truncate">
                        {isDeleting ? "Deleting..." : "Delete"}
                      </span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Product overview modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-5"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-overview-title"
            className={`max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border shadow-2xl ${colors.card}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className={`sticky top-0 z-10 flex items-center justify-between gap-3 border-b p-4 sm:p-5 ${colors.border} ${colors.card}`}
            >
              <div className="min-w-0">
                <h2
                  id="product-overview-title"
                  className="text-lg font-bold sm:text-xl"
                >
                  Product overview
                </h2>
                <p className={`mt-1 text-xs sm:text-sm ${colors.muted}`}>
                  Product details and inventory
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                aria-label="Close product overview"
                className={`shrink-0 rounded-xl border p-2 transition ${colors.border} ${colors.hover}`}
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-5 p-4 sm:p-6">
              <div className="flex min-w-0 flex-col gap-4 sm:flex-row">
                {selectedProduct.image ? (
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name || "Product"}
                    className="h-48 w-full shrink-0 rounded-xl object-cover sm:h-36 sm:w-36"
                  />
                ) : (
                  <div
                    className={`flex h-32 w-full shrink-0 items-center justify-center rounded-xl sm:h-36 sm:w-36 ${colors.subtle}`}
                  >
                    <Package size={35} className={colors.muted} />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h3 className="break-words text-xl font-bold">
                    {selectedProduct.name || "Unnamed product"}
                  </h3>

                  <p className={`mt-2 break-words text-sm ${colors.muted}`}>
                    {selectedProduct.categoryName ||
                      selectedProduct.category ||
                      "Uncategorised"}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        selectedProduct.isActive === true
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {selectedProduct.isActive === true
                        ? "Active"
                        : "Inactive"}
                    </span>

                    {selectedProduct.featured && (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                        Featured
                      </span>
                    )}
                  </div>

                  <p
                    className={`mt-4 whitespace-pre-wrap break-words text-sm leading-6 ${colors.muted}`}
                  >
                    {selectedProduct.description || "No description provided."}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-bold">Variants and inventory</h3>

                <div className="space-y-3">
                  {getVariants(selectedProduct).map((variant, index) => (
                    <div
                      key={variant.id || index}
                      className={`flex min-w-0 items-center gap-3 rounded-xl border p-3 sm:gap-4 sm:p-4 ${colors.border}`}
                    >
                      {variant.image ? (
                        <img
                          src={variant.image}
                          alt={getVariantLabel(variant)}
                          className="h-16 w-16 shrink-0 rounded-lg object-cover sm:h-20 sm:w-20"
                        />
                      ) : (
                        <div
                          className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-lg sm:h-20 sm:w-20 ${colors.subtle}`}
                        >
                          <Package size={22} className={colors.muted} />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="break-words text-sm font-semibold">
                          {getVariantLabel(variant)}
                        </p>
                        <p className={`mt-1 text-sm ${colors.muted}`}>
                          Stock: {Number(variant.stock) || 0}
                        </p>
                      </div>

                      <p className="shrink-0 text-right text-sm font-bold sm:text-base">
                        {formatPrice(variant.price)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${colors.border} ${colors.hover}`}
                >
                  Close
                </button>

                <Link
                  to={`/admin/products/${selectedProduct.id}/edit`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3d6847] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#315539]"
                >
                  <Pencil size={16} />
                  Edit product
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Styled delete confirmation */}
      {productToDelete && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-5"
          onClick={closeDeleteModal}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-product-title"
            aria-describedby="delete-product-description"
            className={`w-full max-w-md rounded-2xl border p-5 shadow-2xl sm:p-6 ${colors.card}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 sm:h-12 sm:w-12">
                <Trash2 size={23} />
              </div>

              <div className="min-w-0 flex-1">
                <h2 id="delete-product-title" className="text-lg font-bold">
                  Delete this product?
                </h2>

                <p
                  id="delete-product-description"
                  className={`mt-2 text-sm leading-6 ${colors.muted}`}
                >
                  This will permanently remove the product from your store
                  database. This action cannot be undone.
                </p>
              </div>
            </div>

            <div
              className={`mt-5 flex min-w-0 items-center gap-3 rounded-xl border p-3 ${colors.border}`}
            >
              {productToDelete.image ? (
                <img
                  src={productToDelete.image}
                  alt=""
                  className="h-14 w-14 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg ${colors.subtle}`}
                >
                  <Package size={22} className={colors.muted} />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="break-words text-sm font-semibold">
                  {productToDelete.name || "Unnamed product"}
                </p>
                <p className={`mt-1 break-words text-xs ${colors.muted}`}>
                  {productToDelete.categoryName ||
                    productToDelete.category ||
                    "Uncategorised"}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={deletingProductId === productToDelete.id}
                onClick={closeDeleteModal}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition disabled:opacity-50 ${colors.border} ${colors.hover}`}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deletingProductId === productToDelete.id}
                onClick={confirmDeleteProduct}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingProductId === productToDelete.id ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Yes, delete product
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminProducts;
