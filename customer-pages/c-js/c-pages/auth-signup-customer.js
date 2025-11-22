import { auth, firestore, storage } from "../../c-js/services/firebase-init.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";

import { geocodeAddress } from "../../c-js/services/Geocoding.js";

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const policyCheckbox = document.getElementById("policyAccept");
  const generalError = document.getElementById("generalError");
  const submitButton = signupForm.querySelector(".login-btn");

  const userProfileModal = document.getElementById("userProfileModal");
  const questionnaireModal = document.getElementById("questionnaireModal");
  const usernameInput = document.getElementById("username");
  const addressInput = document.getElementById("address");
  const continueBtn = document.getElementById("continueToQuestionnaire");
  const profilePhotoInput = document.getElementById("profilePhoto");
  const profilePreview = document.getElementById("profilePreview");
  let uploadedFile = null;

  let currentUser = null;

  // enable submit only if policy checked
  policyCheckbox.addEventListener("change", () => {
    submitButton.disabled = !policyCheckbox.checked;
  });

  // Step 1: Account creation
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      generalError.textContent = "Please enter a valid email and password.";
      return;
    }

    try {
      submitButton.disabled = true;
      submitButton.textContent = "CREATING...";

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      currentUser = userCredential.user;

      console.log("✅ Account created:", currentUser.email);

      document.querySelector(".left").style.display = "none";
      document.querySelector(".right").style.display = "none";
      userProfileModal.style.display = "flex";
    } catch (error) {
      console.error(error);
      generalError.textContent = error.message;
      submitButton.disabled = false;
      submitButton.textContent = "CREATE ACCOUNT";
    }
  });

  // Step 2: profile photo preview
  if (profilePhotoInput) {
    profilePhotoInput.addEventListener("change", (e) => {
      uploadedFile = e.target.files[0];
      if (uploadedFile) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          profilePreview.src = ev.target.result;
          profilePreview.style.display = "block";
        };
        reader.readAsDataURL(uploadedFile);
      }
      checkProfileCompletion();
    });
  }

  function checkProfileCompletion() {
    continueBtn.disabled = !(usernameInput.value && addressInput.value);
  }

  usernameInput.addEventListener("input", checkProfileCompletion);
  addressInput.addEventListener("input", checkProfileCompletion);

  // Step 3: Save profile & show questionnaire
  continueBtn.addEventListener("click", async () => {
    if (!currentUser) return alert("User not found");

    try {
      continueBtn.disabled = true;
      continueBtn.textContent = "SAVING...";

      let photoUrl = null;
      if (uploadedFile) {
        const fileRef = ref(storage, `profile_photos/${currentUser.uid}/${uploadedFile.name}`);
        const snap = await uploadBytes(fileRef, uploadedFile);
        photoUrl = await getDownloadURL(snap.ref);
      }

      // GeoPoint
      let geo = null;
      try {
        geo = await geocodeAddress(addressInput.value);
        console.log("✅ Customer GeoPoint:", geo);
      } catch (geoErr) {
        console.warn("⚠️ Geocoding failed:", geoErr);
      }

      await setDoc(doc(firestore, "customers", currentUser.uid), {
        email: currentUser.email,
        displayName: usernameInput.value,
        address: addressInput.value,
        profileImageUrl: photoUrl,
        role: "customer",
        // Address & GeoPoint
        location: geo
          ? { address: addressInput.value, geopoint: geo }
          : { address: addressInput.value }
      });

      userProfileModal.style.display = "none";
      questionnaireModal.style.display = "flex";
      showStep(1);
    } catch (err) {
      alert("Error saving profile: " + err.message);
      continueBtn.disabled = false;
      continueBtn.textContent = "Continue";
    }
  });

  // Step 4: questionnaire steps
  const steps = document.querySelectorAll(".questionnaire-step");
  const progress = document.querySelectorAll(".progress-step");
  let stepIndex = 1;

  function showStep(num) {
    steps.forEach(
      (s) => (s.style.display = s.dataset.step == num ? "block" : "none")
    );
    progress.forEach((p) =>
      p.classList.toggle("active", p.dataset.step <= num)
    );
    stepIndex = num;
  }

  document.querySelectorAll(".questionnaire-continue").forEach((btn) => {
    btn.addEventListener("click", () => showStep(stepIndex + 1));
  });
  document.querySelectorAll(".questionnaire-back").forEach((btn) => {
    btn.addEventListener("click", () => showStep(stepIndex - 1));
  });

  document
    .querySelector(".questionnaire-done")
    .addEventListener("click", async () => {
      try {
        await setDoc(
          doc(firestore, "customers", currentUser.uid),
          {
            personalization: {
              height: document.getElementById("height").value,
              weight: document.getElementById("weight").value,
              gender: document.querySelector('input[name="gender"]:checked')?.value,
              favoriteColors: Array.from(
                document.querySelectorAll('input[name="favoriteColor"]:checked')
              ).map((cb) => cb.value),
              favoriteStyles: Array.from(
                document.querySelectorAll('input[name="favoriteStyle"]:checked')
              ).map((cb) => cb.value),
              stylesToTry: Array.from(
                document.querySelectorAll('input[name="styleToTry"]:checked')
              ).map((cb) => cb.value),
            },
          },
          { merge: true }
        );
        window.location.href = "../../c-pages/auth-success.html";
      } catch (error) {
        alert("Error saving questionnaire: " + error.message);
      }
    });
});

