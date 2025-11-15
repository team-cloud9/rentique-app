// ===============================
// RENTIQUE DISCOVER PAGE - FIRESTORE CONNECTED (REALTIME VERSION)
// ===============================

import { auth, firestore as db } from "../../c-js/services/firebase-init.js";
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    doc,
    getDoc,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

let swipeProducts = [];
let itemProducts = [];
let currentProductIndex = 0;

// ============================
// Load current customer location
// ============================
let currentUserLocation = null;

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

function loadCurrentUserLocation() {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
            if (!user) {
                console.warn("⚠️ No authenticated user found");
                resolve(null);
                return;
            }

            try {
                const userDoc = await getDoc(doc(db, "customers", user.uid));
                if (userDoc.exists()) {
                    currentUserLocation = userDoc.data().location?.geopoint || null;
                    console.log("📍 Current user location:", currentUserLocation);
                } else {
                    console.warn("⚠️ No customer document found for:", user.uid);
                }
            } catch (err) {
                console.error("❌ Failed to load user location:", err);
            }

            resolve(currentUserLocation);
        });
    });
}


// ============================
// Calculate distance between two points 
// ============================
function calculateDistanceKm(point1, point2) {
    if (!point1 || !point2) return Infinity;
    const R = 6371; 
    const dLat = (point2.latitude - point1.latitude) * (Math.PI / 180);
    const dLon = (point2.longitude - point1.longitude) * (Math.PI / 180);
    const lat1 = point1.latitude * (Math.PI / 180);
    const lat2 = point2.latitude * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// ============================
// Load Products (Realtime from Firestore)
// ============================
function loadProductsRealtime() {
    const productsRef = collection(db, "products");
    const q = query(productsRef, orderBy("createdAt", "desc"));

    onSnapshot(
        q,
        async (snapshot) => {
            if (snapshot.empty) {
                document.querySelector(".list-items").innerHTML = "<p>No products found.</p>";
                return;
            }

            const rawProducts = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Extract Business location and integrate
            const enriched = await Promise.all(
                rawProducts.map(async (p) => {
                    if (!p.businessID) {
                        // p.businessId = "0nIlC6MGqPpaEveULfKM"; // Check taking Business ID or not
                    }
                    if (p.businessID) {
                        try {
                            const bizSnap = await getDoc(doc(db, "businesses", p.businessID));
                            if (bizSnap.exists()) {
                                const bizData = bizSnap.data();
                                p.businessLocation = bizData.location || null;
                                p.businessName = p.businessName || bizData.businessName;

                                // Debug Log
                                console.log(
                                    "📦",
                                    p.itemName,
                                    "→ BusinessID:",
                                    p.businessID,
                                    "→ BizGeo:",
                                    bizData.location?.geopoint
                                );
                            } else {
                                console.warn("❌ Business not found for:", p.businessID);
                            }
                        } catch (err) {
                            console.warn("⚠️ Failed to load business info for:", p.businessID, err);
                        }
                    } else {
                        console.warn("🚫 No businessId in product:", p.itemName);
                    }
                    return p;
                })
            );

            swipeProducts = enriched.map((p) => ({
                id: p.id,
                title: p.itemName || "Untitled Item",
                brand: p.businessName || "Unknown Brand",
                description: p.description || "",
                image:
                    p.images && p.images.length > 0
                        ? p.images[0]
                        : "../assets/img/no-image.png",
                colors: (p.colors || []).map((c) => ({ name: c, code: c.toLowerCase() })),
                size: p.sizes || [],
                season: p.season || [],
                material: p.material || [],
                style: p.styles || [],
                price: parseFloat(p.price) || 0,
                businessLocation: p.businessLocation || null, 
            }));

            itemProducts = [...swipeProducts];
            console.log("✅ Discover Products loaded (with business location):", itemProducts.length);

            function setupDropdownToggle() {
                const dropdownBtn = document.querySelector(".dropdown-btn");
                const dropdownMenu = document.querySelector(".dropdown-menu");

                if (dropdownBtn && dropdownMenu) {
                    dropdownBtn.addEventListener("click", (e) => {
                        e.stopPropagation();
                        dropdownMenu.classList.toggle("show");
                    });

                    // Close menu when clicking outside
                    document.addEventListener("click", (e) => {
                        if (!dropdownMenu.contains(e.target) && !dropdownBtn.contains(e.target)) {
                            dropdownMenu.classList.remove("show");
                        }
                    });
                }
            }

            renderSwipeItems();
            renderDiscoverList(itemProducts);
            setupSorting();
            setupFilter();
            setupDropdownToggle();
        },
        (error) => {
            console.error("❌ Error loading products:", error);
        }
    );
}

// ============================
// Render Swipe Items
// ============================
function renderSwipeItems() {
    const swipeItems = document.querySelector(".swipe-items");
    if (!swipeItems || swipeProducts.length === 0) return;

    swipeItems.innerHTML = swipeProducts
        .map(
            (product, index) =>
                `<img class="item" src="${product.image}" alt="${product.title}" data-index="${index}" />`
        )
        .join("");

    setupSwipeActions();
}

// ===============================
// Render Discover List
// ===============================
function renderDiscoverList(products) {
    const listContainer = document.querySelector(".list-items");
    if (!listContainer) return;

    if (!products || products.length === 0) {
        listContainer.innerHTML = "<p>No products match your filters.</p>";
        return;
    }

    listContainer.innerHTML = products
        .map(
            (p, index) => `
      <a href="./c-itemdetail.html" class="card" data-index="${index}">
          <div class="img"><img src="${p.image}" alt="${p.title}" /></div>
          <p class="name">${p.title}</p>
          <p class="desc">${p.description}</p>
          <p class="price">$${p.price.toFixed(2)}</p>
      </a>`
        )
        .join("");

    const cards = listContainer.querySelectorAll(".card");
    cards.forEach((card, i) => {
        card.addEventListener("click", () => {
            const selected = products[i];
            localStorage.setItem("selectedProduct", JSON.stringify(selected));
        });
    });
}

// ============================
// Swipe Actions
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
// SORT FUNCTIONALITY
// ===============================
function setupSorting() {
    const sortRadios = document.querySelectorAll('input[name="sort"]');
    sortRadios.forEach((radio) => {
        radio.addEventListener("change", (e) => {
            const value = e.target.value;
            let sorted = [...itemProducts];
            if (value === "price-high") sorted.sort((a, b) => b.price - a.price);
            else if (value === "price-low") sorted.sort((a, b) => a.price - b.price);
            else sorted.sort((a, b) => a.title.localeCompare(b.title));
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

function applyFilters() {
    console.log("🧭 currentUserLocation:", currentUserLocation);
    console.log("📶 Distance slider value:", document.getElementById("distanceRange").value);

    const activeButtons = document.querySelectorAll(".filter-btn.active");
    const distanceValue = parseInt(document.getElementById("distanceRange").value, 10);
    const priceValue = parseInt(document.getElementById("priceRange").value, 10);
    console.log("🚗 Distance filter:", distanceValue, "km");
    console.log("💰 Price filter:", priceValue, "max");

    if (activeButtons.length === 0 && distanceValue === 0 && priceValue === 0) {
        renderDiscoverList(itemProducts);
        return;
    }

    const selectedFilters = Array.from(activeButtons).map((btn) =>
        btn.textContent.trim().toLowerCase()
    );

    // Apply filter
    let filtered = itemProducts.filter((p) => {
        const matchesCategory =
            selectedFilters.length === 0 ||
            selectedFilters.every((f) =>
                p.style?.some((s) => s.toLowerCase() === f) ||
                p.material?.some((m) => m.toLowerCase() === f) ||
                p.colors?.some((c) => c.name.toLowerCase() === f) ||
                p.size?.some((sz) => sz.toLowerCase() === f) ||
                p.season?.some((se) => se.toLowerCase() === f)
            );

        // Price Range filter
        const matchesPrice = p.price <= priceValue || priceValue === 0;

        return matchesCategory && matchesPrice;
    });

    // Distance Filter
    if (currentUserLocation && distanceValue > 0) {
        filtered = filtered.filter((p) => {
            const bizGeo = p.businessLocation?.geopoint;
            if (!bizGeo) return true;

            const lat = bizGeo.latitude ?? bizGeo._lat;
            const lng = bizGeo.longitude ?? bizGeo._long;

            const dist = calculateDistanceKm(
                {
                    latitude: currentUserLocation.latitude,
                    longitude: currentUserLocation.longitude,
                },
                {
                    latitude: lat,
                    longitude: lng,
                }
            );

            // Debug
            console.log(`📏 ${p.title} → ${dist.toFixed(2)} km`);

            return dist <= distanceValue; 
        });
    }


    renderDiscoverList(filtered);
}

// ============================
// Swipe Popup
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
        ${(product.season || []).map(s => `<span class="swipe-text-tag">${s}</span>`).join("")}
      </div>
    </div>
    <div class="swipe-detail-row">
      <span class="swipe-detail-label">Material:</span>
      <div class="swipe-detail-values">
        ${(product.material || []).map(m => `<span class="swipe-text-tag">${m}</span>`).join("")}
      </div>
    </div>
    <div class="swipe-detail-row">
      <span class="swipe-detail-label">Style:</span>
      <div class="swipe-detail-values">
        ${(product.style || []).map(st => `<span class="swipe-text-tag">${st}</span>`).join("")}
      </div>
    </div>
    <div class="swipe-detail-row">
      <span class="swipe-detail-label">Colour:</span>
      <div class="swipe-detail-values">
        ${(product.colors || []).map(color => `
          <span class="swipe-color-tag">
            <span class="swipe-color-dot"
              style="background:${color.code}${color.code === "white" || color.code === "beige" ? "; border: 1px solid #ccc" : ""}"></span>
            ${color.name}
          </span>`).join("")}
      </div>
    </div>
    <div class="swipe-detail-row">
      <span class="swipe-detail-label">Size:</span>
      <div class="swipe-detail-values">
        ${(product.size || []).map(s => `<span class="swipe-text-tag">${s}</span>`).join("")}
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

// ============================
// Initialize
// ============================
document.addEventListener("DOMContentLoaded", async () => {
    await loadCurrentUserLocation();
    loadProductsRealtime();

    const popup = document.getElementById("swipePopup");
    const closeBtn = document.getElementById("closePopup") || document.getElementById("closeFilterPopup");
    const passBtn = document.querySelector(".swipe-btn-pass");
    const likeBtn = document.querySelector(".swipe-btn-like");

    if (closeBtn) closeBtn.addEventListener("click", hideSwipePopup);
    if (popup) {
        popup.addEventListener("click", (e) => {
            if (e.target === popup) hideSwipePopup();
        });
    }

    function saveSwipeHistory(key, product) {
        const existing = JSON.parse(localStorage.getItem(key)) || [];
        if (!existing.some((item) => item.id === product.id)) {
            existing.push(product);
            localStorage.setItem(key, JSON.stringify(existing));
        }
    }

    if (passBtn) {
        passBtn.addEventListener("click", () => {
            const currentProduct = swipeProducts[currentProductIndex];
            saveSwipeHistory("passedItems", currentProduct);
            currentProductIndex = (currentProductIndex + 1) % swipeProducts.length;
            renderSwipePopup(swipeProducts[currentProductIndex]);
        });
    }

    if (likeBtn) {
        likeBtn.addEventListener("click", () => {
            const currentProduct = swipeProducts[currentProductIndex];
            saveSwipeHistory("likedItems", currentProduct);
            currentProductIndex = (currentProductIndex + 1) % swipeProducts.length;
            renderSwipePopup(swipeProducts[currentProductIndex]);
        });
    }
});