// @Made By: Anmol Singh
console.log("Filter Modal Initialized");
const selectedFilters = {
  category: [],
  size: [],
  price: 10,
  distance: 0,
  style: [],
  material: [],
  texture: [],
  season: [],
  color: [],
  gender: [],
}


function openFilterModal() {
  console.log("openFilterModal Initialized");
  const modal = document.getElementById("filterModal");
  console.log(modal);
  if (modal) {
    modal.style.display = "block"
    document.body.style.overflow = "hidden" 
  }
}


function closeFilterModal() {
  const modal = document.getElementById("filterModal")
  if (modal) {
    modal.style.display = "none"
    document.body.style.overflow = "auto"
  }
}


window.onclick = (event) => {
  const modal = document.getElementById("filterModal")
  if (event.target === modal) {
    closeFilterModal()
  }
}

function initializeFilterModal() {

  const filterChips = document.querySelectorAll(".filter-chip");
  console.log(filterChips);
  filterChips.forEach((chip) => {
    chip.addEventListener("click", function () {
      this.classList.toggle("active")
      updateApplyButton()
    })
  })


  const colorChips = document.querySelectorAll(".color-chip")
  colorChips.forEach((chip) => {
    chip.addEventListener("click", function () {
      this.classList.toggle("active")
      updateApplyButton()
    })
  })


  const priceSlider = document.getElementById("priceSlider")
  const priceValue = document.getElementById("priceValue")
  if (priceSlider && priceValue) {
    priceSlider.addEventListener("input", function () {
      priceValue.textContent = `$${this.value}`
      selectedFilters.price = Number.parseInt(this.value)
      updateApplyButton()
    })
  }


  const distanceSlider = document.getElementById("distanceSlider")
  const distanceValue = document.getElementById("distanceValue")
  if (distanceSlider && distanceValue) {
    distanceSlider.addEventListener("input", function () {
      distanceValue.textContent = `${this.value} km`
      selectedFilters.distance = Number.parseInt(this.value)
      updateApplyButton()
    })
  }
}

function updateApplyButton() {
  const applyBtn = document.querySelector(".apply-btn")
  const hasSelections =
    document.querySelectorAll(".filter-chip.active, .color-chip.active").length > 0 ||
    selectedFilters.price > 1 ||
    selectedFilters.distance > 0

  if (hasSelections) {
    applyBtn.classList.add("active")
  } else {
    applyBtn.classList.remove("active")
  }
}
function applyFilters() {
  selectedFilters.category = Array.from(
    document.querySelectorAll(".filter-section:nth-child(1) .filter-chip.active"),
  ).map((chip) => chip.textContent)

  selectedFilters.size = Array.from(document.querySelectorAll(".filter-section:nth-child(2) .filter-chip.active")).map(
    (chip) => chip.textContent,
  )

  selectedFilters.style = Array.from(document.querySelectorAll(".filter-section:nth-child(5) .filter-chip.active")).map(
    (chip) => chip.textContent,
  )

  selectedFilters.material = Array.from(
    document.querySelectorAll(".filter-section:nth-child(6) .filter-chip.active"),
  ).map((chip) => chip.textContent)

  selectedFilters.texture = Array.from(
    document.querySelectorAll(".filter-section:nth-child(7) .filter-chip.active"),
  ).map((chip) => chip.textContent)

  selectedFilters.season = Array.from(
    document.querySelectorAll(".filter-section:nth-child(8) .filter-chip.active"),
  ).map((chip) => chip.textContent)

  selectedFilters.color = Array.from(document.querySelectorAll(".color-chip.active")).map((chip) => chip.dataset.color)

  selectedFilters.gender = Array.from(
    document.querySelectorAll(".filter-section:nth-child(10) .filter-chip.active"),
  ).map((chip) => chip.textContent)

  console.log("Applied Filters:", selectedFilters)

  const filterEvent = new CustomEvent("filtersApplied", { detail: selectedFilters })
  window.dispatchEvent(filterEvent)

  closeFilterModal()
}
document.addEventListener("DOMContentLoaded", () => {
  const filterModalContainer = document.getElementById("filter-modal-container")
  if (filterModalContainer) {
    fetch("/view/components/pages/filter-modal.html")
      .then((response) => response.text())
      .then((html) => {
        filterModalContainer.innerHTML = html
        initializeFilterModal()
      })
      .catch((error) => console.error("Error loading filter modal:", error))
  } else {
    initializeFilterModal()
  }
})

window.openFilterModal = openFilterModal
window.closeFilterModal = closeFilterModal
window.applyFilters = applyFilters
