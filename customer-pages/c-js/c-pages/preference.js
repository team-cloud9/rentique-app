/*
 Customer Preference Page
 */

import { auth, firestore } from "../../c-js/services/firebase-init.js";
import {
  doc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

// === DOM Elements ===
const heightInput = document.querySelector('input[placeholder="Height (cm)"]');
const weightInput = document.querySelector('input[placeholder="Weight (kg)"]');
const genderInput = document.querySelector(
  'input[placeholder="Gender (Male/Female/Other)"]'
);
const saveBtn = document.querySelector(".save-btn");

// Buttons for popups
const styleBtn = document.querySelector('[data-popup="style"]');
const colorBtn = document.querySelector('[data-popup="color"]');
const tryBtn = document.querySelector('[data-popup="try"]');

// Selected values
let favoriteColors = [];
let favoriteStyles = [];
let stylesToTry = [];

let currentUserId = null;

/* ------------------------------------------------
   Message Popup (for save success / error)
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
   Load customer data from Firestore
-------------------------------------------------- */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    showMessagePopup("Please log in first!", true);
    window.location.href = "./auth-login-customer.html";
    return;
  }

  currentUserId = user.uid;
  const userRef = doc(firestore, "customers", currentUserId);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    const data = snap.data();
    const prefs = data.personalization || {};

    heightInput.value = prefs.height || "";
    weightInput.value = prefs.weight || "";
    genderInput.value = prefs.gender || "";

    favoriteColors = prefs.favoriteColors || [];
    favoriteStyles = prefs.favoriteStyles || [];
    stylesToTry = prefs.stylesToTry || [];

    console.log("Loaded personalization:", prefs);
  }
});

/* ------------------------------------------------
   Popup for selecting styles & colors
-------------------------------------------------- */
function showSelectionPopup(type, options, selectedValues, callback) {
  const popup = document.createElement("div");
  popup.className = "popup-overlay";
  const isColor = type.includes("color");

  popup.innerHTML = `
    <div class="popup-content">
      <h3>Select your ${type}</h3>
      <div class="options-grid ${isColor ? "color-grid" : "style-grid"}">
        ${options
          .map(
            (opt) => `
          <div class="option-item ${opt.toLowerCase()} ${
              selectedValues.includes(opt) ? "active" : ""
            } ${isColor ? "color" : "style"}">
            ${opt}
          </div>
        `
          )
          .join("")}
      </div>
      <div class="popup-actions">
        <button class="popup-save">Save</button>
        <button class="popup-cancel">Cancel</button>
      </div>
    </div>
  `;

  document.body.appendChild(popup);

  // active toggle
  popup.querySelectorAll(".option-item").forEach((item) => {
    item.addEventListener("click", () => {
      item.classList.toggle("active");
    });
  });

  // save handler
  popup.querySelector(".popup-save").addEventListener("click", () => {
    const selected = Array.from(
      popup.querySelectorAll(".option-item.active")
    ).map((el) => el.textContent.trim());
    callback(selected);
    popup.remove();
  });

  // cancel handler
  popup
    .querySelector(".popup-cancel")
    .addEventListener("click", () => popup.remove());
}

/* ------------------------------------------------
   Attach button click events
-------------------------------------------------- */
styleBtn.addEventListener("click", () => {
  showSelectionPopup(
    "favorite style",
    [
      "Casual",
      "Formal",
      "Business",
      "Party",
      "Dressy",
      "Vintage",
      "Street Style",
      "Minimalist",
      "Sporty",
      "Elegant",
      "Preppy",
      "Y2K",
    ],
    favoriteStyles,
    (selected) => {
      favoriteStyles = selected;
      showMessagePopup(
        `Updated favorite styles: ${selected.join(", ") || "None"}`
      );
    }
  );
});

colorBtn.addEventListener("click", () => {
  showSelectionPopup(
    "favorite color",
    [
      "Black",
      "White",
      "Grey",
      "Beige",
      "Brown",
      "Navy",
      "Red",
      "Pink",
      "Orange",
      "Yellow",
      "Green",
      "Blue",
      "Purple",
    ],
    favoriteColors,
    (selected) => {
      favoriteColors = selected;
      showMessagePopup(
        `Updated favorite colors: ${selected.join(", ") || "None"}`
      );
    }
  );
});

tryBtn.addEventListener("click", () => {
  showSelectionPopup(
    "style you want to try",
    [
      "Casual",
      "Formal",
      "Business",
      "Party",
      "Dressy",
      "Vintage",
      "Street Style",
      "Minimalist",
      "Sporty",
      "Elegant",
      "Preppy",
      "Y2K",
    ],
    stylesToTry,
    (selected) => {
      stylesToTry = selected;
      showMessagePopup(
        `Updated styles to try: ${selected.join(", ") || "None"}`
      );
    }
  );
});

/* ------------------------------------------------
   Save personalization updates
-------------------------------------------------- */
saveBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  if (!currentUserId) return;

  const height = heightInput.value.trim();
  const weight = weightInput.value.trim();
  const gender = genderInput.value.trim();

  try {
    const userRef = doc(firestore, "customers", currentUserId);
    await updateDoc(userRef, {
      personalization: {
        height,
        weight,
        gender,
        favoriteColors,
        favoriteStyles,
        stylesToTry,
      },
    });

    // Update localStorage too
    const cached = JSON.parse(localStorage.getItem("userData")) || {};
    cached.personalization = {
      height,
      weight,
      gender,
      favoriteColors,
      favoriteStyles,
      stylesToTry,
    };
    localStorage.setItem("userData", JSON.stringify(cached));

    showMessagePopup("Preferences updated successfully!");
  } catch (err) {
    console.error("Error updating preferences:", err);
    showMessagePopup("Failed to update preferences.", true);
  }
});
