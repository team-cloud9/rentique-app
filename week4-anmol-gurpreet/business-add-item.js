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






















  
});