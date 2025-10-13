
// FIREBASE AUTHENTICATION LOGIC

import { app, auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import {
  setDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

console.log("Firebase initialized:", app.name);


// SIGNUP FUNCTION

export async function signUpUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log(" Account created:", user.email);
    alert("Account created successfully!");
    window.location.href = "profile.html";
  } catch (error) {
    console.error("Signup error:", error.message);
    alert(" Signup failed: " + error.message);
  }
}


// LOGIN FUNCTION

export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("🎉 Login success:", userCredential.user.email);
    alert("Welcome back!");
    window.location.href = "profile.html";
  } catch (error) {
    console.error("Login error:", error.message);
    alert(" Login failed: " + error.message);
  }
}


// SAVE PROFILE INFO

export async function saveUserProfile(name, address) {
  const user = auth.currentUser;
  if (!user) {
    alert("Please log in first.");
    return;
  }

  try {
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      name: name,
      address: address
    });
    alert("Profile saved successfully!");
    window.location.href = "Questionnaire1.html";
  } catch (error) {
    alert(" Error saving profile: " + error.message);
  }
}


// SAVE QUESTIONNAIRE INFO

export async function saveQuestionnaire(data, nextPage) {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, data);
    console.log(" Questionnaire data saved:", data);
    window.location.href = nextPage;
  } catch (error) {
    alert("Error saving answers: " + error.message);
  }
}


// LOGOUT FUNCTION

export async function logoutUser() {
  try {
    await signOut(auth);
    alert("Logged out successfully!");
    window.location.href = "index.html";
  } catch (error) {
    alert("Logout failed: " + error.message);
  }
}
