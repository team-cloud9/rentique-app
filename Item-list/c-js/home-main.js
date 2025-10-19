// ===== Swipe items =====
const swipeItems = document.querySelector(".swipe-items");
const leftArrow = document.querySelector(".arrow.left");
const rightArrow = document.querySelector(".arrow.right");

const items = document.querySelectorAll(".swipe-items .item");
const gap = 10;
const itemWidth = items[0].offsetWidth + gap;
const visibleCount = 5;

let currentTranslate = 0;

const totalWidth = items.length * itemWidth - gap;
const maxTranslate = Math.max(totalWidth - itemWidth * visibleCount, 0);

rightArrow.addEventListener("click", () => {
  currentTranslate += itemWidth * visibleCount;
  if (currentTranslate > maxTranslate) currentTranslate = maxTranslate;
  swipeItems.style.transform = `translateX(-${currentTranslate}px)`;
});

leftArrow.addEventListener("click", () => {
  currentTranslate -= itemWidth * visibleCount;
  if (currentTranslate < 0) currentTranslate = 0;
  swipeItems.style.transform = `translateX(-${currentTranslate}px)`;
});

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

// ===== Dropdown filters in Item-detail =====
// document.querySelectorAll(".filter-section.dropdown").forEach((section) => {
//   const header = section.querySelector(".dropdown-header");
//   header.addEventListener("click", () => {
//     section.classList.toggle("open");
//   });
// });

// document.querySelectorAll(".color-option").forEach((opt) => {
//   opt.addEventListener("click", () => {
//     opt.classList.toggle("active");
//   });
// });
