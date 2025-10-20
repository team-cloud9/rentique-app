// // ===== Filter Popup =====
// const filterBtn = document.getElementById("filterBtn");
// const filterPopup = document.getElementById("filterPopup");
// const closePopup = document.getElementById("closePopup");
// const applyFilter = document.querySelector(".apply-btn");

// // open
// if (filterBtn && filterPopup) {
//   filterBtn.addEventListener("click", (e) => {
//     e.stopPropagation();
//     filterPopup.style.display = "block";
//   });
// }

// // close
// if (closePopup && filterPopup) {
//   closePopup.addEventListener("click", () => {
//     filterPopup.style.display = "none";
//   });
// }

// // apply (close on click)
// if (applyFilter && filterPopup) {
//   applyFilter.addEventListener("click", () => {
//     filterPopup.style.display = "none";
//   });
// }

// // close when clicking outside
// if (filterPopup) {
//   window.addEventListener("click", (event) => {
//     if (event.target === filterPopup) {
//       filterPopup.style.display = "none";
//     }
//   });
// }

// // ===== Sort Dropdown =====
// const sortButton = document.querySelector(".sort-btn");
// const dropdownMenu = document.querySelector(".dropdown-menu");

// if (sortButton && dropdownMenu) {
//   sortButton.addEventListener("click", (e) => {
//     e.stopPropagation();
//     dropdownMenu.classList.toggle("show");
//   });

//   document.addEventListener("click", (event) => {
//     if (!event.target.closest(".dropdown")) {
//       dropdownMenu.classList.remove("show");
//     }
//   });
// }

// // ===== Filter Button Toggle =====
// document.querySelectorAll(".filter-btn").forEach((btn) => {
//   btn.addEventListener("click", function () {
//     this.classList.toggle("active");
//   });
// });

// // ===== Apply Button (optional alert) =====
// if (applyFilter) {
//   applyFilter.addEventListener("click", function () {
//     const activeFilters = document.querySelectorAll(".filter-btn.active");
//     alert("Applied " + activeFilters.length + " filters!");
//   });
// }

// // ===== Dropdown filters in Item-detail =====
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

// Image carousel
let currentImageIndex = 0;
const images = document.querySelectorAll('.detail-images .image-placeholder');

function nextImage() {
  images[currentImageIndex].classList.add('hidden');
  currentImageIndex = (currentImageIndex + 1) % images.length;
  images[currentImageIndex].classList.remove('hidden');
}

// Dropdown toggle
function toggleDropdown(element) {
  const section = element.closest('.detail-section');
  section.classList.toggle('collapsed');
}

// Color / Size だけ反応（.detail-section.selectable 配下）
// クリックされたボタンだけ toggle、同じグループの他は外す
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.detail-section.selectable .tag-btn');
  if (!btn) return;

  const group = btn.closest('.tag-group');
  // 自分以外の active を外す
  group.querySelectorAll('.tag-btn').forEach(b => {
    if (b !== btn) b.classList.remove('active');
  });
  // 自分は toggle（同じボタン再クリックで解除も可）
  btn.classList.toggle('active');
});

function toggleDropdown(el) {
  if (window.innerWidth <= 768) {
    el.closest('.detail-section').classList.toggle('collapsed');
  }
}

// ページが開いた時 & サイズが変わった時に状態を整える
function setDropdownState() {
  const dropdowns = document.querySelectorAll('.detail-section[data-dropdown]');
  if (window.innerWidth > 768) {
    // デスクトップ：全部開く
    dropdowns.forEach(s => s.classList.remove('collapsed'));
  } else {
    // モバイル：全部閉じる
    dropdowns.forEach(s => s.classList.add('collapsed'));
  }
}

setDropdownState();
window.addEventListener('resize', setDropdownState);
