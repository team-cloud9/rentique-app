// ===============================
// DISCOVER MAIN FUNCTIONALITY
// ===============================

// after reload
document.addEventListener("DOMContentLoaded", () => {
    renderDiscoverList(itemProducts);   // Show every
    setupSorting();                     // set sort
    setupFilter();                      // set filter
});


// ===============================
// show in HTML
// ===============================
function renderDiscoverList(products) {
    const listContainer = document.querySelector(".list-items");
    if (!listContainer) return;

    listContainer.innerHTML = products.map((p, index) => `
    <a href="./c-itemdetail.html" class="card" data-index="${index}">
      <div class="img">
        <img src="${p.image}" alt="${p.title}" />
      </div>
      <p class="name">${p.title}</p>
      <p class="desc">${p.description}</p>
      <p class="price">$${p.price}</p>
    </a>
  `).join('');

    // localStorage に保存
    const cards = listContainer.querySelectorAll(".card");
    cards.forEach((card, i) => {
        card.addEventListener("click", () => {
            const selected = products[i];
            localStorage.setItem("selectedProduct", JSON.stringify(selected));
        });
    });
}


// ===============================
// Sort
// ===============================
function setupSorting() {
    const sortRadios = document.querySelectorAll('input[name="sort"]');
    sortRadios.forEach(radio => {
        radio.addEventListener("change", (e) => {
            const value = e.target.value;
            let sorted = [...itemProducts];
            if (value === "price-high") sorted.sort((a, b) =>
                b.price - a.price);
            else if (value === "price-low") sorted.sort((a, b) =>
                a.price - b.price);
            else sorted.sort((a, b) => a.id - b.id);
            renderDiscoverList(sorted);
        });
    });
}

// ===============================
// Filter
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

// ===============================
// size map
// ===============================
const filterSynonyms = {
    xs: "x-small",
    s: "small",
    m: "medium",
    l: "large",
    xl: "x-large",
    xxl: "xx-large",
};

// ===============================
// APPLY FILTER LOGIC
// ===============================
function applyFilters() {
    const activeButtons = document.querySelectorAll(".filter-btn.active");

    // show every if there is none
    if (activeButtons.length === 0) {
        renderDiscoverList(itemProducts);
        return;
    }


    const selectedFilters = Array.from(activeButtons).map(btn => {
        let text = btn.textContent.trim().toLowerCase();
        //
        if (filterSynonyms[text]) text = filterSynonyms[text];
        return text;
    });

    console.log("Active filters:", selectedFilters);

    // ===============================
    //  AND search
    // ===============================
    const filtered = itemProducts.filter(p => {
        // by each categories
        const matchStyle = p.style?.some(s => selectedFilters.includes(s.toLowerCase())) || false;
        const matchMaterial = p.material?.some(m => selectedFilters.includes(m.toLowerCase())) || false;
        const matchColor = p.colors?.some(c => selectedFilters.includes(c.name.toLowerCase())) || false;
        const matchSize = p.size?.some(sz => selectedFilters.includes(sz.toLowerCase())) || false;
        const matchSeason = p.season?.some(se => selectedFilters.includes(se.toLowerCase())) || false;

        // checking which one matches
        const productMatches = [];

        selectedFilters.forEach(f => {
            if (
                p.style?.some(s => s.toLowerCase() === f) ||
                p.material?.some(m => m.toLowerCase() === f) ||
                p.colors?.some(c => c.name.toLowerCase() === f) ||
                p.size?.some(sz => sz.toLowerCase() === f) ||
                p.season?.some(se => se.toLowerCase() === f)
            ) {
                productMatches.push(f);
            }
        });

        // show only every filter matched
        return productMatches.length === selectedFilters.length;
    });

    console.log("Filtered (AND) results:", filtered);
    renderDiscoverList(filtered);
}

// ===============================
// Sort Dropdown Open / Close
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    const sortButton = document.querySelector(".sort-btn");
    const dropdownMenu = document.querySelector(".dropdown-menu");

    if (sortButton && dropdownMenu) {
        sortButton.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle("show");
        });

        // close clicking outside
        document.addEventListener("click", (event) => {
            if (!event.target.closest(".dropdown")) {
                dropdownMenu.classList.remove("show");
            }
        });
    }
});
