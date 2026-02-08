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
document.addEventListener("DOMContentLoaded", () => {
  // ---------- Session tracking (your existing feature) ----------
  const startBtn = document.getElementById("startSessionBtn");
  const completeBtn = document.getElementById("completeSessionBtn");
  const statusText = document.getElementById("sessionStatus");
  const countEl = document.getElementById("sessionCount");

  let isActive = false;
  let count = loadFromLocal("readify_completed_sessions", 0);
  countEl.textContent = count;

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
    saveToLocal("readify_completed_sessions", count);
    countEl.textContent = count;
    statusText.textContent = "Session completed 🎉";
  });

  // ---------- Cozy sounds (Web Audio API, no files needed) ----------
  const toggleBtn = document.getElementById("soundToggleBtn");
  const typeEl = document.getElementById("soundType");
  const volEl = document.getElementById("soundVolume");
  const msgEl = document.getElementById("soundMsg");

  let audioCtx = null;
  let sourceNode = null;
  let gainNode = null;
  let isSoundOn = loadFromLocal("readify_sound_on", false);
  let soundType = loadFromLocal("readify_sound_type", "rain");
  let volume = loadFromLocal("readify_sound_volume", 25);

  typeEl.value = soundType;
  volEl.value = volume;

  function updateToggleText() {
    toggleBtn.textContent = isSoundOn ? "🔊 Sound: ON" : "🔇 Sound: OFF";
  }

  function ensureAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      gainNode = audioCtx.createGain();
      gainNode.connect(audioCtx.destination);
    }
  }

  // Create “noise” buffer
  function createNoiseBuffer(ctx) {
    const bufferSize = ctx.sampleRate * 2; // 2 seconds
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  }

  // Different cozy sounds using filters
  function buildSound(type) {
    ensureAudio();

    const noise = audioCtx.createBufferSource();
    noise.buffer = createNoiseBuffer(audioCtx);
    noise.loop = true;

    // Filters to shape the sound
    const filter = audioCtx.createBiquadFilter();

    if (type === "rain") {
      filter.type = "highpass";
      filter.frequency.value = 700; // airy rain
    } else if (type === "fire") {
      filter.type = "lowpass";
      filter.frequency.value = 250; // warm crackle vibe
    } else {
      // white noise (no heavy filtering)
      filter.type = "allpass";
    }

    noise.connect(filter);
    filter.connect(gainNode);

    return noise;
  }

  function applyVolume() {
    if (!gainNode) return;
    const v = Number(volEl.value) / 100;
    gainNode.gain.value = v;
  }

  function startSound() {
    ensureAudio();
    applyVolume();

    // Safari/Chrome sometimes need resume on user action
    if (audioCtx.state === "suspended") audioCtx.resume();

    stopSound(); // stop previous if any
    sourceNode = buildSound(typeEl.value);
    sourceNode.start();

    isSoundOn = true;
    saveToLocal("readify_sound_on", true);
    msgEl.textContent = `Playing: ${typeEl.value}`;
    updateToggleText();
  }

  function stopSound() {
    if (sourceNode) {
      try { sourceNode.stop(); } catch (e) {}
      sourceNode.disconnect();
      sourceNode = null;
    }
    isSoundOn = false;
    saveToLocal("readify_sound_on", false);
    updateToggleText();
  }

  // UI events
  toggleBtn.addEventListener("click", () => {
    if (isSoundOn) stopSound();
    else startSound();
  });

  typeEl.addEventListener("change", () => {
    saveToLocal("readify_sound_type", typeEl.value);
    if (isSoundOn) startSound(); // restart with new sound
  });

  volEl.addEventListener("input", () => {
    saveToLocal("readify_sound_volume", Number(volEl.value));
    applyVolume();
  });

  // Restore last state
  updateToggleText();
  if (isSoundOn) {
    // Start after page loads (still requires user gesture in some browsers)
    msgEl.textContent = "Click the Sound button to start audio (browser policy).";
    stopSound();
  }
});

