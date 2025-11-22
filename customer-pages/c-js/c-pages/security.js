/*
Secure Password Update + Logout for Customers
 */

import { auth } from "../services/firebase-init.js";
import {
  signOut,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

/* ------------------------------------------------
   Reusable Message Popup
-------------------------------------------------- */
function showMessagePopup(message, isError = false) {
  let popup = document.getElementById("successPopup");

  // Create if missing
  if (!popup) {
    popup = document.createElement("div");
    popup.id = "successPopup";
    popup.className = "message-popup-overlay";
    popup.innerHTML = `
      <div class="message-popup-box">
        <h3 id="popupMessage"></h3>
        <button id="popupCloseBtn">OK</button>
      </div>
    `;
    document.body.appendChild(popup);
  }

  const messageEl = popup.querySelector("#popupMessage");
  const closeBtn = popup.querySelector("#popupCloseBtn");

  messageEl.textContent = message;
  messageEl.style.color = isError ? "crimson" : "var(--deep-teal-blue)";

  popup.style.display = "flex";
  popup.classList.add("active");

  closeBtn.onclick = () => {
    popup.classList.remove("active");
    popup.style.display = "none";
  };

  setTimeout(() => {
    popup.classList.remove("active");
    popup.style.display = "none";
  }, 2500);
}

/* ------------------------------------------------
   DOM Elements
-------------------------------------------------- */
const securityForm = document.getElementById("securityForm");
const currentPasswordInput = document.getElementById("current-password");
const newPasswordInput = document.getElementById("new-password");
const signOutBtn = document.querySelector(".signout-btn");

/* ------------------------------------------------
   Guard: Ensure form exists
-------------------------------------------------- */
if (!securityForm) {
  console.error("⚠️ securityForm not found. Check your form ID.");
}

/* ------------------------------------------------
   Update Password
-------------------------------------------------- */
securityForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const currentPassword = currentPasswordInput.value.trim();
  const newPassword = newPasswordInput.value.trim();
  const user = auth.currentUser;

  if (!user) {
    showMessagePopup("Please log in first.", true);
    return;
  }

  if (!currentPassword || !newPassword) {
    showMessagePopup("Please fill in both password fields.", true);
    return;
  }

  if (currentPassword === newPassword) {
    showMessagePopup(
      "New password must be different from the current one.",
      true
    );
    return;
  }

  try {
    // 🔒 Step 1: Reauthenticate
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    await reauthenticateWithCredential(user, credential);
    console.log("Reauthentication success.");

    // 🔐 Step 2: Update password
    await updatePassword(user, newPassword);
    showMessagePopup("Password updated successfully!");

    // Clear input fields
    currentPasswordInput.value = "";
    newPasswordInput.value = "";
  } catch (err) {
    console.error("Error updating password:", err);

    if (err.code === "auth/wrong-password") {
      showMessagePopup("Incorrect current password. Please try again.", true);
    } else if (err.code === "auth/requires-recent-login") {
      showMessagePopup(
        "Please log in again before changing your password.",
        true
      );
    } else if (err.code === "auth/weak-password") {
      showMessagePopup(
        "Please use a stronger password (at least 6 characters).",
        true
      );
    } else {
      showMessagePopup(
        "Failed to update password. Please check your input.",
        true
      );
    }
  }
});

/* ------------------------------------------------
   Sign Out
-------------------------------------------------- */
signOutBtn?.addEventListener("click", async () => {
  try {
    await signOut(auth);
    showMessagePopup("You have been signed out successfully.");

    setTimeout(() => {
      window.location.href = "./auth-welcome.html";
    }, 2000);
  } catch (error) {
    console.error("Logout failed:", error);
    showMessagePopup("Failed to sign out. Try again.", true);
  }
});
