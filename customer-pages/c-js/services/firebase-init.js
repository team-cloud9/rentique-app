// ===========================
// Firebase Initialization (Customer Side)
// ===========================
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";
import { firebaseConfig } from "./firebase-config.js";

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
export const firestore = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

console.log("Firebase initialized successfully for Customer Side");
