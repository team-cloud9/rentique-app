/*
  @Made By: 
 */
import { ProductService } from "../../services/business-side/ProductService.js";
import { auth } from "../../services/business-side/firebase-init.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { BusinessProfileService } from "../../services/business-side/BusinessProfileService.js";
import { showModal } from "../../controller/components/modal.js";

let dynamicProfileId = null;
let dynamicBusinessId = null;
let dynamicBusinessName = null;

document.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      initializeApp(user);
    } else {
      console.log("No user logged in. Redirecting to login.");
      window.location.href = "./auth-login-business.html";
    }
  });
});

async function initializeApp(user) {
  console.log("[AddItemPage] User authenticated. Initializing application...");
  
  try {
    const profileData = await BusinessProfileService.getBusinessProfileData(user);
    dynamicProfileId = profileData.profileId;
    dynamicBusinessId = profileData.id;
    dynamicBusinessName = profileData.businessName;
    console.log(profileData);
    
    console.log(`[AddItemPage] Fetched dynamic IDs -> profileID: ${dynamicProfileId}, businessID: ${dynamicBusinessId}`);

    setupAllEventListeners();

  } catch (error) {
    console.error("Critical Error: Could not fetch business profile data.", error);
    showModal("Initialization Failed", "Could not load necessary business information. Please try refreshing the page.", {
      confirmText: 'Go to Home',
      isDanger: true,
      onConfirm: () => { window.location.href = './b-home.html'; }
    });
    const submitButton = document.querySelector(".b-add-action-buttons__btn--primary");
    if (submitButton) submitButton.disabled = true;
  }
}

let stream = null; 

async function startCamera() {
    if (currentImageFiles.length >= 3) {
        showModal("Image Limit Reached", "You can upload a maximum of 3 images.", { iconType: 'warning', confirmText: 'OK' });
        return;
    }

    const cameraModal = document.getElementById("cameraModal");
    const cameraFeed = document.getElementById("cameraFeed");

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            cameraFeed.srcObject = stream;
            cameraModal.classList.add("active");
        } catch (error) {
            console.error("Error accessing camera:", error);
            showModal("Camera Error", "Could not access the camera. Please check your browser permissions.", { isDanger: true, confirmText: 'OK' });
        }
    } else {
        showModal("Unsupported", "Your browser does not support camera access.", { isDanger: true, confirmText: 'OK' });
    }
}

function stopCamera() {
    const cameraModal = document.getElementById("cameraModal");
    const cameraFeed = document.getElementById("cameraFeed");
    if (stream) {
        stream.getTracks().forEach((track) => track.stop());
    }
    cameraFeed.srcObject = null;
    cameraModal.classList.remove("active");
}

function captureImage() {
    const cameraFeed = document.getElementById("cameraFeed");
    const cameraCanvas = document.getElementById("cameraCanvas");
    const context = cameraCanvas.getContext("2d");

    cameraCanvas.width = cameraFeed.videoWidth;
    cameraCanvas.height = cameraFeed.videoHeight;
    context.drawImage(cameraFeed, 0, 0, cameraCanvas.width, cameraCanvas.height);

    cameraCanvas.toBlob((blob) => {
        const fileName = `photo-${Date.now()}.jpg`;
        const file = new File([blob], fileName, { type: "image/jpeg" });
        
        currentImageFiles.push(file);
        renderImagePreviews();

    }, "image/jpeg");

    stopCamera();
}

function setupAllEventListeners() {
    const form = document.getElementById("bAddItemForm");
    const imageUploadButton = document.getElementById("imageUploadButton");
    const imageUploadInput = document.getElementById("imageUploadInput");
    const measurementUploadButton = document.getElementById("measurementUploadButton");
    const measurementUploadInput = document.getElementById("measurementUploadInput");

    
    const cameraButton = document.getElementById("cameraButton");
    const captureButton = document.getElementById("captureButton");
    const cancelCameraButton = document.getElementById("cancelCameraButton");

    cameraButton.addEventListener("click", startCamera);
    captureButton.addEventListener("click", captureImage);
    cancelCameraButton.addEventListener("click", stopCamera);
    

    imageUploadButton.addEventListener("click", () => imageUploadInput.click());
    imageUploadInput.addEventListener("change", (event) => handleImageFiles(event.target.files));

    measurementUploadButton.addEventListener("click", () => measurementUploadInput.click());
    measurementUploadInput.addEventListener("change", (event) => {
        const fileNameDisplay = document.getElementById("measurementFileName");
        if (event.target.files.length > 0) {
            fileNameDisplay.textContent = event.target.files[0].name;
        }
    });

    form.addEventListener("submit", handleFormSubmit);

    const cancelButton = form.querySelector(".b-add-action-buttons__btn--secondary");
    cancelButton.addEventListener("click", () => {
        showModal("Discard Item?", "Are you sure? All information entered will be lost.", {
            confirmText: 'Discard',
            isDanger: true,
            onConfirm: () => { window.location.href = './b-home.html'; }
        });
    });
}

async function handleFormSubmit(event) {
    event.preventDefault();
    const submitButton = event.target.querySelector(".b-add-action-buttons__btn--primary");
    const validationError = validateForm();
    if (validationError) {
        showModal("Missing Information", validationError, { iconType: 'warning', confirmText: 'OK' });
        return;
    }
    submitButton.disabled = true;
    submitButton.textContent = "SAVING...";

    try {
        const formDataText = getFormData(event.target);
        const imageFiles = getAllImageFiles();
        const measurementFile = getMeasurementFile();

        if (imageFiles.length === 0) {
            throw new Error("Please upload at least one image for the product.");
        }

        const newProduct = await ProductService.createNewProduct(formDataText, imageFiles, measurementFile);
        
        showModal("Success!", "Your new item has been added successfully.", {
            confirmText: 'View Item',
            onConfirm: () => { window.location.href = `./b-detail-item.html?id=${newProduct.id}`; }
        });

    } catch (error) {
        console.error("Failed to create product:", error);
        showModal("Creation Failed", error.message || "An error occurred while saving your new item. Please try again.", { isDanger: true, confirmText: 'OK' });
        submitButton.disabled = false;
        submitButton.textContent = "ADD ITEM";
    }
}

function getFormData(form) {
  if (!dynamicProfileId || !dynamicBusinessId) {
    throw new Error("Dynamic profileID or businessID is not available. Cannot submit form.");
  }
  
  return {
    profileID: dynamicProfileId,
    businessID: dynamicBusinessId,
    businessName: dynamicBusinessName,
    itemName: form.querySelector("#itemNameInput").value.trim(),
    description: form.querySelector("#fullDescriptionInput").value.trim(),
    price: Number.parseFloat(form.querySelector("#priceInput").value) || 0,
    category: getSelectedCheckboxValues("category"),
    colors: getSelectedCheckboxValues("color-preset"),
    gender: getRadioValue("gender"),
    sizes: getSelectedCheckboxValues("size"),
    sizeFit: getSelectedCheckboxValues("sizeFit"),
    texture: getSelectedCheckboxValues("texture"),
    season: getSelectedCheckboxValues("season"),
    style: getSelectedCheckboxValues("style"),
    material: getSelectedCheckboxValues("material"),
  };
}

function validateForm() {
    if (getAllImageFiles().length === 0) {
        return "Please upload at least one image for the item.";
    }
    if (document.getElementById("itemNameInput").value.trim() === '') {
        return "Please enter an item name.";
    }
    if (document.getElementById("fullDescriptionInput").value.trim() === '') {
        return "Please enter a description.";
    }
    if (getSelectedCheckboxValues("category").length === 0) {
        return "Please select at least one category.";
    }
    if (getRadioValue("gender") === null) {
        return "Please select a gender.";
    }
    if (getSelectedCheckboxValues("size").length === 0) {
        return "Please select at least one size.";
    }
    if (getSelectedCheckboxValues("color-preset").length === 0) {
        return "Please select at least one color.";
    }
    if (getSelectedCheckboxValues("sizeFit").length === 0) {
        return "Please select at least one size fit option.";
    }
    if (getSelectedCheckboxValues("texture").length === 0) {
        return "Please select at least one texture option.";
    }
    if (getSelectedCheckboxValues("season").length === 0) {
        return "Please select at least one season option.";
    }
    if (getSelectedCheckboxValues("style").length === 0) {
        return "Please select at least one style option.";
    }
    if (getSelectedCheckboxValues("material").length === 0) {
        return "Please select at least one material option.";
    }
    return null;
}

let currentImageFiles = [];

function handleImageFiles(files) {
    const newFiles = Array.from(files);
    const slotsAvailable = 3 - currentImageFiles.length;
    
    if (newFiles.length > 0 && slotsAvailable > 0) {
        currentImageFiles.push(...newFiles.slice(0, slotsAvailable));
        renderImagePreviews();
    }
}
const previewContainer = document.getElementById("imagePreviewContainer");
function renderImagePreviews() {
    const uploaderContainer = document.getElementById("imageUploaderContainer");
    previewContainer.innerHTML = ''; 

    currentImageFiles.forEach((file, index) => {
        const wrapper = document.createElement("div");
        wrapper.className = "b-add-image-uploader__preview-wrapper";
        
        const reader = new FileReader();
        reader.onload = (event) => {
            wrapper.innerHTML = `
                <img src="${event.target.result}" class="b-add-image-uploader__image" alt="New item preview">
                <button type="button" class="b-add-image-uploader__remove-btn" data-index="${index}">&times;</button>
            `;
        };
        reader.readAsDataURL(file);
        previewContainer.appendChild(wrapper);
    });

    updateAddButtonVisibility();
}

previewContainer.addEventListener('click', function(event) {
    if (event.target.classList.contains('b-add-image-uploader__remove-btn')) {
        const indexToRemove = parseInt(event.target.dataset.index, 10);
        currentImageFiles.splice(indexToRemove, 1);
        renderImagePreviews();
    }
});


function updateAddButtonVisibility() {
    const imageUploadButton = document.getElementById('imageUploadButton');
    const cameraButton = document.getElementById('cameraButton');
    if (currentImageFiles.length >= 3) {
        imageUploadButton.style.display = "none";
        cameraButton.style.display = "none";
    } else {
        imageUploadButton.style.display = "flex";
        cameraButton.style.display = "flex";
    }
}

function getAllImageFiles() {
  return currentImageFiles;
}

function getMeasurementFile() {
  const input = document.getElementById("measurementUploadInput");
  return input.files.length > 0 ? input.files[0] : null;
}

function getSelectedCheckboxValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map((input) => input.value);
}

function getRadioValue(name) {
  const radio = document.querySelector(`input[name="${name}"]:checked`);
  return radio ? radio.value : null;
}