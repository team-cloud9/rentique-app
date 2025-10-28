// ===============================
// FILTER POPUP HANDLING (UI only)
// ===============================

// open
const filterBtn = document.getElementById("filterBtn");
const filterPopup = document.getElementById("filterPopup");
const closePopup = document.getElementById("closePopup");
const applyFilter = document.querySelector(".apply-btn");

if (filterBtn && filterPopup) {
  filterBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    filterPopup.style.display = "block";
  });
}

if (closePopup && filterPopup) {
  closePopup.addEventListener("click", () => {
    filterPopup.style.display = "none";
  });
}

if (filterPopup) {
  window.addEventListener("click", (event) => {
    if (event.target === filterPopup) {
      filterPopup.style.display = "none";
    }
  });
}

// ===============================
// FILTER BUTTON TOGGLE (UI only)
// ===============================
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    this.classList.toggle("active");
  });
});

// ===============================
// ACCORDION TOGGLE FOR FILTER SECTIONS
// ===============================
document.querySelectorAll(".filter-section h3").forEach((h3) => {
  h3.addEventListener("click", () => {
    const section = h3.parentElement;
    section.classList.toggle("active");
  });
});

// ===== Apply Button (optional alert) =====
// if (applyFilter) {
//   applyFilter.addEventListener("click", function () {
//     const activeFilters = document.querySelectorAll(".filter-btn.active");
//     alert("Applied " + activeFilters.length + " filters!");
//   });
// }
