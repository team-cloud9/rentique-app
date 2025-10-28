// ============================
// HOME PAGE MAIN SCRIPT
// ============================

let currentProductIndex = 0;

// ============================
// Render Swipe Items
// ============================
function renderSwipeItems() {
  const swipeItems = document.querySelector(".swipe-items");
  if (!swipeItems) return;

  swipeItems.innerHTML = swipeProducts
    .map(
      (product, index) => `
      <img class="item" src="${product.image}" alt="${product.title}" data-index="${index}" />
    `
    )
    .join("");
}

// ============================
// Render Item List
// ============================
function renderItemList() {
  const listItemsContainer = document.querySelector(".list-items");
  if (!listItemsContainer) return;

  listItemsContainer.innerHTML = itemProducts
    .slice(0, 4)
    .map(
      (product, index) => `
    <a href="./c-itemdetail.html" class="card" data-index="${index}">
      <div class="img">
        <img src="${product.image}" alt="${product.title}" />
      </div>
      <p class="name">${product.title}</p>
      <p class="desc">${product.description}</p>
      <p class="price">${product.brand}</p>
    </a>
  `
    )
    .join("");

  // LocalStorage
  const cards = listItemsContainer.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const index = card.dataset.index;
      const selectedProduct = itemProducts[index];
      if (!selectedProduct) return;
      localStorage.setItem("selectedProduct", JSON.stringify(selectedProduct));
      console.log("Saved product:", selectedProduct);
    });
  });
}

// ============================
// Render Swipe Popup
// ============================
function renderSwipePopup(product) {
  const popupImage = document.getElementById("popupImage");
  const popupTitle = document.querySelector(".swipe-popup-title");
  const popupBrand = document.getElementById("swipePopupBrand");
  const popupDesc = document.getElementById("swipePopupDesc");

  if (popupImage) popupImage.src = product.image;
  if (popupTitle) popupTitle.textContent = product.title;
  if (popupBrand) popupBrand.textContent = product.brand;
  if (popupDesc) popupDesc.textContent = product.description;

  const detailsContainer = document.querySelector(".swipe-popup-details");
  if (!detailsContainer) return;

  detailsContainer.innerHTML = `
    <div class="swipe-detail-row">
      <span class="swipe-detail-label">Colour:</span>
      <div class="swipe-detail-values">
        ${product.colors
      .map(
        (color) => `
          <span class="swipe-color-tag">
            <span class="swipe-color-dot" style="background: ${color.code}${color.code === "white" || color.code === "beige" ? "; border: 1px solid #ccc" : ""
          }"></span>
            ${color.name}
          </span>
        `
      )
      .join("")}
      </div>
    </div>
    <div class="swipe-detail-row">
      <span class="swipe-detail-label">Size:</span>
      <div class="swipe-detail-values">
        ${product.size.map((s) => `<span class="swipe-text-tag">${s}</span>`).join("")}
      </div>
    </div>
    <div class="swipe-detail-row">
      <span class="swipe-detail-label">Season:</span>
      <div class="swipe-detail-values">
        ${product.season.map((s) => `<span class="swipe-text-tag">${s}</span>`).join("")}
      </div>
    </div>
    <div class="swipe-detail-row">
      <span class="swipe-detail-label">Material:</span>
      <div class="swipe-detail-values">
        ${product.material.map((m) => `<span class="swipe-text-tag">${m}</span>`).join("")}
      </div>
    </div>
    <div class="swipe-detail-row">
      <span class="swipe-detail-label">Style:</span>
      <div class="swipe-detail-values">
        ${product.style.map((st) => `<span class="swipe-text-tag">${st}</span>`).join("")}
      </div>
    </div>
  `;
}

// ============================
// Popup Control
// ============================
function showSwipePopup() {
  const popup = document.getElementById("swipePopup");
  if (popup) popup.style.display = "flex";
}

function hideSwipePopup() {
  const popup = document.getElementById("swipePopup");
  if (popup) popup.style.display = "none";
}

function loadNextProduct() {
  currentProductIndex = (currentProductIndex + 1) % swipeProducts.length;
  renderSwipePopup(swipeProducts[currentProductIndex]);
}

// ============================
// Save Like/Pass History
// ============================
function saveSwipeHistory(key, product) {
  const existing = JSON.parse(localStorage.getItem(key)) || [];
  const isAlreadySaved = existing.some((item) => item.id === product.id);
  if (isAlreadySaved) return;

  existing.push(product);
  localStorage.setItem(key, JSON.stringify(existing));
  console.log(`Saved to ${key}:`, product.title);
}

// ============================
// Initialize
// ============================
document.addEventListener("DOMContentLoaded", () => {
  renderSwipeItems();
  renderItemList();
  renderSwipePopup(swipeProducts[currentProductIndex]);

  // Swipe items click
  const swipeItemsContainer = document.querySelector(".swipe-items");
  if (swipeItemsContainer) {
    swipeItemsContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("item")) {
        const index = parseInt(e.target.dataset.index);
        currentProductIndex = index;
        renderSwipePopup(swipeProducts[currentProductIndex]);
        showSwipePopup();
      }
    });
  }

  // Close popup
  const closeBtn = document.getElementById("closePopup");
  if (closeBtn) closeBtn.addEventListener("click", hideSwipePopup);

  const popup = document.getElementById("swipePopup");
  if (popup) {
    popup.addEventListener("click", (e) => {
      if (e.target === popup) hideSwipePopup();
    });
  }

  // Like / Pass Buttons
  const passBtn = document.querySelector(".swipe-btn-pass");
  const likeBtn = document.querySelector(".swipe-btn-like");

  if (passBtn) {
    passBtn.addEventListener("click", () => {
      const currentProduct = swipeProducts[currentProductIndex];
      saveSwipeHistory("passedItems", currentProduct);
      loadNextProduct();
    });
  }

  if (likeBtn) {
    likeBtn.addEventListener("click", () => {
      const currentProduct = swipeProducts[currentProductIndex];
      saveSwipeHistory("likedItems", currentProduct);
      loadNextProduct();
    });
  }

  // Arrows scroll
  const swipeItems = document.querySelector(".swipe-items");
  const leftBtn = document.querySelector(".arrow.left");
  const rightBtn = document.querySelector(".arrow.right");

  let currentScroll = 0;

  function getMoveDistance() {
    const item = swipeItems.querySelector("img");
    if (!item) return 0;
    const itemStyle = window.getComputedStyle(item);
    const itemWidth = item.offsetWidth;
    const gap = parseInt(itemStyle.marginRight) || 16;
    return itemWidth + gap;
  }

  function getMaxScroll() {
    return swipeItems.scrollWidth - swipeItems.clientWidth;
  }

  if (rightBtn) {
    rightBtn.addEventListener("click", () => {
      const moveDistance = getMoveDistance();
      const maxScroll = getMaxScroll();
      currentScroll = Math.min(currentScroll + moveDistance, maxScroll);
      swipeItems.scrollTo({ left: currentScroll, behavior: "smooth" });
    });
  }

  if (leftBtn) {
    leftBtn.addEventListener("click", () => {
      const moveDistance = getMoveDistance();
      currentScroll = Math.max(currentScroll - moveDistance, 0);
      swipeItems.scrollTo({ left: currentScroll, behavior: "smooth" });
    });
  }
});