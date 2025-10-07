document.getElementById("item1").addEventListener("click", function () {
  window.location.href = "itemdetail.html";
});

// JS for Filter Popup
const filterBtn = document.getElementById("filterBtn");
const filterModal = document.getElementById("filterModal");
const closeFilter = document.getElementById("closeFilter");

filterBtn.addEventListener("click", () => {
  filterModal.style.display = "block";
});

closeFilter.addEventListener("click", () => {
  filterModal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === filterModal) {
    filterModal.style.display = "none";
  }
});
