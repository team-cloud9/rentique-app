// ============================
// LIKED PAGE (with Sort & Filter)
// ============================

import { auth, firestore as db } from "../services/firebase-init.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

console.log("Liked page loaded!");

let likedItems = [];
let filteredItems = [];

document.addEventListener("DOMContentLoaded", () => {
  const listContainer = document.querySelector(".list-items");

  // ============================
  // Load liked items
  // ============================
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      listContainer.innerHTML = `<p style="text-align:center;">Please log in to view your liked items.</p>`;
      return;
    }

    const likesRef = collection(db, "customers", user.uid, "likedItems");
    const snapshot = await getDocs(likesRef);
    likedItems = snapshot.docs.map((doc) => doc.data());

    console.log("📡 Loaded liked items:", likedItems);

    if (likedItems.length === 0) {
      listContainer.innerHTML = "<p style='text-align:center;'>No liked items yet</p>";
      return;
    }

    // Default display
    filteredItems = [...likedItems];
    renderLikedList(filteredItems);

    // Enable sorting & filtering
    setupSorting();
    setupFilter();
  });

  // ============================
  // Render liked cards
  // ============================
  function renderLikedList(items) {
    listContainer.innerHTML = items
      .map(
        (product, index) => `
      <div class="card" data-index="${index}">
        <div class="img">
          <img src="${Array.isArray(product.image) ? product.image[0] : product.image}" alt="${product.title}" />
        </div>
        <p class="name">${product.title || "Untitled"}</p>
        <p class="desc">${product.description || ""}</p>
      </div>
    `
      )
      .join("");

    // ✅ Save selected item + open popup
    const cards = listContainer.querySelectorAll(".card");
    cards.forEach((card) => {
      card.addEventListener("click", (e) => {
        e.preventDefault();
        const index = card.dataset.index;
        const selected = items[index];
        if (!selected) return;

        // Save to localStorage if needed
        localStorage.setItem("selectedProduct", JSON.stringify(selected));

        // 🩵 Show popup like Home
        renderSwipePopup(selected);
        showSwipePopup();
      });
    });
  }


  // ============================
  // SORT by Recently / Oldest liked
  // ============================
  function setupSorting() {
    const radios = document.querySelectorAll('input[name="sort"]');
    const dropdownBtn = document.querySelector(".sort-btn");
    const dropdownMenu = document.querySelector(".dropdown-menu");

    // Dropdown toggle
    if (dropdownBtn && dropdownMenu) {
      dropdownBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle("show");
      });
      document.addEventListener("click", (e) => {
        if (!dropdownMenu.contains(e.target) && !dropdownBtn.contains(e.target)) {
          dropdownMenu.classList.remove("show");
        }
      });
    }

    // Sort logic
    radios.forEach((radio) => {
      radio.addEventListener("change", (e) => {
        const value = e.target.value;
        let sorted = [...filteredItems];
        if (value === "recent") {
          sorted.sort((a, b) => (b.likedAt?.seconds || 0) - (a.likedAt?.seconds || 0));
        } else if (value === "oldest") {
          sorted.sort((a, b) => (a.likedAt?.seconds || 0) - (b.likedAt?.seconds || 0));
        }
        renderLikedList(sorted);
      });
    });
  }

  // ============================
  // FILTER by style / size / season / material
  // ============================
  function setupFilter() {
    const filterBtn = document.getElementById("filterBtn");
    const popup = document.getElementById("filterPopup");
    const closePopup = document.getElementById("closePopup");
    const applyBtn = document.querySelector(".apply-btn");

    // open/close
    if (filterBtn) filterBtn.addEventListener("click", () => (popup.style.display = "block"));
    if (closePopup) closePopup.addEventListener("click", () => (popup.style.display = "none"));

    // toggle active class
    const filterButtons = document.querySelectorAll(".filter-btn");
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => btn.classList.toggle("active"));
    });

    // Apply filters
    if (applyBtn) {
      applyBtn.addEventListener("click", () => {
        const selected = Array.from(document.querySelectorAll(".filter-btn.active")).map((b) =>
          b.textContent.trim().toLowerCase()
        );

        if (selected.length === 0) {
          filteredItems = [...likedItems];
        } else {
          filteredItems = likedItems.filter((p) =>
            selected.some(
              (f) =>
                p.style?.some((s) => s.toLowerCase() === f) ||
                p.size?.some((sz) => sz.toLowerCase() === f) ||
                p.season?.some((se) => se.toLowerCase() === f) ||
                p.material?.some((m) => m.toLowerCase() === f)
            )
          );
        }

        renderLikedList(filteredItems);
        popup.style.display = "none";
      });
    }
  }
});

// ============================
// Popup for Liked Items
// ============================
function renderSwipePopup(product) {
  const popupImage = document.getElementById("popupImage");
  const popupTitle = document.querySelector(".swipe-popup-title");
  const popupBrand = document.getElementById("swipePopupBrand");
  const popupDesc = document.getElementById("swipePopupDesc");
  const detailsContainer = document.querySelector(".swipe-popup-details");

  if (popupImage) popupImage.src = product.image || "../assets/img/no-image.png";
  if (popupTitle) popupTitle.textContent = product.title || "Untitled Item";
  if (popupBrand) popupBrand.textContent = product.brand || "Unknown Brand";
  if (popupDesc) popupDesc.textContent = product.description || "";

  if (!detailsContainer) return;
  detailsContainer.innerHTML = `
    <div class="swipe-detail-row">
      <span class="swipe-detail-label">Season:</span>
      <div class="swipe-detail-values">
        ${(product.season || [])
      .map((s) => `<span class="swipe-text-tag">${s}</span>`)
      .join("")}
      </div>
    </div>

    <div class="swipe-detail-row">
      <span class="swipe-detail-label">Material:</span>
      <div class="swipe-detail-values">
        ${(product.material || [])
      .map((m) => `<span class="swipe-text-tag">${m}</span>`)
      .join("")}
      </div>
    </div>

    <div class="swipe-detail-row">
      <span class="swipe-detail-label">Style:</span>
      <div class="swipe-detail-values">
        ${(product.style || [])
      .map((st) => `<span class="swipe-text-tag">${st}</span>`)
      .join("")}
      </div>
    </div>

    <div class="swipe-detail-row">
      <span class="swipe-detail-label">Colour:</span>
      <div class="swipe-detail-values">
        ${(product.colors || [])
      .map(
        (color) => `
            <span class="swipe-color-tag">
              <span class="swipe-color-dot"
                style="background:${color.code}${color.code === "white" || color.code === "beige"
            ? "; border: 1px solid #ccc"
            : ""
          }"></span>
              ${color.name}
            </span>`
      )
      .join("")}
      </div>
    </div>

    <div class="swipe-detail-row">
      <span class="swipe-detail-label">Size:</span>
      <div class="swipe-detail-values">
        ${(product.size || [])
      .map((s) => `<span class="swipe-text-tag">${s}</span>`)
      .join("")}
      </div>
    </div>
  `;
}

function showSwipePopup() {
  const popup = document.getElementById("swipePopup");
  if (popup) popup.style.display = "flex";
}

function hideSwipePopup() {
  const popup = document.getElementById("swipePopup");
  if (popup) popup.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("swipePopup");
  const closeBtn = document.getElementById("closePopup");

  if (closeBtn) closeBtn.addEventListener("click", hideSwipePopup);
  if (popup)
    popup.addEventListener("click", (e) => {
      if (e.target === popup) hideSwipePopup();
    });

  // Attach popup open to liked item cards
  document.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;
    const index = card.dataset.index;
    const selectedProduct = filteredItems[index];
    if (selectedProduct) {
      renderSwipePopup(selectedProduct);
      showSwipePopup();
    }
  });
});

// ============================
// FIX: Ensure Filter Button Active Toggle Works
// ============================
document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("active");
    });
  });
});
