import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";

const ORDERS_COLLECTION = "orders";

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "ready",
  "completed",
  "cancelled",
];

/**
 * Create a new customer order in Firestore.
 *
 * Expected input:
 * {
 *   customerName,
 *   customerPhone,
 *   deliveryAddress,
 *   notes,
 *   items: [{ productId, name, price, quantity }],
 *   subtotal,
 *   deliveryFee,
 *   total
 * }
 */
export async function createOrder(orderData) {
  const {
    customerName,
    customerPhone,
    deliveryAddress = "",
    notes = "",
    items,
    subtotal,
    deliveryFee = 0,
    total,
  } = orderData;

  if (!customerName?.trim()) {
    throw new Error("Please enter the customer's name.");
  }

  if (!customerPhone?.trim()) {
    throw new Error("Please enter a phone number.");
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("An order must contain at least one product.");
  }

  if (
    !Number.isFinite(Number(subtotal)) ||
    !Number.isFinite(Number(deliveryFee)) ||
    !Number.isFinite(Number(total)) ||
    Number(subtotal) < 0 ||
    Number(deliveryFee) < 0 ||
    Number(total) < 0
  ) {
    throw new Error("The order contains an invalid amount.");
  }

  const cleanItems = items.map((item) => {
    const quantity = Number(item.quantity);
    const price = Number(item.price);

    if (
      !item.name?.trim() ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      throw new Error("One or more products have invalid order details.");
    }

    return {
      productId: String(item.productId || ""),
      name: String(item.name).trim(),
      price,
      quantity,
    };
  });

  const orderRef = doc(collection(db, ORDERS_COLLECTION));
  const orderNumber = `JK3-${orderRef.id.slice(-8).toUpperCase()}`;

  const order = {
    orderNumber,
    customerName: customerName.trim(),
    customerPhone: customerPhone.trim(),
    deliveryAddress: deliveryAddress.trim(),
    notes: notes.trim(),
    items: cleanItems,
    subtotal: Number(subtotal),
    deliveryFee: Number(deliveryFee),
    total: Number(total),
    status: "pending",
    createdAt: serverTimestamp(),
  };

  await setDoc(orderRef, order);

  return {
    id: orderRef.id,
    ...order,
    orderNumber,
  };
}

/**
 * Retrieve orders for the admin dashboard.
 */
export async function getAllOrders() {
  const ordersQuery = query(
    collection(db, ORDERS_COLLECTION),
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(ordersQuery);

  return snapshot.docs.map((orderDoc) => ({
    id: orderDoc.id,
    ...orderDoc.data(),
  }));
}

/**
 * Update an order's status from the admin dashboard.
 */
export async function updateOrderStatus(orderId, status) {
  if (!orderId) {
    throw new Error("An order ID is required.");
  }

  if (!ORDER_STATUSES.includes(status)) {
    throw new Error("Invalid order status.");
  }

  await updateDoc(doc(db, ORDERS_COLLECTION, orderId), {
    status,
  });
}
