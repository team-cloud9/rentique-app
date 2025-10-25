// ===== Filter Popup =====
const filterBtn = document.getElementById("filterBtn");
const filterPopup = document.getElementById("filterPopup");
const closePopup = document.getElementById("closePopup");
const applyFilter = document.querySelector(".apply-btn");

// open
if (filterBtn && filterPopup) {
  filterBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    filterPopup.style.display = "block";
  });
}

// close
if (closePopup && filterPopup) {
  closePopup.addEventListener("click", () => {
    filterPopup.style.display = "none";
  });
}

// apply (close on click)
if (applyFilter && filterPopup) {
  applyFilter.addEventListener("click", () => {
    filterPopup.style.display = "none";
  });
}

// close when clicking outside
if (filterPopup) {
  window.addEventListener("click", (event) => {
    if (event.target === filterPopup) {
      filterPopup.style.display = "none";
    }
  });
}

// ===== Sort Dropdown =====
const sortButton = document.querySelector(".sort-btn");
const dropdownMenu = document.querySelector(".dropdown-menu");

if (sortButton && dropdownMenu) {
  sortButton.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle("show");
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".dropdown")) {
      dropdownMenu.classList.remove("show");
    }
  });
}

// ===== Filter Button Toggle =====
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    this.classList.toggle("active");
  });
});

// ===== Apply Button (optional alert) =====
if (applyFilter) {
  applyFilter.addEventListener("click", function () {
    const activeFilters = document.querySelectorAll(".filter-btn.active");
    alert("Applied " + activeFilters.length + " filters!");
  });
}

// ===== Accordion Toggle for Filter Sections =====
document.querySelectorAll(".filter-section h3").forEach((h3) => {
  h3.addEventListener("click", () => {
    const section = h3.parentElement; // el div.filter-section
    section.classList.toggle("active");
  });
});

