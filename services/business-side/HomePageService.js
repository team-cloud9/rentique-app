// Description: Handles all Firestore database operations related to products for a business.

import { firestore } from './firebase-init.js';
import { collection, query, where, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

export async function getProductsByBusiness(businessId) {
  if (!businessId) {
    console.error("getProductsByBusiness Error: businessId is required.");
    return [];
  }

  try {
    const productsRef = collection(firestore, 'products');
    const q = query(productsRef, where("businessID", "==", businessId));

    const querySnapshot = await getDocs(q);
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });

    console.log(`Fetched ${products.length} products for business ID: ${businessId}`);
    return products;
  } catch (error) {
    console.error("Error fetching products by business:", error);
    return []; 
  }
}