import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "../firebase";

const productsCollection = collection(db, "products");

// Get active products for the customer website.
export async function getActiveProducts() {
  const productsQuery = query(
    productsCollection,
    where("isActive", "==", true),
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(productsQuery);

  return snapshot.docs.map((productDoc) => ({
    id: productDoc.id,
    ...productDoc.data(),
  }));
}

// Get all products for the admin interface.
export async function getAllProducts() {
  const productsQuery = query(productsCollection, orderBy("createdAt", "desc"));

  const snapshot = await getDocs(productsQuery);

  return snapshot.docs.map((productDoc) => ({
    id: productDoc.id,
    ...productDoc.data(),
  }));
}

// Get a single product by its document ID.
export async function getProductById(productId) {
  const productRef = doc(db, "products", productId);
  const snapshot = await getDoc(productRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

// Create a product.
export async function createProduct(productData) {
  const productRef = await addDoc(productsCollection, {
    ...productData,
    isActive: productData.isActive ?? true,
    featured: productData.featured ?? false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return productRef.id;
}

// Update a product.
export async function updateProduct(productId, productData) {
  const productRef = doc(db, "products", productId);

  await updateDoc(productRef, {
    ...productData,
    updatedAt: serverTimestamp(),
  });
}

// Delete a product.
export async function deleteProduct(productId) {
  const productRef = doc(db, "products", productId);

  await deleteDoc(productRef);
}

// Toggle whether a product is active.
export async function setProductActive(productId, isActive) {
  const productRef = doc(db, "products", productId);

  await updateDoc(productRef, {
    isActive,
    updatedAt: serverTimestamp(),
  });
}

// Get the most recently created active products.
export async function getLatestProducts(maxProducts = 8) {
  const productsQuery = query(
    productsCollection,
    where("isActive", "==", true),
    orderBy("createdAt", "desc"),
    limit(maxProducts),
  );

  const snapshot = await getDocs(productsQuery);

  return snapshot.docs.map((productDoc) => ({
    id: productDoc.id,
    ...productDoc.data(),
  }));
}
