import { firestore } from './firebase-init.js';
import {
  doc,
  getDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// toggle only clicked
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.detail-section.selectable .tag-btn');
  if (!btn) return;

  const group = btn.closest('.tag-group');
  // remove others 
  group.querySelectorAll('.tag-btn').forEach(b => {
    if (b !== btn) b.classList.remove('active');
  });
  // click and active/remove
  btn.classList.toggle('active');
});

// Toggle dropdown open/close
function toggleDropdown(el) {
  if (window.innerWidth <= 768) {
    el.closest('.detail-section').classList.toggle('show');
  }
}

// Set initial dropdown state on page load and window resize
function setDropdownState() {
  const dropdowns = document.querySelectorAll('.detail-section[data-dropdown]');
  if (window.innerWidth > 768) {
    // Desktop: all sections are expanded (show)
    dropdowns.forEach(s => s.classList.add('show'));
  } else {
    // Mobile: all sections are collapsed (hidden)
    dropdowns.forEach(s => s.classList.remove('show'));
  }
}

// Initialize dropdown state
setDropdownState();

// Recheck state when resizing the window
window.addEventListener('resize', setDropdownState);
