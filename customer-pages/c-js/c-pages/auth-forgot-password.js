// @Made By: Moonju (Customer Side Firebase Version)
import { auth } from "../services/firebase-init.js";
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("forgotPasswordForm");
  const emailInput = document.getElementById("email");
  const emailError = document.getElementById("emailError");

  if (!form) {
    console.warn("[auth-forgot-password.js] - 'forgotPasswordForm' not found.");
    return;
  }

  // ✅ Email validation
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  emailInput.addEventListener("blur", () => {
    const value = emailInput.value.trim();
    if (!value) {
      emailError.textContent = "Email is required.";
      emailInput.classList.add("error");
    } else if (!validateEmail(value)) {
      emailError.textContent = "Please enter a valid email.";
      emailInput.classList.add("error");
    }
  });

  emailInput.addEventListener("input", () => {
    emailError.textContent = "";
    emailInput.classList.remove("error");
  });

  // ✅ Submit handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    if (!email || !validateEmail(email)) {
      emailError.textContent = "Please enter a valid email.";
      emailInput.classList.add("error");
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = "SENDING...";

    try {
      await sendPasswordResetEmail(auth, email);
      alert(`If an account exists for ${email}, a reset link has been sent.`);
      window.location.href = "./auth-login-customer.html";
    } catch (error) {
      console.error("Password reset failed:", error);
      // Firebase intentionally hides whether the user exists or not
      alert(`If an account exists for ${email}, a reset link has been sent.`);
      window.location.href = "./auth-login-customer.html";
    }
  });
});
