// ===============================
// DISCOVER MAIN FUNCTIONALITY
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    // ---- SWIPE SECTION ----
    renderSwipeItems();                // Render top swipe section
    setupSwipeActions();               // Set up swipe interactions (click + arrows)

    // ---- DISCOVER SECTION ----
    renderDiscoverList(itemProducts);  // Render product list
    setupSorting();                    // Enable sorting functionality
    setupFilter();                     // Enable filter functionality

    // ---- SORT DROPDOWN ----
    const sortButton = document.querySelector(".sort-btn");
    const dropdownMenu = document.querySelector(".dropdown-menu");
    if (sortButton && dropdownMenu) {
        sortButton.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle("show");
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", (event) => {
            if (!event.target.closest(".dropdown")) dropdownMenu.classList.remove("show");
        });
    }

    // ---- POPUP CLOSE ----
    const closeBtn = document.getElementById("closePopup");
    const popup = document.getElementById("swipePopup");

    if (closeBtn) {
        closeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            hideSwipePopup();
        });
    }

    if (popup) {
        popup.addEventListener("click", (e) => {
            if (e.target === popup) hideSwipePopup();
        });
    }

    // ---- LIKE / PASS BUTTONS ----
    const passBtn = document.querySelector(".swipe-btn-pass");
    const likeBtn = document.querySelector(".swipe-btn-like");

    function saveSwipeHistory(key, product) {
        const existing = JSON.parse(localStorage.getItem(key)) || [];
        const alreadySaved = existing.some((item) => item.id === product.id);
        if (alreadySaved) return;
        existing.push(product);
        localStorage.setItem(key, JSON.stringify(existing));
        console.log(`Saved to ${key}:`, product.title);
    }

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
});


// ============================
// SWIPE ITEMS RENDER
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
// SWIPE ACTIONS (CLICK + ARROWS)
// ============================
function setupSwipeActions() {
    const swipeItemsContainer = document.querySelector(".swipe-items");
    const leftBtn = document.querySelector(".arrow.left");
    const rightBtn = document.querySelector(".arrow.right");
    if (!swipeItemsContainer) return;

    let currentScroll = 0;

    function getMoveDistance() {
        const item = swipeItemsContainer.querySelector("img");
        if (!item) return 0;
        const itemStyle = window.getComputedStyle(item);
        const itemWidth = item.offsetWidth;
        const gap = parseInt(itemStyle.marginRight) || 16;
        return itemWidth + gap;
    }

    function getMaxScroll() {
        return swipeItemsContainer.scrollWidth - swipeItemsContainer.clientWidth;
    }

    if (rightBtn) {
        rightBtn.addEventListener("click", () => {
            const moveDistance = getMoveDistance();
            const maxScroll = getMaxScroll();
            currentScroll = Math.min(currentScroll + moveDistance, maxScroll);
            swipeItemsContainer.scrollTo({ left: currentScroll, behavior: "smooth" });
        });
    }

    if (leftBtn) {
        leftBtn.addEventListener("click", () => {
            const moveDistance = getMoveDistance();
            currentScroll = Math.max(currentScroll - moveDistance, 0);
            swipeItemsContainer.scrollTo({ left: currentScroll, behavior: "smooth" });
        });
    }

    // --- Swipe item click → open popup ---
    swipeItemsContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("item")) {
            const index = parseInt(e.target.dataset.index);
            currentProductIndex = index;
            renderSwipePopup(swipeProducts[currentProductIndex]);
            showSwipePopup();
        }
    });
}


// ===============================
// RENDER PRODUCT LIST
// ===============================
function renderDiscoverList(products) {
    const listContainer = document.querySelector(".list-items");
    if (!listContainer) return;

    listContainer.innerHTML = products.map((p, index) => `
    <a href="./c-itemdetail.html" class="card" data-index="${index}">
        <div class="img"><img src="${p.image}" alt="${p.title}" /></div>
        <p class="name">${p.title}</p>
        <p class="desc">${p.description}</p>
        <p class="price">$${p.price}</p>
    </a>
  `).join('');

    // Save selected product
    const cards = listContainer.querySelectorAll(".card");
    cards.forEach((card, i) => {
        card.addEventListener("click", () => {
            const selected = products[i];
            localStorage.setItem("selectedProduct", JSON.stringify(selected));
        });
    });
}


// ===============================
// SORT FUNCTIONALITY
// ===============================
function setupSorting() {
    const sortRadios = document.querySelectorAll('input[name="sort"]');
    sortRadios.forEach(radio => {
        radio.addEventListener("change", (e) => {
            const value = e.target.value;
            let sorted = [...itemProducts];
            if (value === "price-high") sorted.sort((a, b) => b.price - a.price);
            else if (value === "price-low") sorted.sort((a, b) => a.price - b.price);
            else sorted.sort((a, b) => a.id - b.id);
            renderDiscoverList(sorted);
        });
    });
}


// ===============================
// FILTER FUNCTIONALITY
// ===============================
function setupFilter() {
    const applyButton = document.querySelector(".apply-btn");
    if (applyButton) {
        applyButton.addEventListener("click", () => {
            applyFilters();
            document.getElementById("filterPopup").style.display = "none";
        });
    }
}

const filterSynonyms = {
    xs: "x-small",
    s: "small",
    m: "medium",
    l: "large",
    xl: "x-large",
    xxl: "xx-large",
};

function applyFilters() {
    const activeButtons = document.querySelectorAll(".filter-btn.active");
    if (activeButtons.length === 0) {
        renderDiscoverList(itemProducts);
        return;
    }

    const selectedFilters = Array.from(activeButtons).map(btn => {
        let text = btn.textContent.trim().toLowerCase();
        if (filterSynonyms[text]) text = filterSynonyms[text];
        return text;
    });

    const filtered = itemProducts.filter(p => {
        const productMatches = [];
        selectedFilters.forEach(f => {
            if (
                p.style?.some(s => s.toLowerCase() === f) ||
                p.material?.some(m => m.toLowerCase() === f) ||
                p.colors?.some(c => c.name.toLowerCase() === f) ||
                p.size?.some(sz => sz.toLowerCase() === f) ||
                p.season?.some(se => se.toLowerCase() === f)
            ) productMatches.push(f);
        });
        return productMatches.length === selectedFilters.length;
    });

    renderDiscoverList(filtered);
}


// ============================
// SWIPE POPUP LOGIC
// ============================
let currentProductIndex = 0;

function renderSwipePopup(product) {
    const popup = document.getElementById("swipePopup");
    if (!popup) return;

    const popupImage = document.getElementById("popupImage");
    const popupTitle = document.querySelector(".swipe-popup-title");
    const popupBrand = document.getElementById("swipePopupBrand");
    const popupDesc = document.getElementById("swipePopupDesc");
    const detailsContainer = document.querySelector(".swipe-popup-details");

    if (popupImage) popupImage.src = product.image;
    if (popupTitle) popupTitle.textContent = product.title;
    if (popupBrand) popupBrand.textContent = product.brand || "Unknown Brand";
    if (popupDesc) popupDesc.textContent = product.description;

    if (detailsContainer) {
        detailsContainer.innerHTML = `
        <div class="swipe-detail-row">
            <span class="swipe-detail-label">Colour:</span>
            <div class="swipe-detail-values">
                ${product.colors?.map(c =>
            `<span class="swipe-color-tag">
                        <span class="swipe-color-dot" style="background: ${c.code}${c.code === "white" || c.code === "beige" ? "; border: 1px solid #ccc" : ""}"></span>
                        ${c.name}
                    </span>`).join("") || ""}
            </div>
        </div>
        <div class="swipe-detail-row">
            <span class="swipe-detail-label">Size:</span>
            <div class="swipe-detail-values">
                ${product.size?.map(s => `<span class="swipe-text-tag">${s}</span>`).join("") || ""}
            </div>
        </div>
        <div class="swipe-detail-row">
            <span class="swipe-detail-label">Season:</span>
            <div class="swipe-detail-values">
                ${product.season?.map(s => `<span class="swipe-text-tag">${s}</span>`).join("") || ""}
            </div>
        </div>
        <div class="swipe-detail-row">
            <span class="swipe-detail-label">Material:</span>
            <div class="swipe-detail-values">
                ${product.material?.map(m => `<span class="swipe-text-tag">${m}</span>`).join("") || ""}
            </div>
        </div>
        <div class="swipe-detail-row">
            <span class="swipe-detail-label">Style:</span>
            <div class="swipe-detail-values">
                ${product.style?.map(st => `<span class="swipe-text-tag">${st}</span>`).join("") || ""}
            </div>
        </div>
    `;
    }
}

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