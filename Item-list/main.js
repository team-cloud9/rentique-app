document.getElementById("item1").addEventListener("click", function () {
  window.location.href = "itemdetail.html";
});

// JS for Filter Popup
const filterBtn = document.getElementById("filterBtn");
const filterPopup = document.getElementById("filterPopup");
const closePopup = document.getElementById("closePopup");
const applyFilter = document.getElementById("applyFilter");

// 열기
filterBtn.addEventListener("click", () => {
  filterPopup.style.display = "block";
});

// 닫기 (X)
closePopup.addEventListener("click", () => {
  filterPopup.style.display = "none";
});

// Apply 누르면 닫힘
applyFilter.addEventListener("click", () => {
  filterPopup.style.display = "none";
});

// 배경 클릭 시 닫기
window.addEventListener("click", (event) => {
  if (event.target === filterPopup) {
    filterPopup.style.display = "none";
  }
});

// Sort dropdown toggle
const sortButton = document.querySelectorAll(".dropdown-btn")[1]; // 2番目のボタン（Sort）
const dropdownMenu = document.querySelector(".dropdown-menu");

sortButton.addEventListener("click", function () {
  dropdownMenu.classList.toggle("show");
});

// Close dropdown when clicking outside
document.addEventListener("click", function (event) {
  const isClickInside = event.target.closest(".dropdown");

  if (!isClickInside) {
    dropdownMenu.classList.remove("show");
  }
});
