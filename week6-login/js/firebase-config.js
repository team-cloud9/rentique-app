// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";


// Your web app's Firebase configuration
 
const firebaseConfig = {
    apiKey: "AIzaSyC7BuP7MEYinthwkaYqx8Csn-BceUfqXOs",
    authDomain: "test1-authentication.firebaseapp.com",
    projectId: "test1-authentication",
    storageBucket: "test1-authentication.appspot.com",
    messagingSenderId: "715711552761",
    appId: "1:715711552761:web:836f8a6a682a5976cf5628"
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Export the services for the rest of your app to use
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);










































 //  const firebaseConfig = {
  //   apiKey: "AIzaSyDnHbGFsR-HV64Dw3rxAaO1ttKbPPfZWGM",
  //   authDomain: "test2-rentique.firebaseapp.com",
  //   projectId: "test2-rentique",
  //   storageBucket: "test2-rentique.firebasestorage.app",
  //   messagingSenderId: "262417457431",
  //   appId: "1:262417457431:web:6b8633b2630c02c8125752"
  // };
