// import { firestore } from './firebase-init.js';
// import {
//   doc,
//   getDoc,
//   collection,
//   serverTimestamp,
//   query,
//   where,
//   getDocs
// } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// =====================
//  Item Detail Script
// =====================

// ▼ 
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.detail-section.selectable .tag-btn');
  if (!btn) return;
  const group = btn.closest('.tag-group');
  group.querySelectorAll('.tag-btn').forEach(b => {
    if (b !== btn) b.classList.remove('active');
  });
  btn.classList.toggle('active');
});

// ▼ 
function toggleDropdown(el) {
  if (window.innerWidth <= 768) {
    el.closest('.detail-section').classList.toggle('show');
  }
}

// ▼ 
function setDropdownState() {
  const dropdowns = document.querySelectorAll('.detail-section[data-dropdown]');
  if (window.innerWidth > 768) {
    dropdowns.forEach(s => s.classList.add('show'));
  } else {
    dropdowns.forEach(s => s.classList.remove('show'));
  }
}
setDropdownState();
window.addEventListener('resize', setDropdownState);

// =====================
//  Show data
// =====================
document.addEventListener("DOMContentLoaded", () => {
  const productData = localStorage.getItem("selectedProduct");
  if (!productData) {
    console.log("No product data found in localStorage");
    return;
  }

  const product = JSON.parse(productData);

  // ✅ Brand・Price・DescriptionをHTMLに反映
  document.querySelector(".item-name").textContent = product.title;
  document.querySelector(".item-brand").textContent = product.brand;
  document.querySelector(".item-price").textContent = `$${product.price}`;
  document.querySelector(".item-description").textContent = product.description;

  // ↓この下に画像処理のコードが来る
  const imageContainer = document.querySelector(".detail-images");
  const images = Array.isArray(product.image) ? product.image : [product.image];

  // 以下そのままOK
  imageContainer.innerHTML = images
    .map((img, index) => `
      <div class="image-placeholder ${index === 0 ? "" : "hidden"}">
        <img src="${img}" alt="${product.title}" />
      </div>
    `)
    .join("");

  const navButton = document.createElement("button");
  navButton.classList.add("image-nav");
  navButton.innerHTML = `<img src="../assets/icon/Icon_back.svg" alt="Next image" />`;
  imageContainer.appendChild(navButton);

  let currentIndex = 0;
  navButton.addEventListener("click", () => {
    const placeholders = imageContainer.querySelectorAll(".image-placeholder");
    placeholders[currentIndex].classList.add("hidden");
    currentIndex = (currentIndex + 1) % placeholders.length;
    placeholders[currentIndex].classList.remove("hidden");
  });

  // Color
  const colorGroup = document.querySelector(".color-group");
  colorGroup.innerHTML = product.colors.map(c => `
    <button class="tag-btn">
      <span class="color-circle" style="background-color: ${c.code}${c.code === 'white' || c.code === 'beige' ? '; border: 1px solid #ccc' : ''}"></span>
      ${c.name}
    </button>
  `).join("");

  // Size
  const sizeGroup = document.querySelector(".size-group");
  sizeGroup.innerHTML = product.size.map(s => `
    <button class="tag-btn">${s}</button>
  `).join("");

  // Size fit
  const fitGroup = document.querySelector(".fit-group");
  fitGroup.innerHTML = (product.sizefit || []).map(s => `
  <button class="tag-btn selected">${s}</button>
`).join("");


  // Season
  const seasonGroup = document.querySelector(".season-group");
  seasonGroup.innerHTML = product.season.map(s => `
    <button class="tag-btn selected">${s}</button>
  `).join("");

  // material
  const materialGroup = document.querySelector(".material-group");
  materialGroup.innerHTML = product.material.map(m => `
    <button class="tag-btn selected">${m}</button>
  `).join("");

  // texture
  const textureGroup = document.querySelector(".texture-group");
  textureGroup.innerHTML = product.texture.map(t => `
    <button class="tag-btn selected">${t}</button>
  `).join("");

  // style
  const styleGroup = document.querySelector(".style-group");
  styleGroup.innerHTML = product.style.map(st => `
    <button class="tag-btn selected">${st}</button>
  `).join("");

  console.log("image data:", product.image);
  console.log("images:", images);
});
