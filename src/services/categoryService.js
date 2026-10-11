import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "../firebase";

const categoriesCollection = collection(db, "categories");

// Get all categories for the admin dashboard.
export async function getAllCategories() {
  const snapshot = await getDocs(categoriesCollection);

  return snapshot.docs
    .map((categoryDoc) => ({
      id: categoryDoc.id,
      ...categoryDoc.data(),
    }))
    .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
}

// Create a category and prevent duplicate names.
export async function createCategory(name) {
  const trimmedName = name.trim();

  if (!trimmedName) {
    throw new Error("Category name is required.");
  }

  const normalizedName = trimmedName.toLowerCase();

  const duplicateQuery = query(
    categoriesCollection,
    where("normalizedName", "==", normalizedName),
  );

  const duplicateSnapshot = await getDocs(duplicateQuery);

  if (!duplicateSnapshot.empty) {
    throw new Error("This category already exists.");
  }

  const categoryRef = await addDoc(categoriesCollection, {
    name: trimmedName,
    normalizedName,
    isActive: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return categoryRef.id;
}

// Activate or deactivate a category.
export async function setCategoryActive(categoryId, isActive) {
  if (typeof isActive !== "boolean") {
    throw new Error("Category status must be active or inactive.");
  }

  const categoryRef = doc(db, "categories", categoryId);

  await updateDoc(categoryRef, {
    isActive,
    updatedAt: serverTimestamp(),
  });
}
