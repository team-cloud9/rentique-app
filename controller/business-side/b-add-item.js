import { ProductService } from "../../services/business-side/ProductService.js"
// @Made By: Gurpreet Singh
document.addEventListener("DOMContentLoaded", () => {
  console.log("[AddItemPage] DOM fully loaded. Initializing application...")
  initializeApp()
  initializeScrollToTop()
  initializeStickyButtons()
})

function initializeApp() {
  const formElements = getFormElements()
  setupAllEventListeners(formElements)
}

function initializeScrollToTop() {
  const scrollTopBtn = document.getElementById("scrollTopBtn")

  if (!scrollTopBtn) return

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      scrollTopBtn.classList.add("visible")
    } else {
      scrollTopBtn.classList.remove("visible")
    }
  })

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })
}

function initializeStickyButtons() {
  const actionButtons = document.querySelector(".b-add-action-buttons")
  const materialSection = document.querySelector("fieldset.b-add-form-section:last-of-type")

  if (!actionButtons || !materialSection) return

  let ticking = false

  function handleStickyButtons() {
    const materialRect = materialSection.getBoundingClientRect()
    const materialBottom = materialRect.bottom
    const windowHeight = window.innerHeight

    if (materialBottom < windowHeight - 100) {
      actionButtons.classList.add("static")
    } else {
      actionButtons.classList.remove("static")
    }

    ticking = false
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleStickyButtons()
      })
      ticking = true
    }
  })

  window.addEventListener("resize", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleStickyButtons()
      })
      ticking = true
    }
  })

  handleStickyButtons()
}

function getFormElements() {
  const form = document.getElementById("bAddItemForm")
  return {
    form: form,
    imageUploadButton: document.getElementById("imageUploadButton"),
    imageUploadInput: document.getElementById("imageUploadInput"),
    imagePreviewContainer: document.getElementById("imagePreviewContainer"),
    measurementUploadButton: document.getElementById("measurementUploadButton"),
    measurementUploadInput: document.getElementById("measurementUploadInput"),
    measurementFileName: document.getElementById("measurementFileName"),
    submitButton: form.querySelector(".b-add-action-buttons__btn--primary"),
  }
}

function setupAllEventListeners(elements) {
  setupImageUploader(elements.imageUploadButton, elements.imageUploadInput, elements.imagePreviewContainer)
  setupMeasurementUploader(
    elements.measurementUploadButton,
    elements.measurementUploadInput,
    elements.measurementFileName,
  )
  setupFormSubmission(elements.form, elements.submitButton)
  setupCancelButton(elements.form)
}

function setupImageUploader(button, input, previewContainer) {
  button.addEventListener("click", () => {
    const uploaderContainer = document.getElementById("imageUploaderContainer")
    const currentImageCount = uploaderContainer.querySelectorAll(".b-add-image-uploader__preview-wrapper").length
    if (currentImageCount >= 3) {
      return;
    }
    input.click()
  })
  input.addEventListener("change", (event) => handleImageFiles(event.target.files, previewContainer, button))
}

function handleImageFiles(files, previewContainer, button) {
  const uploaderContainer = document.getElementById("imageUploaderContainer")
  const currentImageCount = uploaderContainer.querySelectorAll(".b-add-image-uploader__preview-wrapper").length
  const remainingSlots = 3 - currentImageCount

  let addedCount = 0
  for (const file of files) {
    if (addedCount >= remainingSlots) {
      break
    }
    if (file.type.startsWith("image/")) {
      createImagePreview(file, previewContainer, button)
      addedCount++
    }
  }

  updateAddButtonVisibility(previewContainer, button)
}

function createImagePreview(file, previewContainer, button) {
  const reader = new FileReader()
  reader.onload = (event) => {
    buildAndAppendPreview(file, event.target.result, previewContainer, button)
  }
  reader.readAsDataURL(file)
}

function buildAndAppendPreview(file, imageDataUrl, previewContainer, button) {
  const wrapper = createPreviewWrapper(file)
  const image = createPreviewImage(imageDataUrl)
  const removeBtn = createPreviewRemoveButton(wrapper, previewContainer, button)
  wrapper.appendChild(image)
  wrapper.appendChild(removeBtn)
  const uploaderContainer = document.getElementById("imageUploaderContainer")
  uploaderContainer.appendChild(wrapper)
}

function setupMeasurementUploader(button, input, fileNameDisplay) {
  button.addEventListener("click", () => input.click())
  input.addEventListener("change", (event) => {
    displayMeasurementFileName(event.target.files, fileNameDisplay)
  })
}

function displayMeasurementFileName(files, fileNameDisplay) {
  if (files.length > 0) {
    fileNameDisplay.textContent = files[0].name
  } else {
    fileNameDisplay.textContent = ""
  }
}

function setupFormSubmission(form, submitButton) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault()
    await handleFormSubmit(form, submitButton)
  })
}

async function handleFormSubmit(form, submitButton) {
  setFormSubmittingState(submitButton, true)
  try {
    const formDataText = getFormData(form)
    const imageFiles = getAllImageFiles()
    const measurementFile = getMeasurementFile()

    console.log("[AddItemPage] Uploading data to Firebase...")

    const finalProductData = await ProductService.createNewProduct(formDataText, imageFiles, measurementFile)

    console.log("[AddItemPage] Success. Saving to sessionStorage and redirecting.")

    const dataToStore = {
      ...finalProductData,
      createdAt: finalProductData.createdAt.toDate().toISOString(),
    }
    sessionStorage.setItem("currentProductSummary", JSON.stringify(dataToStore))

    window.location.href = "./b-detail-item.html"
  } catch (error) {
    console.error(error)
    alert("An error occurred. Please check console.")
    setFormSubmittingState(submitButton, false)
  }
}


function setFormSubmittingState(button, isSubmitting) {
  button.disabled = isSubmitting
  button.textContent = isSubmitting ? "SAVING..." : "ADD ITEM"
}

function setupCancelButton(form) {
  const cancelButton = form.querySelector(".b-add-action-buttons__btn--secondary")
  cancelButton.addEventListener("click", () => {
    showConfirmModal("Discard Changes?", "Are you sure? All changes will be lost.", () => {
      window.location.reload()
    })
  })
}

function getFormData(form) {
  return {
    profileID: "vPcs4VpHK7VdiwstWrioMNuNyQx1",
    businessID: "85BEumqXm4IXOqTHGzNi",
   
    itemName: form.querySelector("#itemNameInput").value,
    description: form.querySelector("#fullDescriptionInput").value,
    price: Number.parseFloat(form.querySelector("#priceInput").value) || 0,
    ...getTagSelections(),
  }
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
  }
}

function getSelectedCheckboxValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map((input) => input.value)
}

function getRadioValue(name) {
  const radio = document.querySelector(`input[name="${name}"]:checked`)
  return radio ? radio.value : null
}

function getAllImageFiles() {
  const uploaderContainer = document.getElementById("imageUploaderContainer")
  return Array.from(uploaderContainer.querySelectorAll(".b-add-image-uploader__preview-wrapper"))
    .map((wrapper) => wrapper.file)
    .filter((file) => file)
}

function getMeasurementFile() {
  const input = document.getElementById("measurementUploadInput")
  return input.files.length > 0 ? input.files[0] : null
}

function updateAddButtonVisibility(previewContainer, button) {
  const uploaderContainer = document.getElementById("imageUploaderContainer")
  const currentImageCount = uploaderContainer.querySelectorAll(".b-add-image-uploader__preview-wrapper").length
  if (currentImageCount >= 3) {
    button.style.display = "none"
  } else {
    button.style.display = "flex"
  }
}

function createPreviewWrapper(file) {
  const wrapper = document.createElement("div")
  wrapper.className = "b-add-image-uploader__preview-wrapper"
  wrapper.file = file
  return wrapper
}

function createPreviewImage(imageDataUrl) {
  const imageElement = document.createElement("img")
  imageElement.className = "b-add-image-uploader__image"
  imageElement.src = imageDataUrl
  return imageElement
}

function createPreviewRemoveButton(wrapperToRemove, previewContainer, button) {
  const removeButton = document.createElement("button")
  removeButton.type = "button"
  removeButton.className = "b-add-image-uploader__remove-btn"
  removeButton.innerHTML = "&times;"
  removeButton.addEventListener("click", () => {
    wrapperToRemove.remove()
    updateAddButtonVisibility(previewContainer, button)
  })
  return removeButton
}


function showConfirmModal(title, message, onConfirm) {
  const overlay = document.createElement("div")
  overlay.className = "modal-overlay"

  const container = document.createElement("div")
  container.className = "modal-container"

  const titleElement = document.createElement("h2")
  titleElement.className = "modal-title"
  titleElement.textContent = title

  const messageElement = document.createElement("p")
  messageElement.className = "modal-message"
  messageElement.textContent = message

  const buttonContainer = document.createElement("div")
  buttonContainer.className = "modal-buttons"

  const cancelBtn = document.createElement("button")
  cancelBtn.className = "modal-btn modal-btn--cancel"
  cancelBtn.textContent = "Cancel"
  cancelBtn.addEventListener("click", () => {
    closeModal(overlay)
  })

  const confirmBtn = document.createElement("button")
  confirmBtn.className = "modal-btn modal-btn--confirm"
  confirmBtn.textContent = "Confirm"
  confirmBtn.addEventListener("click", () => {
    closeModal(overlay)
    if (onConfirm) {
      onConfirm()
    }
  })

  buttonContainer.appendChild(cancelBtn)
  buttonContainer.appendChild(confirmBtn)

  container.appendChild(titleElement)
  container.appendChild(messageElement)
  container.appendChild(buttonContainer)

  overlay.appendChild(container)

  document.body.appendChild(overlay)

  setTimeout(() => {
    overlay.classList.add("active")
  }, 10)

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeModal(overlay)
    }
  })

  const handleEscape = (e) => {
    if (e.key === "Escape") {
      closeModal(overlay)
      document.removeEventListener("keydown", handleEscape)
    }
  }
  document.addEventListener("keydown", handleEscape)
}

function closeModal(overlay) {
  overlay.classList.remove("active")
  setTimeout(() => {
    if (overlay.parentNode) {
      overlay.parentNode.removeChild(overlay)
    }
  }, 300)
}
