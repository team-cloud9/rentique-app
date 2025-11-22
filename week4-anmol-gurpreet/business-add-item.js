document.addEventListener("DOMContentLoaded", () => {
  console.log("[B-ADD] - Add Item script initialized.");

  // --- Anmol: Image Upload Functionality START ---
  const imageUploadInputEl = document.getElementById("imageUploadInput");
  const imageUploadButtonEl = document.getElementById("imageUploadButton");
  const imagePreviewContainerEl = document.getElementById("imagePreviewContainer");

  imageUploadButtonEl.addEventListener("click", () => {
    console.log('[B-ADD] - "Upload Image" button clicked, triggering file input.');
    imageUploadInputEl.click();
  });

  imageUploadInputEl.addEventListener("change", (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      console.warn("[B-ADD] - File selection was cancelled.");
      return;
    }

    console.log(`[B-ADD] - ${files.length} file(s) selected for upload.`);

    for (const file of files) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const previewWrapper = document.createElement("div");
        previewWrapper.className = "b-add-image-uploader__preview-wrapper";
        const img = document.createElement("img");
        img.src = e.target.result;
        img.className = "b-add-image-uploader__image";
        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "b-add-image-uploader__remove-btn";
        removeBtn.innerHTML = '<i class="bx bx-x"></i>';
        removeBtn.onclick = () => {
          previewWrapper.remove();
          console.log(`[B-ADD] - Image preview removed: ${file.name}`);
        };
        previewWrapper.appendChild(img);
        previewWrapper.appendChild(removeBtn);
        imagePreviewContainerEl.appendChild(previewWrapper);
      };
      reader.readAsDataURL(file);
    }
  });
  // --- Anmol: Image Upload Functionality END ---


  // --- Gurpreet: Dynamic Tag Input & Form Submission START ---
  function setupTagInput(inputId, containerId, tagName) {
    const tagInputEl = document.getElementById(inputId);
    const tagsContainerEl = document.getElementById(containerId);

    tagInputEl.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const value = tagInputEl.value.trim();
        if (value) {
          createTag(value, tagsContainerEl, tagName);
          tagInputEl.value = "";
        }
      }
    });
  }

  function createTag(text, container, tagName) {
    console.log(`[B-ADD] - New ${tagName} tag created: "${text}"`);
    const tagEl = document.createElement("div");
    tagEl.className = "b-add-tag";
    tagEl.innerHTML = `<span>${text}</span><button type="button" class="b-add-tag__remove-btn"><i class='bx bx-x'></i></button>`;
    const removeBtnEl = tagEl.querySelector(".b-add-tag__remove-btn");
    removeBtnEl.addEventListener("click", () => tagEl.remove());
    container.appendChild(tagEl);
  }

  setupTagInput("colorInput", "colorTagsContainer", "Color");

  const measurementUploadInputEl = document.getElementById("measurementUploadInput");
  const measurementUploadButtonEl = document.getElementById("measurementUploadButton");
  const measurementFileNameEl = document.getElementById("measurementFileName");

  measurementUploadButtonEl.addEventListener("click", () => {
    measurementUploadInputEl.click();
  });

  measurementUploadInputEl.addEventListener("change", (event) => {
    const file = event.target.files[0];
    measurementFileNameEl.textContent = file ? file.name : "";
    if(file) console.log(`[B-ADD] - Measurement file selected: ${file.name}`);
  });

  const bAddItemFormEl = document.getElementById("bAddItemForm");

  const b_add_handleFormSubmit = (event) => {
    event.preventDefault();
    console.log("[B-ADD] - Form submission initiated.");

    try {
      const formData = {
        itemName: document.getElementById("itemNameInput").value,
        fullDescription: document.getElementById("fullDescriptionInput").value,
        price: document.getElementById("priceInput").value,
        colors: Array.from(document.querySelectorAll("#colorTagsContainer .b-add-tag span")).map(tag => tag.textContent),
        gender: document.querySelector('input[name="gender"]:checked')?.value || null,
        sizes: Array.from(document.querySelectorAll('input[name="size"]:checked')).map(input => input.value),
        seasons: Array.from(document.querySelectorAll('input[name="season"]:checked')).map(input => input.value),
        sizeFit: Array.from(document.querySelectorAll('input[name="sizeFit"]:checked')).map(input => input.value),
        texture: Array.from(document.querySelectorAll('input[name="texture"]:checked')).map(input => input.value),
        imageCount: document.querySelectorAll(".b-add-image-uploader__image").length,
        measurementFile: measurementFileNameEl.textContent || null,
      };

      console.debug("[B-ADD] - Form data collected for submission:", formData);

      if (!formData.itemName.trim()) {
        alert("Please enter an item name.");
        return;
      }
      if (!formData.price || formData.price <= 0) {
        alert("Please enter a valid price.");
        return;
      }
      if (formData.imageCount === 0) {
        alert("Please upload at least one image.");
        return;
      }

      console.log("[B-ADD] - Form data successfully logged. This would be sent to your backend.");
      alert("Item added successfully! Check the console (F12) to see the collected data.");

      bAddItemFormEl.reset();
      imagePreviewContainerEl.innerHTML = "";
      document.getElementById("colorTagsContainer").innerHTML = "";
      measurementFileNameEl.textContent = "";
      console.log("[B-ADD] - Form has been reset.");

    } catch (error) {
      console.error("[B-ADD] - An unexpected error during form submission.", error);
      alert("An error occurred. Check the console for details.");
    }
  };

  bAddItemFormEl.addEventListener("submit", b_add_handleFormSubmit);
  // --- Gurpreet: Dynamic Tag Input & Form Submission END ---
  
});