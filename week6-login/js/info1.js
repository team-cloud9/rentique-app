document.addEventListener("DOMContentLoaded", () => {
  const formContainer = document.querySelector(".form-container");
  const panels = document.querySelectorAll(".style-panel");
  const openButtons = document.querySelectorAll(".option-btn");
  const cancelBtns = document.querySelectorAll(".cancel-style");

  // Mostrar el panel correspondiente
  openButtons.forEach((btn, index) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      formContainer.classList.add("show-panel");

      // Ocultar todos los paneles
      panels.forEach(panel => panel.classList.remove("active"));
      // Mostrar solo el correspondiente
      panels[index].classList.add("active");
    });
  });

  // Botones de "Cancel" para cerrar paneles
  cancelBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      formContainer.classList.remove("show-panel");
      panels.forEach(panel => panel.classList.remove("active"));
    });
  });
});

// SIGN UP PAGE: "CONTINUE"
document.addEventListener("DOMContentLoaded", () => {
  const usernameInput = document.querySelector('input[placeholder="Username"]');
  const addressInput = document.querySelector('input[placeholder="Address"]');
  const continueBtn = document.querySelector(".continue-btn");
  const signupForm = document.querySelector('.login-form[action="Info1.html"]'); // 👈 importante

  // Si no estamos en la página signup, salimos
  if (!usernameInput || !addressInput || !continueBtn || !signupForm) return;

  function checkInputs() {
    const filled = usernameInput.value.trim() !== "" && addressInput.value.trim() !== "";
    continueBtn.disabled = !filled;
    continueBtn.classList.toggle("active", filled);
  }

  usernameInput.addEventListener("input", checkInputs);
  addressInput.addEventListener("input", checkInputs);


  signupForm.addEventListener("submit", (e) => {
    if (continueBtn.disabled) {
      e.preventDefault();
    }
  });
});


// SIGN UP PAGE: photo
document.addEventListener("DOMContentLoaded", () => {
  const uploadBox = document.getElementById("uploadBox");
  const fileInput = document.getElementById("fileInput");
  const previewImage = document.getElementById("previewImage");
  const uploadPlus = document.getElementById("uploadPlus");


  if (!uploadBox || !fileInput) return;


  uploadBox.addEventListener("click", () => {
    fileInput.click();
  });

 
  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImage.src = e.target.result;
        previewImage.style.display = "block";
        uploadPlus.style.display = "none"; 
      };
      reader.readAsDataURL(file);
    }
  });
});


// INFO1 PAGE
document.addEventListener("DOMContentLoaded", () => {
  const questionnaireForm = document.querySelector('.form-content form');
  const saveBtn = document.querySelector('.form-content .continue-btn');

  if (!questionnaireForm || !saveBtn) return;

  questionnaireForm.addEventListener("submit", (e) => {
    e.preventDefault(); 
    window.location.href = "done.html"; 
  });
});


