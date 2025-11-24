// @Made By: Anmol Singh / Revise: Bella
let currentSortOption = "recent";

function openSortModal() {
  const modal = document.getElementById("sortModal");
  const sortBtn = document.querySelector(".sort-btn");

  if (!modal || !sortBtn) return;

  const modalContent = modal.querySelector(".sort-modal-content");
  const btnRect = sortBtn.getBoundingClientRect();

  modal.style.top = `${window.scrollY + btnRect.bottom + 8}px`;
  modal.style.left = `${window.scrollX + btnRect.left}px`;

  modal.style.display = "block";
  sortBtn.classList.add("open");
}

function closeSortModal() {
  const modal = document.getElementById("sortModal");
  const sortBtn = document.querySelector(".sort-btn");
  if (modal) modal.style.display = "none";
  if (sortBtn) sortBtn.classList.remove("open");
}

window.addEventListener("click", (event) => {
  const modal = document.getElementById("sortModal");
  const sortBtn = document.querySelector(".sort-btn");
  if (!modal || !sortBtn) return;

  if (modal.contains(event.target)) return;
  if (event.target === sortBtn) return;

  closeSortModal();
});

function initializeSortModal() {
  const sortOptions = document.querySelectorAll(
    '.sort-option input[type="radio"]'
  );

  sortOptions.forEach((option) => {
    option.addEventListener("change", function () {
      if (this.checked) {
        currentSortOption = this.value;
        applySorting(this.value);

        setTimeout(() => {
          closeSortModal();
        }, 150);
      }
    });
  });
}

function applySorting(sortType) {
  const sortEvent = new CustomEvent("sortApplied", {
    detail: {
      sortType: sortType,
      label: getSortLabel(sortType),
    },
  });
  window.dispatchEvent(sortEvent);
}

function getSortLabel(sortType) {
  const labels = {
    recent: "Recently added",
    "high-to-low": "$ High to Low",
    "low-to-high": "$ Low to High",
  };
  return labels[sortType] || sortType;
}

function getCurrentSort() {
  return currentSortOption;
}

// Load modal HTML + init
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("sort-modal-container");

  if (container) {
    fetch("/view/components/pages/sort-modal.html")
      .then((res) => res.text())
      .then((html) => {
        container.innerHTML = html;
        initializeSortModal();
      });
  } else {
    initializeSortModal();
  }
});

window.openSortModal = openSortModal;
window.closeSortModal = closeSortModal;
window.getCurrentSort = getCurrentSort;
