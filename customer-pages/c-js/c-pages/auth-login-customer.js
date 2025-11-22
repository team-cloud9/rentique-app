import { auth, firestore } from "../services/firebase-init.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const loginButton = loginForm.querySelector(".auth-btn");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    emailError.textContent = "";
    passwordError.textContent = "";

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email) {
      emailError.textContent = "Please enter your email.";
      return;
    }
    if (!password) {
      passwordError.textContent = "Please enter your password.";
      return;
    }

    loginButton.disabled = true;
    loginButton.textContent = "LOGGING IN...";

    try {
      // Firebase Auth Login
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("Login successful:", user.email);

      // Get profile data from Firestore
      const profileRef = doc(firestore, "customers", user.uid);
      const profileSnap = await getDoc(profileRef);

      let displayName = "User";
      let userRole = "customer";

      if (profileSnap.exists()) {
        const data = profileSnap.data();
        displayName = data.displayName || "User";
        userRole = data.role || "customer";
      }

      // Save to localStorage
      localStorage.setItem("userDisplayName", displayName);
      localStorage.setItem("userRole", userRole);

      console.log(`Cached user: ${displayName}, Role: ${userRole}`);

      // Redirect (customer only)
      if (userRole?.toLowerCase() === "customer") {
        window.location.href = "../../c-pages/c-home.html";
      } else {
        alert("You are not authorized for this page.");
      }
    } catch (error) {
      console.error("Login failed:", error);

      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/invalid-email" ||
        error.code === "auth/invalid-credential"
      ) {
        emailError.textContent = "No account found with this email.";
        alert("Login failed: Please check your email or password.");
      } else if (error.code === "auth/wrong-password") {
        passwordError.textContent = "Incorrect password.";
        alert("Login failed: Wrong password.");
      } else {
        alert("An unexpected error occurred: " + error.message);
      }
    } finally {
      loginButton.disabled = false;
      loginButton.textContent = "LOG IN";
    }
  });
});
