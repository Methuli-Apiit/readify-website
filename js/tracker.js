document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("trackerForm");
  const totalInput = document.getElementById("totalPages");
  const readInput  = document.getElementById("pagesRead");
  const speedInput = document.getElementById("speed");

  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");
  const finishText   = document.getElementById("finishText");
  const finishDateText = document.getElementById("finishDateText");
  const summaryText = document.getElementById("summaryText");


  // If something is missing, show it clearly (no silent fail)
  const missing = [];
  if (!form) missing.push("trackerForm");
  if (!totalInput) missing.push("totalPages");
  if (!readInput) missing.push("pagesRead");
  if (!speedInput) missing.push("speed");
  if (!progressFill) missing.push("progressFill");
  if (!progressText) missing.push("progressText");
  if (!finishText) missing.push("finishText");

  if (missing.length) {
    console.error("Missing IDs in tracker.html:", missing.join(", "));
    alert("Fix tracker.html. Missing IDs: " + missing.join(", "));
    return;
  }

  function updateUI(total, read, speed) {
    const percent = Math.min((read / total) * 100, 100);
    progressFill.style.width = percent.toFixed(1) + "%";
    progressText.textContent = `Progress: ${percent.toFixed(1)}%`;

    const remaining = total - read;
    const days = Math.ceil(remaining / speed);
    finishText.textContent = `Estimated days to finish: ${days}`;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const total = Number(totalInput.value);
    const read  = Number(readInput.value);
    const speed = Number(speedInput.value);

    if (total <= 0) return alert("Total pages must be greater than 0.");
    if (read < 0 || read > total) return alert("Pages read must be between 0 and total pages.");
    if (speed <= 0) return alert("Pages per day must be greater than 0.");

    // Save (works with or without utils.js)
    try {
      if (typeof saveToLocal === "function") saveToLocal("readify_progress", { total, read, speed });
      else localStorage.setItem("readify_progress", JSON.stringify({ total, read, speed }));
    } catch (err) {
      console.error("Save failed:", err);
    }

    updateUI(total, read, speed);
  });

  // Load saved
  try {
    let saved = null;
    if (typeof loadFromLocal === "function") saved = loadFromLocal("readify_progress", null);
    else {
      const raw = localStorage.getItem("readify_progress");
      saved = raw ? JSON.parse(raw) : null;
    }

    if (saved) {
      totalInput.value = saved.total;
      readInput.value = saved.read;
      speedInput.value = saved.speed;
      updateUI(saved.total, saved.read, saved.speed);
    }
  } catch (err) {
    console.error("Load failed:", err);
  }
});
