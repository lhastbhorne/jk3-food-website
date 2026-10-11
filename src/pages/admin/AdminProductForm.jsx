import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ImagePlus,
  LoaderCircle,
  X,
  ChevronDown,
  Check,
  Plus,
  Trash2,
  Package,
} from "lucide-react";

import { getAllCategories } from "../../services/categoryService";
import {
  createProduct,
  getProductById,
  updateProduct,
} from "../../services/productService";
import { uploadProductImage } from "../../services/cloudinaryService";

const createEmptyVariant = () => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  quantity: "",
  unit: "litre",
  price: "",
  stock: "",
  image: "",
  imagePublicId: "",
  imageFile: null,
  imagePreview: "",
});

const UNIT_OPTIONS = [
  { value: "litre", label: "Litres (L)" },
  { value: "millilitre", label: "Millilitres (mL)" },
  { value: "kilogram", label: "Kilograms (kg)" },
  { value: "gram", label: "Grams (g)" },
  { value: "pack", label: "Packs" },
  { value: "piece", label: "Pieces" },
];

const INITIAL_FORM = {
  name: "",
  description: "",
  category: "",
  featured: false,
  isActive: true,
};

function AdminProductForm({ theme = "light" }) {
  const navigate = useNavigate();
  const { productId } = useParams();
  const isEditing = Boolean(productId);
  const isDark = theme === "dark";

  const [form, setForm] = useState(INITIAL_FORM);
  const [variants, setVariants] = useState([createEmptyVariant()]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoryLoadError, setCategoryLoadError] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);

  const [productLoading, setProductLoading] = useState(false);
  const [productLoadError, setProductLoadError] = useState("");

  const colors = {
    text: isDark ? "text-[#f0f4ed]" : "text-[#243328]",
    muted: isDark ? "text-[#bdc9ba]" : "text-[#647361]",
    card: isDark ? "bg-[#1b261e]" : "bg-white",
    border: isDark ? "border-[#405044]" : "border-[#8b9d85]/30",
    input: isDark
      ? "bg-[#141d17] border-[#405044] text-[#f0f4ed]"
      : "bg-white border-[#8b9d85]/40 text-[#243328]",
  };

  const inputClass = `mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-[#3d6847] focus:ring-2 focus:ring-[#3d6847]/15 ${colors.input}`;

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        setCategoryLoadError("");

        const data = await getAllCategories();

        if (!cancelled) {
          setCategories(data.filter((category) => category.isActive === true));
        }
      } catch (error) {
        console.error("Failed to load categories:", error);

        if (!cancelled) {
          setCategoryLoadError("Unable to load categories. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setCategoriesLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isEditing || !productId) return;

    let cancelled = false;

    const loadProduct = async () => {
      try {
        setProductLoading(true);
        setProductLoadError("");

        const product = await getProductById(productId);

        if (!product) {
          throw new Error("Product not found.");
        }

        if (cancelled) return;

        setForm({
          name: product.name || "",
          description: product.description || "",
          category: product.categoryId || "",
          featured: Boolean(product.featured),
          isActive: product.isActive !== false,
        });

        const existingVariants =
          Array.isArray(product.variants) && product.variants.length > 0
            ? product.variants
            : [
                {
                  quantity: "",
                  unit: "litre",
                  price: product.price ?? "",
                  stock: product.stock ?? "",
                  image: product.image || "",
                  imagePublicId: product.imagePublicId || "",
                },
              ];

        const loadedVariants = existingVariants.map((variant) => {
          const sizeParts = String(variant.size || "")
            .trim()
            .split(/\s+/);

          const quantity = variant.quantity ?? (sizeParts[0] || "");

          const unit = variant.unit || sizeParts[1] || "litre";

          const image = variant.image || "";

          return {
            id:
              variant.id ||
              `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            quantity: String(quantity),
            unit,
            price: String(variant.price ?? ""),
            stock: String(variant.stock ?? ""),
            image,
            imagePublicId: variant.imagePublicId || "",
            imageFile: null,
            imagePreview: image,
          };
        });

        setVariants(loadedVariants);
      } catch (error) {
        if (!cancelled) {
          setProductLoadError(
            error.message || "Failed to load product details.",
          );
        }
      } finally {
        if (!cancelled) {
          setProductLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [isEditing, productId]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  }

  function handleVariantChange(variantId, field, value) {
    setVariants((current) =>
      current.map((variant) =>
        variant.id === variantId ? { ...variant, [field]: value } : variant,
      ),
    );

    setErrors((current) => ({
      ...current,
      [`${variantId}-${field}`]: "",
    }));
  }

  function handleVariantImageChange(variantId, event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((current) => ({
        ...current,
        [`${variantId}-image`]: "Please select a valid image file.",
      }));
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((current) => ({
        ...current,
        [`${variantId}-image`]: "Image size must not exceed 5 MB.",
      }));
      event.target.value = "";
      return;
    }

    const imagePreview = URL.createObjectURL(file);

    setVariants((current) =>
      current.map((variant) => {
        if (variant.id !== variantId) return variant;

        if (variant.imagePreview) {
          URL.revokeObjectURL(variant.imagePreview);
        }

        return {
          ...variant,
          imageFile: file,
          imagePreview,
        };
      }),
    );

    setErrors((current) => ({
      ...current,
      [`${variantId}-image`]: "",
    }));
  }

  function removeVariantImage(variantId) {
    setVariants((current) =>
      current.map((variant) => {
        if (variant.id !== variantId) return variant;

        if (variant.imagePreview) {
          URL.revokeObjectURL(variant.imagePreview);
        }

        return {
          ...variant,
          imageFile: null,
          imagePreview: "",
        };
      }),
    );

    setErrors((current) => ({
      ...current,
      [`${variantId}-image`]: "",
    }));
  }

  function addVariant() {
    setVariants((current) => [...current, createEmptyVariant()]);
  }

  function removeVariant(variantId) {
    setVariants((current) => {
      if (current.length <= 1) return current;

      const removed = current.find((variant) => variant.id === variantId);

      if (removed?.imagePreview) {
        URL.revokeObjectURL(removed.imagePreview);
      }

      return current.filter((variant) => variant.id !== variantId);
    });

    setErrors((current) => {
      const nextErrors = { ...current };

      Object.keys(nextErrors).forEach((key) => {
        if (key.startsWith(`${variantId}-`)) {
          delete nextErrors[key];
        }
      });

      return nextErrors;
    });
  }

  function validateForm() {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Product name is required.";
    }

    if (!form.description.trim()) {
      nextErrors.description = "Product description is required.";
    }

    if (!form.category) {
      nextErrors.category = "Please select a category.";
    } else if (!categories.some((category) => category.id === form.category)) {
      nextErrors.category =
        "This category is no longer active. Please select another.";
    }

    variants.forEach((variant, index) => {
      const prefix = `Variant ${index + 1}`;

      if (
        variant.quantity === "" ||
        !Number.isFinite(Number(variant.quantity)) ||
        Number(variant.quantity) <= 0
      ) {
        nextErrors[`${variant.id}-quantity`] =
          `${prefix}: enter a quantity greater than zero.`;
      }

      if (!variant.unit) {
        nextErrors[`${variant.id}-unit`] = `${prefix}: select a unit.`;
      }

      if (
        variant.price === "" ||
        !Number.isFinite(Number(variant.price)) ||
        Number(variant.price) <= 0
      ) {
        nextErrors[`${variant.id}-price`] =
          `${prefix}: enter a price greater than zero.`;
      }

      if (
        variant.stock === "" ||
        !Number.isInteger(Number(variant.stock)) ||
        Number(variant.stock) < 0
      ) {
        nextErrors[`${variant.id}-stock`] =
          `${prefix}: enter a whole number of zero or more.`;
      }

      if (!variant.imageFile && !variant.image) {
        nextErrors[`${variant.id}-image`] =
          `${prefix}: please select an image.`;
      }
    });

    // Prevent duplicate quantity and unit combinations.
    const seenVariants = new Set();

    variants.forEach((variant) => {
      if (
        variant.quantity === "" ||
        !Number.isFinite(Number(variant.quantity)) ||
        Number(variant.quantity) <= 0 ||
        !variant.unit
      ) {
        return;
      }

      const key = `${Number(variant.quantity)}-${variant.unit}`;

      if (seenVariants.has(key)) {
        nextErrors[`${variant.id}-quantity`] =
          "This quantity and unit combination already exists.";
      }

      seenVariants.add(key);
    });

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const selectedCategory = categories.find(
        (category) => category.id === form.category,
      );

      if (!selectedCategory) {
        throw new Error(
          "The selected category is no longer available. Please select an active category.",
        );
      }

      const savedVariants = [];

      for (const variant of variants) {
        let image = variant.image || "";
        let imagePublicId = variant.imagePublicId || "";

        // Upload an image only if a new image was selected.
        if (variant.imageFile) {
          const uploadedImage = await uploadProductImage(variant.imageFile);

          image = uploadedImage.url;
          imagePublicId = uploadedImage.publicId;
        }

        // A variant must have either an existing image or a new upload.
        if (!image) {
          throw new Error(
            `Please select an image for ${variant.quantity} ${variant.unit}.`,
          );
        }

        savedVariants.push({
          id: variant.id,
          quantity: Number(variant.quantity),
          unit: variant.unit,
          size: `${variant.quantity} ${variant.unit}`,
          price: Number(variant.price),
          stock: Number(variant.stock),
          image,
          imagePublicId,
        });
      }

      const firstVariant = savedVariants[0];

      const productData = {
        name: form.name.trim(),
        description: form.description.trim(),

        categoryId: selectedCategory.id,
        categoryName: selectedCategory.name,

        // Keep compatibility with existing storefront components.
        category: selectedCategory.name,
        price: firstVariant.price,
        stock: firstVariant.stock,
        image: firstVariant.image,
        imagePublicId: firstVariant.imagePublicId,

        variants: savedVariants,

        featured: form.featured,
        isActive: form.isActive,
      };

      if (isEditing) {
        await updateProduct(productId, productData);
      } else {
        await createProduct(productData);
      }

      navigate("/admin/products", { replace: true });
    } catch (error) {
      console.error(
        isEditing ? "Failed to update product:" : "Failed to create product:",
        error,
      );

      setErrors((current) => ({
        ...current,
        form:
          error.message ||
          `Unable to ${isEditing ? "update" : "create"} product. Please try again.`,
      }));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className={`mx-auto max-w-4xl space-y-6 ${colors.text}`}>
      <div className="flex items-center gap-3">
        <Link
          to="/admin/products"
          className={`rounded-xl border p-2 transition hover:opacity-75 ${colors.border} ${colors.card}`}
          aria-label="Back to products"
        >
          <ArrowLeft size={20} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold">Add Product</h1>
          <p className={`mt-1 text-sm ${colors.muted}`}>
            Add a product and configure its available sizes and prices.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className={`space-y-8 rounded-2xl border p-5 sm:p-7 ${colors.border} ${colors.card}`}
      >
        {errors.form && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errors.form}
          </div>
        )}

        {/* Product information */}
        <div className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold">Product information</h2>
            <p className={`mt-1 text-sm ${colors.muted}`}>
              Enter the details shared by all sizes of this product.
            </p>
          </div>

          <div>
            <label htmlFor="name" className="text-sm font-semibold">
              Product name *
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Red Oil"
              className={inputClass}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="text-sm font-semibold">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe the product..."
              className={inputClass}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Custom category dropdown */}
          <div className="relative">
            <label className="text-sm font-semibold">Category *</label>

            <button
              type="button"
              disabled={
                categoriesLoading ||
                categories.length === 0 ||
                Boolean(categoryLoadError)
              }
              onClick={() => setCategoryOpen((open) => !open)}
              className={`mt-2 flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#3d6847]/20 disabled:cursor-not-allowed disabled:opacity-60 ${colors.input} ${
                categoryOpen ? "border-[#3d6847] ring-2 ring-[#3d6847]/20" : ""
              }`}
            >
              <span className={form.category ? "" : colors.muted}>
                {categoriesLoading
                  ? "Loading categories..."
                  : categoryLoadError
                    ? "Categories unavailable"
                    : categories.find((item) => item.id === form.category)
                        ?.name ||
                      (categories.length === 0
                        ? "No active categories available"
                        : "Select a category")}
              </span>

              <ChevronDown
                size={18}
                className={`shrink-0 transition-transform duration-200 ${
                  categoryOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {categoryOpen && (
              <>
                <button
                  type="button"
                  aria-label="Close category menu"
                  className="fixed inset-0 z-10 cursor-default"
                  onClick={() => setCategoryOpen(false)}
                />

                <div
                  className={`absolute left-0 right-0 top-full z-20 mt-2 max-h-60 overflow-y-auto rounded-2xl border p-1.5 shadow-xl ${
                    isDark
                      ? "border-[#405044] bg-[#1b261e]"
                      : "border-[#8b9d85]/30 bg-white"
                  }`}
                >
                  {categories.map((category) => {
                    const selected = form.category === category.id;

                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => {
                          setForm((current) => ({
                            ...current,
                            category: category.id,
                          }));

                          setErrors((current) => ({
                            ...current,
                            category: "",
                          }));

                          setCategoryOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm transition-colors ${
                          selected
                            ? "bg-[#3d6847]/10 font-semibold text-[#3d6847]"
                            : isDark
                              ? "text-[#f0f4ed] hover:bg-[#243328]"
                              : "text-[#243328] hover:bg-[#f3f6ef]"
                        }`}
                      >
                        <span>{category.name}</span>
                        {selected && <Check size={17} />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {categoryLoadError && (
              <p className="mt-2 text-sm text-red-500">{categoryLoadError}</p>
            )}

            {!categoriesLoading &&
              !categoryLoadError &&
              categories.length === 0 && (
                <p className="mt-2 text-sm text-amber-600">
                  Add or activate a category in Category Management first.
                </p>
              )}

            {errors.category && (
              <p className="mt-2 text-sm text-red-500">{errors.category}</p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-1.5 text-sm">
              <span className={colors.muted}>
                Can't find the category you need?
              </span>

              <Link
                to="/admin/categories"
                className="font-semibold text-[#3d6847] transition-colors hover:text-[#315539] hover:underline"
              >
                Create a new category ↗
              </Link>
            </div>
          </div>
        </div>

        {/* Product variants */}
        <div className={`space-y-5 border-t pt-7 ${colors.border}`}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Product variants</h2>
              <p className={`mt-1 text-sm ${colors.muted}`}>
                Give every size its own price, stock quantity, and image.
              </p>
            </div>

            <button
              type="button"
              onClick={addVariant}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-[#3d6847]/40 px-4 py-2.5 text-sm font-semibold text-[#3d6847] transition hover:bg-[#3d6847]/10"
            >
              <Plus size={17} />
              Add variant
            </button>
          </div>

          {variants.map((variant, index) => (
            <div
              key={variant.id}
              className={`space-y-5 rounded-2xl border p-4 sm:p-5 ${colors.border}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3d6847]/10 text-[#3d6847]">
                    <Package size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Variant {index + 1}</h3>
                    <p className={`text-xs ${colors.muted}`}>
                      Size, price, inventory and image
                    </p>
                  </div>
                </div>

                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(variant.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-red-500 transition hover:bg-red-500/10"
                  >
                    <Trash2 size={16} />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor={`quantity-${variant.id}`}
                    className="text-sm font-semibold"
                  >
                    Quantity *
                  </label>

                  <input
                    id={`quantity-${variant.id}`}
                    type="number"
                    min="0.01"
                    step="any"
                    value={variant.quantity}
                    onChange={(event) =>
                      handleVariantChange(
                        variant.id,
                        "quantity",
                        event.target.value,
                      )
                    }
                    placeholder="e.g. 1, 5, 10"
                    className={inputClass}
                  />

                  {errors[`${variant.id}-quantity`] && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors[`${variant.id}-quantity`]}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor={`unit-${variant.id}`}
                    className="text-sm font-semibold"
                  >
                    Unit *
                  </label>

                  <select
                    id={`unit-${variant.id}`}
                    value={variant.unit}
                    onChange={(event) =>
                      handleVariantChange(
                        variant.id,
                        "unit",
                        event.target.value,
                      )
                    }
                    className={inputClass}
                  >
                    {UNIT_OPTIONS.map((unit) => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor={`price-${variant.id}`}
                    className="text-sm font-semibold"
                  >
                    Price (₦) *
                  </label>
                  <input
                    id={`price-${variant.id}`}
                    type="number"
                    min="1"
                    step="1"
                    value={variant.price}
                    onChange={(event) =>
                      handleVariantChange(
                        variant.id,
                        "price",
                        event.target.value,
                      )
                    }
                    placeholder="e.g. 2500"
                    className={inputClass}
                  />
                  {errors[`${variant.id}-price`] && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors[`${variant.id}-price`]}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor={`stock-${variant.id}`}
                    className="text-sm font-semibold"
                  >
                    Stock quantity *
                  </label>
                  <input
                    id={`stock-${variant.id}`}
                    type="number"
                    min="0"
                    step="1"
                    value={variant.stock}
                    onChange={(event) =>
                      handleVariantChange(
                        variant.id,
                        "stock",
                        event.target.value,
                      )
                    }
                    placeholder="e.g. 20"
                    className={inputClass}
                  />
                  {errors[`${variant.id}-stock`] && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors[`${variant.id}-stock`]}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor={`variant-image-${variant.id}`}
                  className="text-sm font-semibold"
                >
                  Image for this size *
                </label>

                {variant.imagePreview ? (
                  <div className="relative mt-3 w-fit">
                    <img
                      src={variant.imagePreview}
                      alt={`${form.name || "Product"} ${
                        variant.quantity
                          ? `${variant.quantity} ${variant.unit}`
                          : "variant"
                      } preview`}
                      className="h-44 w-44 rounded-xl border object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => removeVariantImage(variant.id)}
                      className="absolute -right-3 -top-3 rounded-full bg-red-600 p-2 text-white shadow transition hover:bg-red-700"
                      aria-label={`Remove image for variant ${index + 1}`}
                    >
                      <X size={16} />
                    </button>

                    <label
                      htmlFor={`variant-image-${variant.id}`}
                      className="mt-3 inline-block cursor-pointer text-sm font-semibold text-[#3d6847] hover:underline"
                    >
                      Choose a different image
                    </label>
                  </div>
                ) : (
                  <label
                    htmlFor={`variant-image-${variant.id}`}
                    className={`mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-7 text-center transition hover:border-[#3d6847] hover:bg-[#3d6847]/5 ${colors.border}`}
                  >
                    <ImagePlus size={30} className={colors.muted} />
                    <span className="mt-3 text-sm font-medium">
                      Upload variant image
                    </span>
                    <span className={`mt-1 text-xs ${colors.muted}`}>
                      Image files only · Maximum 5 MB
                    </span>
                  </label>
                )}

                <input
                  id={`variant-image-${variant.id}`}
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    handleVariantImageChange(variant.id, event)
                  }
                  className="sr-only"
                />

                {errors[`${variant.id}-image`] && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors[`${variant.id}-image`]}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Visibility options */}
        <div className={`space-y-4 border-t pt-6 ${colors.border}`}>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
              className="h-4 w-4 accent-[#3d6847]"
            />
            Feature this product on the homepage
          </label>

          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              className="h-4 w-4 accent-[#3d6847]"
            />
            Make this product visible to customers
          </label>
        </div>

        <div className={`border-t pt-5 ${colors.border}`}>
          <button
            type="submit"
            disabled={
              submitting ||
              categoriesLoading ||
              Boolean(categoryLoadError) ||
              categories.length === 0
            }
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#3d6847] px-5 py-3 font-semibold text-white transition hover:bg-[#315539] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {submitting && <LoaderCircle size={18} className="animate-spin" />}
            {submitting ? "Saving product..." : "Save product"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AdminProductForm;
