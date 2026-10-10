import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "jk3-shopping-cart";

function readSavedCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item) =>
        item &&
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        Number.isFinite(item.price) &&
        item.price >= 0 &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0,
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readSavedCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // The cart still works in memory if browser storage is unavailable.
    }
  }, [items]);

  const addToCart = useCallback((product) => {
    if (!product || !Number.isFinite(Number(product.price))) return;

    const productId = String(product.productId ?? product.id ?? "");
    if (!productId) return;

    const variantId = String(product.variantId ?? "default");
    const id = `${productId}__${variantId}`;
    const requestedQuantity = Math.max(
      1,
      Math.floor(Number(product.quantity) || 1),
    );

    setItems((currentItems) => {
      const existing = currentItems.find((item) => item.id === id);

      if (existing) {
        return currentItems.map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + requestedQuantity }
            : item,
        );
      }

      return [
        ...currentItems,
        {
          id,
          productId,
          variantId,
          name: product.name,
          size: product.size ?? product.unit ?? "",
          price: Number(product.price),
          image: product.image ?? "",
          quantity: requestedQuantity,
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    const nextQuantity = Math.floor(Number(quantity));

    if (!Number.isFinite(nextQuantity)) return;

    if (nextQuantity <= 0) {
      setItems((currentItems) => currentItems.filter((item) => item.id !== id));
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, quantity: nextQuantity } : item,
      ),
    );
  }, []);

  const removeFromCart = useCallback((id) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const value = useMemo(
    () => ({
      items,
      cartCount,
      subtotal,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
    }),
    [
      items,
      cartCount,
      subtotal,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside a CartProvider");
  }

  return context;
}
