let currentProductIndex = 0;

// Render swipe items dynamically
function renderSwipeItems() {
  const swipeItems = document.querySelector('.swipe-items');
  if (!swipeItems) return;

  swipeItems.innerHTML = swipeProducts.map((product, index) =>
    `<img class="item" src="${product.image}" alt="${product.title}" data-index="${index}" />`
  ).join('');
}

// Function to render product popup
function renderSwipePopup(product) {
  const popupImage = document.getElementById('popupImage');
  const popupTitle = document.querySelector('.swipe-popup-title');
  const popupBrand = document.getElementById('swipePopupBrand');
  const popupDesc = document.getElementById('swipePopupDesc');

  if (popupImage) popupImage.src = product.image;
  if (popupTitle) popupTitle.textContent = product.title;
  if (popupBrand) popupBrand.textContent = product.brand;
  if (popupDesc) popupDesc.textContent = product.description;

  const detailsContainer = document.querySelector('.swipe-popup-details');
  if (!detailsContainer) return;

  detailsContainer.innerHTML = `
        <div class="swipe-detail-row">
          <span class="swipe-detail-label">Colour:</span>
          <div class="swipe-detail-values">
            ${product.colors.map(color => `
              <span class="swipe-color-tag">
                <span class="swipe-color-dot" style="background: ${color.code}${color.code === 'beige' || color.code === 'white' ? '; border: 1px solid #ccc' : ''}"></span>
                ${color.name}
              </span>
            `).join('')}
          </div>
        </div>
        <div class="swipe-detail-row">
          <span class="swipe-detail-label">Size:</span>
          <div class="swipe-detail-values">
            ${product.size.map(s => `<span class="swipe-text-tag">${s}</span>`).join('')}
          </div>
        </div>
        <div class="swipe-detail-row">
          <span class="swipe-detail-label">Recommend season:</span>
          <div class="swipe-detail-values">
            ${product.season.map(s => `<span class="swipe-text-tag">${s}</span>`).join('')}
          </div>
        </div>
        <div class="swipe-detail-row">
          <span class="swipe-detail-label">Texture:</span>
          <div class="swipe-detail-values">
            ${product.texture.map(t => `<span class="swipe-text-tag">${t}</span>`).join('')}
          </div>
        </div>
        <div class="swipe-detail-row">
          <span class="swipe-detail-label">Material:</span>
          <div class="swipe-detail-values">
            ${product.material.map(m => `<span class="swipe-text-tag">${m}</span>`).join('')}
          </div>
        </div>
        <div class="swipe-detail-row">
          <span class="swipe-detail-label">Style:</span>
          <div class="swipe-detail-values">
            ${product.style.map(s => `<span class="swipe-text-tag">${s}</span>`).join('')}
          </div>
        </div>
      `;
}

function showSwipePopup() {
  const popup = document.getElementById('swipePopup');
  if (popup) popup.style.display = 'flex';
}

function hideSwipePopup() {
  const popup = document.getElementById('swipePopup');
  if (popup) popup.style.display = 'none';
}

function loadNextProduct() {
  currentProductIndex = (currentProductIndex + 1) % swipeProducts.length;
  renderSwipePopup(swipeProducts[currentProductIndex]);
}

document.addEventListener('DOMContentLoaded', () => {
  // Render swipe items
  renderSwipeItems();

  // Render initial product data
  renderSwipePopup(swipeProducts[currentProductIndex]);

  // Add click event to swipe items
  const swipeItemsContainer = document.querySelector('.swipe-items');
  if (swipeItemsContainer) {
    swipeItemsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('item')) {
        const index = parseInt(e.target.dataset.index);
        currentProductIndex = index;
        renderSwipePopup(swipeProducts[currentProductIndex]);
        showSwipePopup();
      }
    });
  }

  // Close popup
  const closeBtn = document.getElementById('closePopup');
  if (closeBtn) {
    closeBtn.addEventListener('click', hideSwipePopup);
  }

  const popup = document.getElementById('swipePopup');
  if (popup) {
    popup.addEventListener('click', (e) => {
      if (e.target === popup) hideSwipePopup();
    });
  }

  // Pass/Like buttons
  const passBtn = document.querySelector('.swipe-btn-pass');
  if (passBtn) {
    passBtn.addEventListener('click', () => {
      console.log('Passed:', swipeProducts[currentProductIndex].title);
      loadNextProduct();
    });
  }

  const likeBtn = document.querySelector('.swipe-btn-like');
  if (likeBtn) {
    likeBtn.addEventListener('click', () => {
      console.log('Liked:', swipeProducts[currentProductIndex].title);
      loadNextProduct();
    });
  }

  // Scroll functionality
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