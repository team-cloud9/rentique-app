/*
 Delete Customer Account
 */

import { auth, firestore } from "../services/firebase-init.js";
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import {
  doc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

/* ------------------------------------------------
   Reusable Message Popup
-------------------------------------------------- */
function showMessagePopup(message, isError = false) {
  let popup = document.getElementById("successPopup");

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
   Reusable Input Popup (for password prompt)
-------------------------------------------------- */
function showInputPopup(message, callback) {
  let inputPopup = document.createElement("div");
  inputPopup.className = "message-popup-overlay";
  inputPopup.innerHTML = `
    <div class="message-popup-box">
      <h3>${message}</h3>
      <input type="password" id="popupPasswordInput" placeholder="Enter your password" style="margin-bottom:1rem; padding:0.5rem; border:1px solid #ccc; border-radius:5px; width:80%;">
      <div style="display:flex; justify-content:center; gap:1rem;">
        <button id="popupConfirmBtn">Confirm</button>
        <button id="popupCancelBtn" style="background:#ccc; color:#333;">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(inputPopup);
  inputPopup.style.display = "flex";

  const passwordInput = inputPopup.querySelector("#popupPasswordInput");
  const confirmBtn = inputPopup.querySelector("#popupConfirmBtn");
  const cancelBtn = inputPopup.querySelector("#popupCancelBtn");

  confirmBtn.onclick = () => {
    const password = passwordInput.value.trim();
    inputPopup.remove();
    callback(password);
  };
  cancelBtn.onclick = () => {
    inputPopup.remove();
    callback(null);
  };
}

/* ------------------------------------------------
   DOM Elements
-------------------------------------------------- */
const deleteBtn = document.querySelector(".delete-confirm");
const cancelBtn = document.querySelector(".delete-cancel");

/* ------------------------------------------------
   Cancel button
-------------------------------------------------- */
cancelBtn?.addEventListener("click", () => {
  showMessagePopup("Account deletion canceled.");
  document.querySelector(".back-btn")?.click();
});

/* ------------------------------------------------
   Delete confirmation
-------------------------------------------------- */
deleteBtn?.addEventListener("click", async () => {
  // Confirm deletion intention
  const confirmationBox = document.createElement("div");
  confirmationBox.className = "message-popup-overlay";
  confirmationBox.innerHTML = `
    <div class="message-popup-box">
      <h3>⚠️ Are you sure you want to permanently delete your account?</h3>
      <div style="display:flex; justify-content:center; gap:1rem;">
        <button id="confirmYes">Yes</button>
        <button id="confirmNo" style="background:#ccc; color:#333;">No</button>
      </div>
    </div>
  `;
  document.body.appendChild(confirmationBox);
  confirmationBox.style.display = "flex";

  const confirmYes = confirmationBox.querySelector("#confirmYes");
  const confirmNo = confirmationBox.querySelector("#confirmNo");

  confirmNo.onclick = () => confirmationBox.remove();
  confirmYes.onclick = async () => {
    confirmationBox.remove();

    const user = auth.currentUser;

    if (!user) {
      showMessagePopup(
        "Please log in again before deleting your account.",
        true
      );
      window.location.href = "./auth-login-customer.html";
      return;
    }

    // Ask for password confirmation
    showInputPopup(
      "To confirm, please re-enter your current password:",
      async (password) => {
        if (!password) {
          showMessagePopup("Deletion canceled — no password entered.", true);
          return;
        }

        try {
          // Reauthenticate
          const credential = EmailAuthProvider.credential(user.email, password);
          await reauthenticateWithCredential(user, credential);

          // Delete from Firestore
          const userRef = doc(firestore, "customers", user.uid);
          await deleteDoc(userRef);

          // Delete from Firebase Auth
          await deleteUser(user);

          showMessagePopup("Your account has been permanently deleted.");

          setTimeout(() => {
            window.location.href = "./auth-welcome.html";
          }, 2000);
        } catch (err) {
          console.error("Error deleting account:", err);
          if (err.code === "auth/wrong-password") {
            showMessagePopup("Incorrect password. Please try again.", true);
          } else if (err.code === "auth/requires-recent-login") {
            showMessagePopup(
              "Please log in again before deleting your account.",
              true
            );
          } else {
            showMessagePopup(
              "Failed to delete account. Please try again later.",
              true
            );
          }
        }
      }
    );
  };
});
