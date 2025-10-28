


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { 
  getFirestore, doc, getDoc, updateDoc, setDoc 
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { 
  getAuth, updatePassword, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { 
  getStorage, ref, uploadBytes, getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";


const firebaseConfig = {
  apiKey: "YOUR-API-KEY",
  authDomain: "YOUR-PROJECT.firebaseapp.com",
  projectId: "YOUR-PROJECT-ID",
  storageBucket: "YOUR-PROJECT.appspot.com",
  messagingSenderId: "YOUR-SENDER-ID",
  appId: "YOUR-APP-ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);


const nameInput = document.getElementById("brandName");
const addressInput = document.getElementById("brandAddress");
const emailInput = document.getElementById("brandEmail");
const imageInput = document.getElementById("brandImage");
const previewImg = document.getElementById("previewImage");
const removeBtn = document.querySelector(".remove-btn") || document.querySelector(".preview-close");
const saveBtn = document.getElementById("saveProfile");
const savePwBtn = document.getElementById("savePw");

const currentPw = document.getElementById("currentPw");
const newPw = document.getElementById("newPw");


function validateProfileForm() {
  if (!saveBtn) return;
  const valid =
    nameInput?.value.trim() &&
    addressInput?.value.trim() &&
    emailInput?.value.includes("@");
  saveBtn.disabled = !valid;
}

function validatePasswordForm() {
  if (!savePwBtn) return;
  const valid =
    currentPw?.value.trim().length >= 6 &&
    newPw?.value.trim().length >= 6 &&
    currentPw.value !== newPw.value;
  savePwBtn.disabled = !valid;
}


if (imageInput) {
  imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        previewImg.src = evt.target.result;
        previewImg.style.display = "block";
        if (removeBtn) removeBtn.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });
}

if (removeBtn) {
  removeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    previewImg.src = "";
    previewImg.style.display = "none";
    imageInput.value = "";
    removeBtn.style.display = "none";
  });
}


[nameInput, addressInput, emailInput].forEach((el) =>
  el?.addEventListener("input", validateProfileForm)
);

[currentPw, newPw].forEach((el) =>
  el?.addEventListener("input", validatePasswordForm)
);


onAuthStateChanged(auth, async (user) => {
  if (!user) {
    console.log("User not logged in");
    return;
  }
  console.log("Logged in user:", user.email);

  const brandRef = doc(db, "brands", user.uid);
  const snap = await getDoc(brandRef);

  if (snap.exists()) {
    const data = snap.data();
    if (nameInput) nameInput.value = data.name || "";
    if (addressInput) addressInput.value = data.address || "";
    if (emailInput) emailInput.value = data.email || user.email;
    if (data.imageUrl && previewImg) {
      previewImg.src = data.imageUrl;
      previewImg.style.display = "block";
      if (removeBtn) removeBtn.style.display = "block";
    }
  }
});


if (saveBtn) {
  saveBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) return alert("Please login first.");

    const brandRef = doc(db, "brands", user.uid);
    let imageUrl = "";

   
    if (imageInput.files.length > 0) {
      const file = imageInput.files[0];
      const imgRef = ref(storage, `brandImages/${user.uid}/${file.name}`);
      await uploadBytes(imgRef, file);
      imageUrl = await getDownloadURL(imgRef);
    }

   
    await setDoc(brandRef, {
      name: nameInput.value.trim(),
      address: addressInput.value.trim(),
      email: emailInput.value.trim(),
      imageUrl: imageUrl || previewImg.src || ""
    });

    alert("✅ Brand profile updated successfully!");
  });
}


document.addEventListener("DOMContentLoaded", () => {
  const currentPw = document.getElementById("currentPassword");
  const newPw = document.getElementById("newPassword");
  const savePwBtn = document.querySelector(".save-btn");

  function checkFields() {
    const bothFilled =
      currentPw.value.trim() !== "" && newPw.value.trim() !== "";
    savePwBtn.disabled = !bothFilled;
    savePwBtn.classList.toggle("enabled", bothFilled);
  }

  currentPw.addEventListener("input", checkFields);
  newPw.addEventListener("input", checkFields);
  checkFields();
});


if (savePwBtn) {
  savePwBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) return alert("Please login first.");

    const newPassword = newPw.value.trim();
    try {
      await updatePassword(user, newPassword);
      alert("✅ Password updated successfully!");
      currentPw.value = "";
      newPw.value = "";
      savePwBtn.disabled = true; 
    } catch (err) {
      console.error("Error updating password:", err);
      alert("❌ Failed to update password: " + err.message);
    }
  });
}

console.log("Rentique JS connected successfully.");





