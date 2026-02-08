document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startSessionBtn");
  const completeBtn = document.getElementById("completeSessionBtn");
  const statusText = document.getElementById("sessionStatus");
  const countEl = document.getElementById("sessionCount");

  const missing = [];
  if (!startBtn) missing.push("startSessionBtn");
  if (!completeBtn) missing.push("completeSessionBtn");
  if (!statusText) missing.push("sessionStatus");
  if (!countEl) missing.push("sessionCount");

  if (missing.length) {
    alert("Missing IDs in flow.html: " + missing.join(", "));
    return;
  }

  // localStorage helpers (works even if utils.js fails)
  const loadLocal = (key, fallback) => {
    if (typeof loadFromLocal === "function") return loadFromLocal(key, fallback);
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  };

  const saveLocal = (key, value) => {
    if (typeof saveToLocal === "function") return saveToLocal(key, value);
    localStorage.setItem(key, JSON.stringify(value));
  };

  let isActive = false;
  let count = loadLocal("readify_completed_sessions", 0);

  countEl.textContent = count;
  statusText.textContent = "No active reading session.";

  startBtn.addEventListener("click", () => {
    isActive = true;
    statusText.textContent = "Reading session in progress…";
  });

  completeBtn.addEventListener("click", () => {
    if (!isActive) {
      statusText.textContent = "Start a session first.";
      return;
    }

    isActive = false;
    count++;
    saveLocal("readify_completed_sessions", count);
    countEl.textContent = count;
    statusText.textContent = "Session completed 🎉";
  });
});
