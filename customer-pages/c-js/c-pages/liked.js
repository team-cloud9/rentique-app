// ============================
// LIKED PAGE MAIN SCRIPT
// ============================

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ liked.js loaded");

  const listContainer = document.querySelector(".list-items");
  if (!listContainer) {
    console.error("❌ .list-items not found");
    return;
  }

  if (typeof itemProducts === "undefined") {
    console.error("❌ itemProducts not defined. Check ProductData.js path!");
    return;
  }

  const likedItems = JSON.parse(localStorage.getItem("likedItems")) || [];
  console.log("💾 Loaded liked items:", likedItems);

  const itemsToShow =
    likedItems.length > 0 ? likedItems : itemProducts.slice(0, 4);

  listContainer.innerHTML = itemsToShow
    .map(
      (product, index) => `
      <a href="../c-itemdetail.html" class="card" data-index="${index}">
        <div class="img">
          <img src="${
            Array.isArray(product.image) ? product.image[0] : product.image
          }" alt="${product.title}" />
        </div>
        <p class="name">${product.title}</p>
        <p class="desc">${product.description}</p>
        <p class="price">$${product.price}</p>
      </a>
    `
    )
    .join("");

  const cards = listContainer.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const index = card.dataset.index;
      const selectedProduct = itemsToShow[index];
      if (!selectedProduct) return;
      localStorage.setItem("selectedProduct", JSON.stringify(selectedProduct));
      console.log("👜 Selected product:", selectedProduct.title);
    });
  });
});
