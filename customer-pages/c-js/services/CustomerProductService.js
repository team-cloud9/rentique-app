// js/CustomerProductService.js

/*
    SERVICE: CustomerProductService
    PURPOSE: Provides READ-ONLY access to product data for customers.
*/

// 共通のfirebase-init.jsから、初期化済みのdbをインポート
import { db } from "./firebase-init.js";
// Firestoreから、データの読み取りに必要な関数だけをインポート
import { collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

/**
 * すべての商品を取得して返す (Read All)
 * @returns {Promise<Array>} 商品オブジェクトの配列
 */
async function getAllProducts() {
    console.log("[CustomerService] Fetching all products for customer view...");
    try {
        const productsCol = collection(db, "products");
        const productSnapshot = await getDocs(productsCol);

        if (productSnapshot.empty) {
            console.warn("[CustomerService] No products found in the database.");
            return [];
        }

        const products = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(`[CustomerService] Successfully fetched ${products.length} products.`);
        return products;

    } catch (error) {
        console.error("[CustomerService] Error fetching all products:", error);
        throw new Error("Could not fetch products."); // エラーを呼び出し元に伝える
    }
}

/**
 * 指定されたIDの商品を1つだけ取得して返す (Read One)
 * @param {string} productId 商品のドキュメントID
 * @returns {Promise<Object>} 商品オブジェクト
 */
async function getProductById(productId) {
    console.log(`[CustomerService] Fetching single product with ID: ${productId}`);
    try {
        const docRef = doc(db, "products", productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            console.error(`[CustomerService] Product with ID ${productId} not found.`);
            throw new Error("Product not found.");
        }
    } catch (error) {
        console.error(`[CustomerService] Error fetching product by ID: ${productId}`, error);
        throw new Error("Could not fetch the product details.");
    }
}

// お客様向けの機能だけをまとめてエクスポート
export const CustomerProductService = {
    getAllProducts,
    getProductById,
};