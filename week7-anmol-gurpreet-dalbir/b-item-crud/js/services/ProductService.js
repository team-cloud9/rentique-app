/*
    SERVICE: ProductService
    DEVELOPER: Anmol
*/
import { db } from "./firebase-init.js";
import { collection, doc, addDoc, getDoc, updateDoc, deleteDoc, Timestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { StorageService } from "./StorageService.js";

async function getProductById(productId) {
  console.log(`[ProductService] Fetching product with ID: ${productId}`);
  const docRef = doc(db, "products", productId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    throw new Error("Product not found.");
  }
}

async function createNewProduct(formData, imageFiles, measurementFile) {
  console.log("[ProductService] Starting 'createNewProduct' workflow...");
  const imageURLs = await StorageService.uploadMultipleFiles(imageFiles, "product_images");
  const measurementURL = await StorageService.uploadFile(measurementFile, "measurement_charts");

  const productData = {
    ...formData,
    images: imageURLs,
    measurementTableUrl: measurementURL,
    createdAt: Timestamp.fromDate(new Date()),
  };
  
  const docRef = await addDoc(collection(db, "products"), productData);
  console.log("[ProductService] Product successfully saved with ID:", docRef.id);
  
  return { id: docRef.id, ...productData };
}

async function updateProduct(productId, updatedData) {
  console.log(`[ProductService] Updating product with ID: ${productId}`);
  try {
    const docRef = doc(db, "products", productId);
    await updateDoc(docRef, updatedData);
    console.log("[ProductService] Product successfully updated.");
    return { id: productId, ...updatedData };
  } catch (error) {
    console.error("[ProductService] Error updating product:", error);
    throw new Error("Could not update the product in the database.");
  }
}

async function deleteProductById(productId) {
  console.log(`[ProductService] Deleting product with ID: ${productId}`);
  try {
    const docRef = doc(db, "products", productId);
    await deleteDoc(docRef);
    console.log("[ProductService] Product document successfully deleted from Firestore.");
  } catch (error) {
    console.error("[ProductService] Error deleting product from Firestore:", error);
    throw new Error("Could not delete the product from the database.");
  }
}

export const ProductService = {
  getProductById,
  createNewProduct,
  updateProduct,
  deleteProductById,
};