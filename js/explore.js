document.addEventListener("DOMContentLoaded", () => {
  // ---------- BOOK DATA ----------
  const books = [
    {
      id: 1,
      title: "The Rainy Library",
      author: "M. Senali",
      genre: "fantasy",
      synopsis: "A quiet library appears only on rainy nights, offering books that reveal hidden courage.",
      series: ["The Rainy Library", "The Lantern Shelves"],
      ratings: [
        { site: "Readers Hub", score: "4.6/5" },
        { site: "Book Circle", score: "4.4/5" }
      ]
    },
    {
      id: 2,
      title: "Midnight Metro",
      author: "K. Aravinda",
      genre: "mystery",
      synopsis: "A missing journal, a late train, and clues hidden in station announcements.",
      series: ["Midnight Metro"],
      ratings: [
        { site: "Readers Hub", score: "4.2/5" },
        { site: "Book Circle", score: "4.1/5" }
      ]
    },
    {
      id: 3,
      title: "Orbit Notes",
      author: "N. Jayath",
      genre: "sci-fi",
      synopsis: "A student finds a notebook that predicts satellite failures before they happen.",
      series: ["Orbit Notes", "Signal Horizon"],
      ratings: [
        { site: "Readers Hub", score: "4.5/5" },
        { site: "Book Circle", score: "4.3/5" }
      ]
    },
    {
      id: 4,
      title: "Study Sprint",
      author: "R. Tharindu",
      genre: "self-help",
      synopsis: "Simple routines for staying consistent without burnout, made for students.",
      series: ["Study Sprint"],
      ratings: [
        { site: "Readers Hub", score: "4.0/5" },
        { site: "Book Circle", score: "3.9/5" }
      ]
    }
  ];

  // ---------- ELEMENTS ----------
  const gridEl = document.getElementById("bookGrid");
  const searchEl = document.getElementById("searchInput");
  const genreEl = document.getElementById("genreSelect");

  // Modal
  const modal = document.getElementById("bookModal");
  const closeBtn = document.getElementById("closeModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalAuthor = document.getElementById("modalAuthor");
  const modalSynopsis = document.getElementById("modalSynopsis");
  const modalSeries = document.getElementById("modalSeries");
  const modalRatings = document.getElementById("modalRatings");

  // Save button + message in modal
  const saveBtn = document.getElementById("saveToListBtn");
  const saveMsg = document.getElementById("saveMsg");

  let currentBook = null;

  // Safety
  if (!gridEl) {
    console.error("Missing #bookGrid. Check explore.html.");
    return;
  }

  // ---------- LOCAL STORAGE ----------
  function getReadingList() {
    // uses utils.js helper if available
    if (typeof loadFromLocal === "function") {
      return loadFromLocal("readify_reading_list", []);
    }
    // fallback (in case utils.js didn't load)
    const raw = localStorage.getItem("readify_reading_list");
    return raw ? JSON.parse(raw) : [];
  }

  function setReadingList(list) {
    if (typeof saveToLocal === "function") {
      saveToLocal("readify_reading_list", list);
      return;
    }
    localStorage.setItem("readify_reading_list", JSON.stringify(list));
  }

  // ---------- MODAL ----------
  function openModal(book) {
    currentBook = book;

    // clear message each time
    if (saveMsg) saveMsg.textContent = "";

    if (!modal || !modalTitle || !modalAuthor || !modalSynopsis || !modalSeries || !modalRatings) {
      console.error("Modal elements missing or IDs wrong. Check explore.html modal section.");
      return;
    }

    modalTitle.textContent = book.title;
    modalAuthor.textContent = `by ${book.author}`;
    modalSynopsis.textContent = book.synopsis;

    modalSeries.innerHTML = "";
    book.series.forEach((s) => {
      const li = document.createElement("li");
      li.textContent = s;
      modalSeries.appendChild(li);
    });

    modalRatings.innerHTML = "";
    book.ratings.forEach((r) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${r.site}</td><td>${r.score}</td>`;
      modalRatings.appendChild(tr);
    });

    modal.classList.remove("hidden");
  }

  function closeModal() {
    if (modal) modal.classList.add("hidden");
  }

  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // ---------- SAVE TO LIST ----------
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      if (!currentBook) return;

      const list = getReadingList();
      const exists = list.some((item) => item.id === currentBook.id);

      if (exists) {
        if (saveMsg) saveMsg.textContent = "Already in your Reading List ✅";
        return;
      }

      list.push({
        id: currentBook.id,
        title: currentBook.title,
        author: currentBook.author,
        genre: currentBook.genre
      });

      setReadingList(list);
      if (saveMsg) saveMsg.textContent = "Saved to Reading List ✅";
    });
  }

  // ---------- RENDER ----------
  function renderBooks(list) {
    gridEl.innerHTML = "";

    list.forEach((b) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${b.title}</h3>
        <p class="muted">${b.author}</p>
        <p class="small-label">${b.genre}</p>
      `;

      card.addEventListener("click", () => openModal(b));
      gridEl.appendChild(card);
    });
  }

  // ---------- FILTERS ----------
  function applyFilters() {
    const q = (searchEl?.value || "").trim().toLowerCase();
    const g = genreEl?.value || "all";

    const filtered = books.filter((b) => {
      const matchesText =
        b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
      const matchesGenre = (g === "all") || (b.genre === g);
      return matchesText && matchesGenre;
    });

    renderBooks(filtered);
  }

  if (searchEl) searchEl.addEventListener("input", applyFilters);
  if (genreEl) genreEl.addEventListener("change", applyFilters);

  // first load
  renderBooks(books);
});
