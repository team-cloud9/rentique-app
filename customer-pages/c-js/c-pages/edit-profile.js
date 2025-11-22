/*
 Customer Edit Profile
 */

import { auth, firestore, storage } from "../../c-js/services/firebase-init.js";
import {
  doc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

/* ------------------------------------------------
   Wait until elements exist (for dynamic load)
-------------------------------------------------- */
function waitForElement(selector, timeout = 2000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const timer = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(timer);
        resolve(el);
      } else if (Date.now() - start > timeout) {
        clearInterval(timer);
        reject(new Error(`Timeout: ${selector} not found`));
      }
    }, 100);
  });
}

/* ------------------------------------------------
   Popup Utility
-------------------------------------------------- */
function showPopup(message, isError = false) {
  let popup = document.getElementById("successPopup");

  // Create popup dynamically if missing
  if (!popup) {
    popup = document.createElement("div");
    popup.id = "successPopup";
    popup.className = "popup-overlay";
    popup.innerHTML = `
      <div class="popup-box">
        <h3 id="popupMessage"></h3>
        <button id="popupCloseBtn">OK</button>
      </div>
    `;
    document.body.appendChild(popup);
  }

  const messageEl = popup.querySelector("#popupMessage");
  const closeBtn = popup.querySelector("#popupCloseBtn");

  messageEl.textContent = message;
  popup.classList.add("active");

  messageEl.style.color = isError ? "crimson" : "var(--deep-teal-blue)";
  closeBtn.onclick = () => {
    popup.classList.remove("active");

    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    if (userData) {
      const usernameInput = document.getElementById("username");
      const addressInput = document.getElementById("address");
      const photoPreview = document.getElementById("profilePhotoPreview");

      if (usernameInput) usernameInput.value = userData.displayName || "";
      if (addressInput) addressInput.value = userData.address || "";
      if (photoPreview)
        photoPreview.src =
          userData.profileImageUrl || "../../assets/default-user.jpg";
    }
  };

  setTimeout(() => popup.classList.remove("active"), 2500);
}

/* ------------------------------------------------
   Main Function
-------------------------------------------------- */
async function initEditProfile() {
  try {
    // Wait for DOM
    await waitForElement("#username");

    const usernameInput = document.getElementById("username");
    const addressInput = document.getElementById("address");
    const photoPreview = document.getElementById("profilePhotoPreview");
    const photoInput = document.getElementById("profilePhotoInput");
    const removeBtn = document.getElementById("removePhotoBtn");
    const updateBtn = document.getElementById("updateBtn");

    let currentUserId = null;
    let currentPhotoURL = "";

    /* -------------------------------
       Load cached localStorage data
    ------------------------------- */
    const cachedData = localStorage.getItem("userData");
    if (cachedData) {
      try {
        const data = JSON.parse(cachedData);
        usernameInput.value = data.displayName || "";
        addressInput.value = data.address || "";
        photoPreview.src =
          data.profileImageUrl || "../../assets/default-user.jpg";
      } catch (err) {
        console.warn("Invalid cached user data:", err);
      }
    }

    /* -------------------------------
       Load Firestore data
    ------------------------------- */
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        currentUserId = user.uid;
        const refDoc = doc(firestore, "customers", user.uid);
        const snap = await getDoc(refDoc);

        if (snap.exists()) {
          const data = snap.data();
          usernameInput.value = data.displayName || "";
          addressInput.value = data.address || "";
          currentPhotoURL = data.profileImageUrl || "";
          photoPreview.src = currentPhotoURL || "../../assets/default-user.jpg";

          // Sync localStorage
          localStorage.setItem(
            "userData",
            JSON.stringify({
              displayName: data.displayName,
              address: data.address,
              profileImageUrl: data.profileImageUrl,
            })
          );
        }
      } else {
        showPopup("⚠️ Please log in first.", true);
        window.location.href = "./auth-login-customer.html";
      }
    });

    /* -------------------------------
       Photo preview & remove
    ------------------------------- */
    photoPreview.addEventListener("click", () => photoInput.click());

    photoInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => (photoPreview.src = ev.target.result);
        reader.readAsDataURL(file);
      }
    });

    removeBtn.addEventListener("click", () => {
      photoPreview.src = "../../assets/default-user.jpg";
      currentPhotoURL = "";
    });

    /* -------------------------------
       Update Firestore
    ------------------------------- */
    updateBtn.addEventListener("click", async () => {
      if (!currentUserId) return;

      updateBtn.disabled = true;
      updateBtn.textContent = "UPDATING...";

      const displayName = usernameInput.value.trim();
      const address = addressInput.value.trim();
      let finalPhotoURL = currentPhotoURL;

      // Check if any change occurred before proceeding
      const noChanges =
        displayName ===
          (localStorage.getItem("userData")
            ? JSON.parse(localStorage.getItem("userData")).displayName
            : "") &&
        address ===
          (localStorage.getItem("userData")
            ? JSON.parse(localStorage.getItem("userData")).address
            : "") &&
        photoInput.files.length === 0;

      if (noChanges) {
        showPopup(
          "No changes detected. Please modify your profile before updating.",
          true
        );
        updateBtn.disabled = false;
        updateBtn.textContent = "UPDATE";
        return; // Stop function here
      }

      try {
        // Upload new photo if changed
        if (photoInput.files.length > 0) {
          const file = photoInput.files[0];
          const storageRef = ref(
            storage,
            `profile_photos/${currentUserId}/${file.name}`
          );
          await uploadBytes(storageRef, file);
          finalPhotoURL = await getDownloadURL(storageRef);
        }

        // Update Firestore
        const userRef = doc(firestore, "customers", currentUserId);
        await updateDoc(userRef, {
          displayName,
          address,
          profileImageUrl: finalPhotoURL,
        });

        // Update local cache
        localStorage.setItem(
          "userData",
          JSON.stringify({
            displayName,
            address,
            profileImageUrl: finalPhotoURL,
          })
        );

        // Show popup
        showPopup("Profile updated successfully!");
      } catch (err) {
        console.error("Error updating profile:", err);
        showPopup("Failed to update your profile.", true);
      } finally {
        updateBtn.disabled = false;
        updateBtn.textContent = "UPDATE";
      }
    });
  } catch (err) {
    console.error("Edit Profile initialization failed:", err);
  }
}

initEditProfile();
