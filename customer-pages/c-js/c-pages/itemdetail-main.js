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
    console.warn("No product data found in localStorage");
    return;
  }

  const product = JSON.parse(productData);

  //
  document.querySelector(".item-name").textContent = product.title;
  document.querySelector(".item-price").textContent = `$${product.price}`;
  document.querySelector(".item-description").textContent = product.description;

  // Image
  const imageContainer = document.querySelector(".detail-images");
  imageContainer.innerHTML = `
    <div class="image-placeholder">
      <img src="${product.image}" alt="${product.title}" />
    </div>
  `;

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
});
