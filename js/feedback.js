document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("feedbackForm");
  const status = document.getElementById("fbStatus");

  const nameEl = document.getElementById("fbName");
  const emailEl = document.getElementById("fbEmail");
  const typeEl = document.getElementById("fbType");
  const msgEl = document.getElementById("fbMsg");

  // ✅ define lastEl ONCE (top-level)
  const lastEl = document.getElementById("lastFeedback");

  // ----- storage helpers (use utils.js) -----
  function getFeedbackList() {
    return loadFromLocal("readify_feedback", []);
  }
  function saveFeedbackList(list) {
    saveToLocal("readify_feedback", list);
  }

  // ✅ show last saved feedback on page load
  function showLastFeedback() {
    const list = getFeedbackList();
    if (!lastEl) return;

    if (list.length === 0) {
      lastEl.textContent = "No feedback saved yet.";
    } else {
      const latest = list[0];
      lastEl.textContent = `${latest.type.toUpperCase()}: ${latest.msg}`;
    }
  }

  showLastFeedback();

  // ----- form submit -----
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameEl.value.trim();
    const email = emailEl.value.trim().toLowerCase();
    const type = typeEl.value;
    const msg = msgEl.value.trim();

    if (name.length < 2) return alert("Please enter a valid name.");
    if (!email.includes("@") || !email.includes(".")) return alert("Please enter a valid email.");
    if (!type) return alert("Please select a feedback type.");
    if (msg.length < 10) return alert("Please write at least 10 characters.");

    const feedback = {
      name,
      email,
      type,
      msg,
      createdAt: new Date().toISOString()
    };

    const list = getFeedbackList();
    list.unshift(feedback);
    saveFeedbackList(list);

    status.textContent = "Thanks! Your feedback was saved locally ✅";
    showLastFeedback(); // ✅ updates last feedback immediately
    form.reset();
  });

  // ----- FAQ accordion (only toggles answers) -----
  document.querySelectorAll(".faq-q").forEach((btn) => {
    btn.addEventListener("click", () => {
      const answer = btn.nextElementSibling;
      if (answer) answer.classList.toggle("open");
    });
  });
});
