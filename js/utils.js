// utils.js (shared helpers used across pages)

// Save a JS value (object/array/number/string) to localStorage
function saveToLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Load a JS value from localStorage (or return fallback if nothing saved)
function loadFromLocal(key, fallback) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
}

// Optional small helper: footer year (safe if element exists)
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
