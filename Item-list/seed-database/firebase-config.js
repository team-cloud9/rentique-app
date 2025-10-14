// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA85b8yZ07ljoOdzQUoBwTR1XkT-Nc_KTU",
  authDomain: "rentique-e0cbf.firebaseapp.com",
  projectId: "rentique-e0cbf",
  storageBucket: "rentique-e0cbf.firebasestorage.app",
  messagingSenderId: "335659955469",
  appId: "1:335659955469:web:12dfc6e5646e2199432c44"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the services for the rest of your app to use
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);


// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCCZngrIqojSkyXj4qyR6jbNn-Pb7RMttw",
//   authDomain: "test4-rentique.firebaseapp.com",
//   projectId: "test4-rentique",
//   storageBucket: "test4-rentique.firebasestorage.app",
//   messagingSenderId: "961644995561",
//   appId: "1:961644995561:web:01260938f6a63a4b062178"
// };






































//  const firebaseConfig = {
//   apiKey: "AIzaSyDnHbGFsR-HV64Dw3rxAaO1ttKbPPfZWGM",
//   authDomain: "test2-rentique.firebaseapp.com",
//   projectId: "test2-rentique",
//   storageBucket: "test2-rentique.firebasestorage.app",
//   messagingSenderId: "262417457431",
//   appId: "1:262417457431:web:6b8633b2630c02c8125752"
// };
