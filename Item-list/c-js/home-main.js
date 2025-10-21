const swipeItems = document.querySelector(".swipe-items");
const leftBtn = document.querySelector(".arrow.left");
const rightBtn = document.querySelector(".arrow.right");

let currentScroll = 0;

// Dynamically calculate item width and gap
function getMoveDistance() {
  const item = swipeItems.querySelector("img");
  const itemStyle = window.getComputedStyle(item);
  const itemWidth = item.offsetWidth;
  const gap = parseInt(itemStyle.marginRight) || 16; // fallback if gap not set
  return itemWidth + gap;
}

function getMaxScroll() {
  return swipeItems.scrollWidth - swipeItems.clientWidth;
}

// Scroll right
rightBtn.addEventListener("click", () => {
  const moveDistance = getMoveDistance();
  const maxScroll = getMaxScroll();
  currentScroll = Math.min(currentScroll + moveDistance, maxScroll);
  swipeItems.scrollTo({ left: currentScroll, behavior: "smooth" });
});

// Scroll left
leftBtn.addEventListener("click", () => {
  const moveDistance = getMoveDistance();
  currentScroll = Math.max(currentScroll - moveDistance, 0);
  swipeItems.scrollTo({ left: currentScroll, behavior: "smooth" });
});

//Scroll top
const scrollTopBtn = document.querySelector(".scroll-top");

// for tablet & spn
if (scrollTopBtn && window.innerWidth <= 1024) {
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

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

