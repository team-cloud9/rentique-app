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

document.querySelectorAll(".dropdown-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    this.classList.toggle("active");
  });
});

// ===============================
// APPLY BUTTON ENABLE / DISABLE
// ===============================
const applyBtn = document.querySelector(".apply-btn");
const filterButtons = document.querySelectorAll(".filter-btn");
const distanceSlider = document.getElementById("distanceRange");
const priceSlider = document.getElementById("priceRange");

function updateApplyButtonState() {
  const activeFilters = document.querySelectorAll(".filter-btn.active");

  // Extract slider value
  const distanceValue = distanceSlider ? parseInt(distanceSlider.value, 10) : 0;
  const priceValue = priceSlider ? parseInt(priceSlider.value, 10) : 0;

  const hasActiveFilters =
    activeFilters.length > 0 || distanceValue > 0 || priceValue > 0;

  if (!hasActiveFilters) {
    applyBtn.disabled = true;
    applyBtn.style.opacity = "0.5";
    applyBtn.style.cursor = "not-allowed";
  } else {
    applyBtn.disabled = false;
    applyBtn.style.opacity = "1";
    applyBtn.style.cursor = "pointer";
  }
}

updateApplyButtonState();

filterButtons.forEach((btn) => {
  btn.addEventListener("click", updateApplyButtonState);
});

if (distanceSlider) distanceSlider.addEventListener("input", updateApplyButtonState);
if (priceSlider) priceSlider.addEventListener("input", updateApplyButtonState);



//Close popup style
const swipePopup = document.getElementById("swipePopup");
const closeFilterPopup = document.getElementById("closeFilterPopup");

if (closeFilterPopup && swipePopup) {
  closeFilterPopup.addEventListener("click", () => {
    swipePopup.style.display = "none";
  });
}

// ===============================
// ACCORDION TOGGLE FOR FILTER SECTIONS
// ===============================
document.querySelectorAll(".filter-section h3").forEach((h3) => {
  h3.addEventListener("click", () => {
    const section = h3.parentElement;
    section.classList.toggle("active");
  });
});

// ===============================
// DISTANCE SLIDER LABEL + INITIAL VALUE
// ===============================

if (distanceRange) {
  distanceRange.value = 0;

  // Label
  const bubble = document.createElement("div");
  bubble.id = "distanceBubble";
  bubble.textContent = "0 km";
  bubble.style.position = "absolute";
  bubble.style.top = "-25px";
  bubble.style.left = "0";
  bubble.style.fontSize = "12px";
  bubble.style.color = "var(--gray-600)";
  bubble.style.opacity = "0";
  bubble.style.transition = "opacity 0.3s ease, left 0.1s ease";
  bubble.style.pointerEvents = "none";

  // add to .range-container
  const rangeContainer = distanceRange.closest(".range-container");
  if (rangeContainer) {
    rangeContainer.style.position = "relative";
    rangeContainer.appendChild(bubble);
  }

  distanceRange.addEventListener("input", (e) => {
    const value = parseInt(e.target.value, 10);
    bubble.textContent = `${value} km`;

    // depends on the slider point
    const percent = (value - e.target.min) / (e.target.max - e.target.min);
    const newLeft = percent * (e.target.offsetWidth - 20);
    bubble.style.left = `${newLeft}px`;

    // Show only while moving
    bubble.style.opacity = "1";
    clearTimeout(distanceRange.hideTimeout);
    distanceRange.hideTimeout = setTimeout(() => {
      bubble.style.opacity = "0";
    }, 800);

    if (typeof updateApplyButtonState === "function") {
      updateApplyButtonState();
    }
  });
}

// ===============================
// PRICE RANGE LABEL + INITIAL VALUE
// ===============================
const priceRange = document.getElementById("priceRange");

if (priceRange) {
  priceRange.value = 0;

  // Label
  const priceBubble = document.createElement("div");
  priceBubble.id = "priceBubble";
  priceBubble.textContent = "$0";
  priceBubble.style.position = "absolute";
  priceBubble.style.top = "-25px";
  priceBubble.style.left = "0";
  priceBubble.style.fontSize = "12px";
  priceBubble.style.color = "var(--gray-600)";
  priceBubble.style.opacity = "0";
  priceBubble.style.transition = "opacity 0.3s ease, left 0.1s ease";
  priceBubble.style.pointerEvents = "none";

  const rangeContainer = priceRange.closest(".range-container");
  if (rangeContainer) {
    rangeContainer.style.position = "relative";
    rangeContainer.appendChild(priceBubble);
  }

  priceRange.addEventListener("input", (e) => {
    const value = parseInt(e.target.value, 10);
    priceBubble.textContent = `$${value}`;

    const percent = (value - e.target.min) / (e.target.max - e.target.min);
    const newLeft = percent * (e.target.offsetWidth - 20);
    priceBubble.style.left = `${newLeft}px`;

    priceBubble.style.opacity = "1";
    clearTimeout(priceRange.hideTimeout);
    priceRange.hideTimeout = setTimeout(() => {
      priceBubble.style.opacity = "0";
    }, 800);

    if (typeof updateApplyButtonState === "function") {
      updateApplyButtonState();
    }
  });
}