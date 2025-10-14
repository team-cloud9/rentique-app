// Anmol: Import the service that handles the backend logic.
import { ProductService } from "../services/ProductService.js";

/* Anmol: App Initialization START */
document.addEventListener("DOMContentLoaded", function () {
  console.log("[AddItemPage] DOM fully loaded. Initializing application...");
  initializeApp();
});

function initializeApp() {
  const formElements = getFormElements();
  setupAllEventListeners(formElements);
}
/* Anmol: App Initialization END */


/* Anmol: DOM Element & Event Listener Setup START */
function getFormElements() {
  console.log("[AddItemPage] Getting all necessary form elements from the DOM.");
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
  console.log("[AddItemPage] Setting up all event listeners.");
  // Gurpreet's UI components
  setupImageUploader(elements.imageUploadButton, elements.imageUploadInput, elements.imagePreviewContainer);
  setupMeasurementUploader(elements.measurementUploadButton, elements.measurementUploadInput, elements.measurementFileName);
  // Gurpreet's UI event handling
  setupFormSubmission(elements.form, elements.submitButton);
  setupCancelButton(elements.form);
}
/* Anmol: DOM Element & Event Listener Setup END */








/* Anmol: Form Event Handling & UI State START */
function setupFormSubmission(form, submitButton) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("[AddItemPage-Form] Form submission triggered by user.");
    await handleFormSubmit(form, submitButton);
  });
}

async function handleFormSubmit(form, submitButton) {//by Anmol
  setFormSubmittingState(submitButton, true);
  try {
    await processAndSaveFormData(form);
    alert("Success! Your item has been added to the database.");
    console.log("[AddItemPage-Form] Form submission successful. Resetting form.");
    resetFullForm(form);
  } catch (error) {
    handleSubmissionError(error);
  } finally {
    setFormSubmittingState(submitButton, false);
  }
}

function handleSubmissionError(error) {
  console.error("[AddItemPage-Form] Error during submission process:", error);
  alert("An error occurred. Please try again. Check the console for details.");
}

function setFormSubmittingState(button, isSubmitting) {
  button.disabled = isSubmitting;
  button.textContent = isSubmitting ? "SAVING..." : "ADD ITEM";
}

function setupCancelButton(form) {
  const cancelButton = form.querySelector('.b-add-action-buttons__btn--secondary');
  cancelButton.addEventListener('click', () => {
    if (confirm("Are you sure? All changes will be lost.")) {
      console.log("[AddItemPage-Form] User cancelled. Resetting form.");
      resetFullForm(form);
    }
  });
}

function resetFullForm(form) {
  const imagePreviewContainer = document.getElementById("imagePreviewContainer");
  const measurementFileName = document.getElementById("measurementFileName");
  form.reset();
  imagePreviewContainer.innerHTML = '';
  measurementFileName.textContent = '';
  console.log("[AddItemPage-Form] Form has been visually reset.");
}
/* Anmol: Form Event Handling & UI State END */


/* Anmol: Data Gathering & Service Delegation START */
async function processAndSaveFormData(form) {
  console.log("[AddItemPage-Data] Gathering all data from form and delegating to ProductService...");

  const formData = getFormData(form);
  const imageFiles = getAllImageFiles();
  const measurementFile = getMeasurementFile();

  await ProductService.createNewProduct(formData, imageFiles, measurementFile);

  console.log("[AddItemPage-Data] ProductService has completed its work.");
}

function getFormData(form) {
  const basicInfo = getBasicInfo(form);
  const tagSelections = getTagSelections();
  return {
    ...basicInfo,
    ...tagSelections,
  };
}

function getBasicInfo(form) {
  return {
    itemName: form.querySelector("#itemNameInput").value,
    description: form.querySelector("#fullDescriptionInput").value,
    price: parseFloat(form.querySelector("#priceInput").value) || 0,
  };
}

function getTagSelections() {
  return {
    category: getSelectedCheckboxValues("category"),
    colors: getSelectedCheckboxValues("color-preset"),
    gender: getSelectedCheckboxValues("gender"),
    sizes: getSelectedCheckboxValues("size"),
    texture: getSelectedCheckboxValues("texture"),
    style: getSelectedCheckboxValues("style"),
    material: getSelectedCheckboxValues("material"),
  };
}

function getSelectedCheckboxValues(name) {
  const checkedInputs = document.querySelectorAll(`input[name="${name}"]:checked`);
  return Array.from(checkedInputs).map(input => input.value);
}

function getAllImageFiles() {
  const previewWrappers = document.querySelectorAll(".b-add-image-uploader__preview-wrapper");
  return Array.from(previewWrappers).map(wrapper => wrapper.file).filter(file => file);
}

function getMeasurementFile() {
  const input = document.getElementById("measurementUploadInput");
  return input.files.length > 0 ? input.files[0] : null;
}
/* Anmol: Data Gathering & Service Delegation END */