/*
  @Made By: Anmol Singh
 */
import { firestore } from "./firebase-init.js";
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  Timestamp, 
  setDoc 
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { StorageService } from "./StorageService.js";

async function createNewProduct(formData, imageFiles, measurementFile) {
  console.log("[ProductService] Starting 'createNewProduct' workflow...");
  if (!formData || !imageFiles || imageFiles.length === 0) {
    throw new Error("Form data and at least one image are required.");
  }
  
  const tempProductRef = doc(collection(firestore, "products"));
  const productId = tempProductRef.id;

  const uploadPromises = [
    StorageService.uploadMultipleFiles(imageFiles, `product_images/${productId}`),
    StorageService.uploadFile(measurementFile, `measurement_charts/${productId}`)
  ];

  const [imageURLs, measurementURL] = await Promise.all(uploadPromises);

  const productData = {
    ...formData,
    images: imageURLs,
    createdAt: Timestamp.fromDate(new Date()),
  };
  
  if (measurementURL) {
    productData.measurementTableUrl = measurementURL;
  }
  
  
  await setDoc(tempProductRef, productData);
  console.log("[ProductService] Product successfully created with ID:", productId);
  
  return { id: productId, ...productData };
}

async function getProductById(productId) {
  // ... (This function is correct and remains unchanged)
  console.log(`[ProductService] Fetching product with ID: ${productId}`);
  const docRef = doc(firestore, "products", productId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    return null;
  }
}

async function updateProduct(productId, updatedData, newImageFiles = [], imagesToDeleteUrls = [], existingImageUrls = []) {
  console.log(`[ProductService] Starting complex update for product: ${productId}`);
  const docRef = doc(firestore, "products", productId);
  const uploadPromises = StorageService.uploadMultipleFiles(newImageFiles, `product_images/${productId}`);
  const deletePromises = imagesToDeleteUrls.map(url => StorageService.deleteFileByUrl(url));
  const [newImageUrls] = await Promise.all([uploadPromises, Promise.all(deletePromises)]);
  const finalImageUrls = [...existingImageUrls, ...newImageUrls];
  const dataToUpdate = {
    ...updatedData,
    images: finalImageUrls,
    lastUpdatedAt: Timestamp.fromDate(new Date())
  };
  await updateDoc(docRef, dataToUpdate);
}

async function deleteProductById(productId) {
    console.log(`[ProductService] Starting full deletion for product ID: ${productId}`);
    const docRef = doc(firestore, "products", productId);
    const imagesFolderPath = `product_images/${productId}`;
    const chartsFolderPath = `measurement_charts/${productId}`;
    await Promise.all([
        deleteDoc(docRef),
        StorageService.deleteFolder(imagesFolderPath),
        StorageService.deleteFolder(chartsFolderPath)
    ]);
    console.log(`[ProductService] Full deletion complete for product ${productId}.`);
}

export const ProductService = {
  createNewProduct,
  getProductById,
  updateProduct,
  deleteProductById,
};