import { ProductService } from "../services/ProductService.js";
import { StorageService } from "../services/StorageService.js";
// @Made By: Dalbir Singh
document.addEventListener("DOMContentLoaded", () => {
  console.log("[EditItemPage] DOM fully loaded. Initializing application...");
  initializeApp();
  initializeScrollToTop();
  loadExistingData();
});

function initializeApp() {
  const formElements = getFormElements();
  setupAllEventListeners(formElements);
}

function loadExistingData() {
  const dataString = sessionStorage.getItem("editProductData");
  if (!dataString) {
    alert("No product data found for editing. Redirecting...");
    window.location.href = "business-add-item.html";
    return;
  }
  const productData = JSON.parse(dataString);
  console.log("[EditItemPage] Loading existing data:", productData);
  populateFormWithData(productData);
}

function populateFormWithData(data) {
  document.getElementById("itemNameInput").value = data.itemName || "";
  document.getElementById("fullDescriptionInput").value = data.description || "";
  document.getElementById("priceInput").value = data.price || "";

  if (data.images && data.images.length > 0) {
    const container = document.getElementById("imagePreviewContainer");
    data.images.forEach(url => createImagePreviewFromURL(url, container));
  }

  const check = (name, values) => {
    if (!values) return;
    const valuesArr = Array.isArray(values) ? values : [values];
    valuesArr.forEach(val => {
      const input = document.querySelector(`input[name="${name}"][value="${val}"]`);
      if (input) input.checked = true;
    });
  };

  check("category", data.category);
  check("color-preset", data.colors);
  check("gender", data.gender);
  check("size", data.sizes);
  check("sizeFit", data.sizeFit);
  check("texture", data.texture);
  check("style", data.style);
  check("material", data.material);

  if (data.measurementTableUrl) {
    document.getElementById("measurementFileName").textContent = "An existing size chart is saved.";
  }
}

function createImagePreviewFromURL(url, container) {
  const wrapper = document.createElement("div");
  wrapper.className = "b-add-image-uploader__preview-wrapper";
  wrapper.dataset.existingUrl = url;
  const image = document.createElement("img");
  image.className = "b-add-image-uploader__image";
  image.src = url;
  const button = createPreviewRemoveButton(wrapper, container, document.getElementById("imageUploadButton"));
  wrapper.appendChild(image);
  wrapper.appendChild(button);
  container.appendChild(wrapper);
  updateAddButtonVisibility(container, document.getElementById("imageUploadButton"));
}

function getFormElements() {
  const form = document.getElementById("bAddItemForm");
  return {
    form: form,
    imageUploadButton: document.getElementById("imageUploadButton"),
    imageUploadInput: document.getElementById("imageUploadInput"),
    imagePreviewContainer: document.getElementById("imagePreviewContainer"),
    measurementUploadButton: document.getElementById("measurementUploadButton"),
    measurementUploadInput: document.getElementById("measurementUploadInput"),
    measurementFileName: document.getElementById("measurementFileName"),
    submitButton: form.querySelector(".b-add-action-buttons__btn--primary"),
  };
}

function setupAllEventListeners(elements) {
  setupImageUploader(elements.imageUploadButton, elements.imageUploadInput, elements.imagePreviewContainer);
  setupMeasurementUploader(elements.measurementUploadButton, elements.measurementUploadInput, elements.measurementFileName);
  setupFormSubmission(elements.form, elements.submitButton);
  setupCancelButton(elements.form);
}

function setupImageUploader(button, input, previewContainer) {
    button.addEventListener("click", () => {
        if (previewContainer.children.length < 3) {
            input.click();
        }
    });
    input.addEventListener("change", (event) => handleImageFiles(event.target.files, previewContainer, button));
}

function handleImageFiles(files, previewContainer, button) {
    const remainingSlots = 3 - previewContainer.children.length;
    let addedCount = 0;
    for (const file of files) {
        if (addedCount >= remainingSlots) break;
        if (file.type.startsWith("image/")) {
            createImagePreview(file, previewContainer, button);
            addedCount++;
        }
    }
    updateAddButtonVisibility(previewContainer, button);
}

function createImagePreview(file, previewContainer, button) {
  const reader = new FileReader();
  reader.onload = (event) => buildAndAppendPreview(file, event.target.result, previewContainer, button);
  reader.readAsDataURL(file);
}

function buildAndAppendPreview(file, imageDataUrl, previewContainer, button) {
    const wrapper = createPreviewWrapper(file);
    const image = createPreviewImage(imageDataUrl);
    const removeBtn = createPreviewRemoveButton(wrapper, previewContainer, button);
    wrapper.appendChild(image);
    wrapper.appendChild(removeBtn);
    previewContainer.appendChild(wrapper);
}

function createPreviewWrapper(file) {
  const wrapper = document.createElement("div");
  wrapper.className = "b-add-image-uploader__preview-wrapper";
  wrapper.file = file;
  return wrapper;
}

function createPreviewImage(imageDataUrl) {
  const image = document.createElement("img");
  image.className = "b-add-image-uploader__image";
  image.src = imageDataUrl;
  return image;
}

function createPreviewRemoveButton(wrapper, container, button) {
  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "b-add-image-uploader__remove-btn";
  removeButton.innerHTML = "&times;";
  removeButton.addEventListener("click", () => {
    wrapper.remove();
    updateAddButtonVisibility(container, button);
  });
  return removeButton;
}

function updateAddButtonVisibility(container, button) {
  button.style.display = container.children.length >= 3 ? "none" : "flex";
}

function setupMeasurementUploader(button, input, fileNameDisplay) {
  button.addEventListener("click", () => input.click());
  input.addEventListener("change", (event) => {
    fileNameDisplay.textContent = event.target.files.length > 0 ? event.target.files[0].name : "";
  });
}

function setupFormSubmission(form, submitButton) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await handleFormSubmit(form, submitButton);
  });
}

async function handleFormSubmit(form, submitButton) {
  setFormSubmittingState(submitButton, true);
  try {
    const existingData = JSON.parse(sessionStorage.getItem("editProductData"));
    if (!existingData || !existingData.id) throw new Error("Missing existing product data or product ID.");

    const formDataText = getFormData(form);
    const newImageFiles = getAllNewImageFiles();
    const existingImageUrls = getExistingImageUrls();
    const measurementFile = getMeasurementFile();

    console.log("[EditItemPage] Updating product...");

    let newImageUrls = [];
    if (newImageFiles.length > 0) {
      newImageUrls = await StorageService.uploadMultipleFiles(newImageFiles, "product_images");
    }
    const allImageUrls = [...existingImageUrls, ...newImageUrls];

    let measurementUrl = existingData.measurementTableUrl;
    if (measurementFile) {
      if(existingData.measurementTableUrl) await StorageService.deleteFileByUrl(existingData.measurementTableUrl);
      measurementUrl = await StorageService.uploadFile(measurementFile, "measurement_charts");
    }

    const updatedProductData = {
      ...formDataText,
      images: allImageUrls,
      measurementTableUrl: measurementUrl,
      createdAt: existingData.createdAt,
    };

    await ProductService.updateProduct(existingData.id, updatedProductData);
    
    console.log("[EditItemPage] Success. Saving to sessionStorage and redirecting.");
    sessionStorage.setItem("currentProductSummary", JSON.stringify({ id: existingData.id, ...updatedProductData }));
    sessionStorage.removeItem("editProductData");
    window.location.href = "product-summary.html";

  } catch (error) {
    console.error(error);
    alert("An error occurred. Please check console.");
    setFormSubmittingState(submitButton, false);
  }
}

function setFormSubmittingState(button, isSubmitting) {
  button.disabled = isSubmitting;
  button.textContent = isSubmitting ? "UPDATING..." : "UPDATE";
}

function setupCancelButton(form) {
  const cancelButton = form.querySelector(".b-add-action-buttons__btn--secondary");
  cancelButton.addEventListener("click", () => {
    showConfirmModal("Discard Changes?", "Are you sure? All changes will be lost.", () => {
      sessionStorage.removeItem("editProductData");
      window.location.href = "product-summary.html";
    });
  });
}

function getFormData(form) {
  return {
    profileID: "28KaXTIX0qh4IHQBALDNjgohCKW2",
    businessID: "YGBm7FJBKqxO7e2LAk4e",
    itemName: form.querySelector("#itemNameInput").value,
    description: form.querySelector("#fullDescriptionInput").value,
    price: parseFloat(form.querySelector("#priceInput").value) || 0,
    ...getTagSelections(),
  };
}

function getTagSelections() {
  return {
    category: getSelectedCheckboxValues("category"),
    colors: getSelectedCheckboxValues("color-preset"),
    gender: getRadioValue("gender"),
    sizes: getSelectedCheckboxValues("size"),
    sizeFit: getSelectedCheckboxValues("sizeFit"),
    texture: getSelectedCheckboxValues("texture"),
    style: getSelectedCheckboxValues("style"),
    material: getSelectedCheckboxValues("material"),
  };
}

function getSelectedCheckboxValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(input => input.value);
}

function getRadioValue(name) {
  const radio = document.querySelector(`input[name="${name}"]:checked`);
  return radio ? radio.value : null;
}

function getAllNewImageFiles() {
  return Array.from(document.querySelectorAll(".b-add-image-uploader__preview-wrapper"))
    .filter(wrapper => wrapper.file).map(wrapper => wrapper.file);
}

function getExistingImageUrls() {
  return Array.from(document.querySelectorAll(".b-add-image-uploader__preview-wrapper"))
    .filter(wrapper => wrapper.dataset.existingUrl).map(wrapper => wrapper.dataset.existingUrl);
}

function getMeasurementFile() {
  const input = document.getElementById("measurementUploadInput");
  return input.files.length > 0 ? input.files[0] : null;
}

function initializeScrollToTop() {
    const scrollTopBtn = document.getElementById("scrollTopBtn");
    if (!scrollTopBtn) return;
    window.addEventListener("scroll", () => {
        scrollTopBtn.classList.toggle("visible", window.pageYOffset > 300);
    });
    scrollTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

function showConfirmModal(title, message, onConfirm) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  const container = document.createElement("div");
  container.className = "modal-container";
  container.innerHTML = `
    <h2 class="modal-title">${title}</h2>
    <p class="modal-message">${message}</p>
    <div class="modal-buttons">
        <button class="modal-btn modal-btn--cancel">Cancel</button>
        <button class="modal-btn modal-btn--confirm">Confirm</button>
    </div>
  `;

  document.body.appendChild(overlay);
  overlay.appendChild(container);

  setTimeout(() => overlay.classList.add("active"), 10);
  
  const closeModal = () => {
    overlay.classList.remove("active");
    setTimeout(() => overlay.remove(), 300);
  };
  
  container.querySelector(".modal-btn--cancel").addEventListener("click", closeModal);
  container.querySelector(".modal-btn--confirm").addEventListener("click", () => {
    closeModal();
    if (onConfirm) onConfirm();
  });
  overlay.addEventListener("click", e => {
    if (e.target === overlay) closeModal();
  });
}