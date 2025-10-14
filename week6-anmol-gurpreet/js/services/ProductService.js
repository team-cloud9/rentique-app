/*
    SERVICE: ProductService
    DEVELOPER: Anmol
*/
import { db } from "../services/firebase-init.js";
import { collection, addDoc, Timestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { StorageService } from "../services/StorageService.js";

async function uploadProductImages(imageFiles) {
  return await StorageService.uploadMultipleFiles(imageFiles, "product_images");
}

async function uploadMeasurementFile(measurementFile) {
  if (!measurementFile) {
    return null;
  }
  return await StorageService.uploadFile(measurementFile, "measurement_charts");
}

function assembleProductData(formData, imageURLs, measurementURL) {
  const finalData = {
    ...formData,
    images: imageURLs,
    measurementTableUrl: measurementURL,
    createdAt: Timestamp.fromDate(new Date()),
  };
  console.log("[ProductService] Assembled final product data:", finalData);
  return finalData;
}

async function saveProductDocument(productData) {
  try {
    console.log("[ProductService] Saving final product data to Firestore.");
    const docRef = await addDoc(collection(db, "products"), productData);
    console.log("[ProductService] Product successfully saved with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("[ProductService] Error saving product to Firestore:", error);
    throw new Error("Could not save the product to the database.");
  }
}

// Initiating a new clothing item.
async function createNewProduct(formData, imageFiles, measurementFile) {
  console.log("[ProductService] Starting 'createNewProduct' workflow...");
  console.log("[ProductService] Received form data:", formData);
  const imageURLs = await uploadProductImages(imageFiles);
  console.log("[ProductService] Product images uploaded. URLs:", imageURLs);
  const measurementURL = await uploadMeasurementFile(measurementFile);
  console.log("[ProductService] Measurement file uploaded. URL:", measurementURL);
  const productData = assembleProductData(formData, imageURLs, measurementURL);
  const docId = await saveProductDocument(productData);
  console.log("[ProductService] 'createNewProduct' workflow completed.");
  return docId;
}

export const ProductService = {
  createNewProduct: createNewProduct,
};