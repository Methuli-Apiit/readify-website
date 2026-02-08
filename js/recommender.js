document.addEventListener("DOMContentLoaded", () => {
  const books = [
    { id: 1, title: "The Rainy Library", author: "M. Senali", genre: "fantasy", pages: 240,
      synopsis: "A quiet library appears only on rainy nights, offering books that reveal hidden courage." },
    { id: 2, title: "Midnight Metro", author: "K. Aravinda", genre: "mystery", pages: 190,
      synopsis: "A missing journal, a late train, and clues hidden in station announcements." },
    { id: 3, title: "Orbit Notes", author: "N. Jayath", genre: "sci-fi", pages: 320,
      synopsis: "A student finds a notebook that predicts satellite failures before they happen." },
    { id: 4, title: "Study Sprint", author: "R. Tharindu", genre: "self-help", pages: 160,
      synopsis: "Simple routines for staying consistent without burnout, made for students." },
    { id: 5, title: "Lantern Alley", author: "S. Perera", genre: "mystery", pages: 260,
      synopsis: "A student follows clues hidden in old streetlamp numbers across the city." },
    { id: 6, title: "Skyseed Protocol", author: "I. Fernando", genre: "sci-fi", pages: 180,
      synopsis: "A tiny satellite sends messages that don’t match any known signal pattern." },
    { id: 7, title: "The Mango Grove Map", author: "H. Jayasinghe", genre: "fantasy", pages: 170,
      synopsis: "A hand-drawn map leads to a grove that changes location every sunrise." },
    { id: 8, title: "Focus in 15", author: "N. Wickrama", genre: "self-help", pages: 220,
      synopsis: "A simple routine to build study consistency using short daily sessions." }

  ];

  const genreEl = document.getElementById("recGenre");
  const lengthEl = document.getElementById("recLength");
  const pickBtn = document.getElementById("pickBtn");
  const againBtn = document.getElementById("againBtn");

  const card = document.getElementById("recCard");
  const titleEl = document.getElementById("recTitle");
  const authorEl = document.getElementById("recAuthor");
  const metaEl = document.getElementById("recMeta");
  const synEl = document.getElementById("recSynopsis");

  const saveBtn = document.getElementById("saveRecBtn");
  const msgEl = document.getElementById("recMsg");

  let current = null;

  function matchesLength(pages, length) {
    if (length === "short") return pages < 200;
    if (length === "medium") return pages >= 200 && pages <= 350;
    if (length === "long") return pages > 350;
    return true; // "all"
  }

  function pickRandom(list) {
     if (list.length === 1) return list[0];

  let chosen;
  do {
    const idx = Math.floor(Math.random() * list.length);
    chosen = list[idx];
  } while (current && chosen.id === current.id);

  return chosen;
} 
    

  function showBook(book) {
    current = book;
    if (msgEl) msgEl.textContent = "";

    titleEl.textContent = book.title;
    authorEl.textContent = `by ${book.author}`;
    metaEl.textContent = `${book.genre} • ${book.pages} pages`;
    synEl.textContent = book.synopsis;

    card.classList.remove("hidden-card");
    card.classList.remove("pop");
    void card.offsetWidth; // restart animation
    card.classList.add("pop");
  }
   function applyAndPick() {
  const g = genreEl.value;
  const len = lengthEl.value;

  const filtered = books.filter(b =>
    (g === "all" || b.genre === g) && matchesLength(b.pages, len)
  );
 
   if (filtered.length === 1 && current && current.id === filtered[0].id) {
    msgEl.textContent = "Only one book matches these filters. Try different filters 🙂";
    return;
  }

  if (filtered.length === 0) {
    card.classList.remove("hidden-card");
    titleEl.textContent = "No match found";
    authorEl.textContent = "";
    metaEl.textContent = "";
    synEl.textContent = "Try a different genre or length.";
    current = null;
    return;
  }

  showBook(pickRandom(filtered));
}

  pickBtn.addEventListener("click", applyAndPick);
  againBtn.addEventListener("click", applyAndPick);

  saveBtn.addEventListener("click", () => {
    if (!current) return;

    const list = loadFromLocal("readify_reading_list", []);
    const exists = list.some(item => item.id === current.id);

    if (exists) {
      msgEl.textContent = "Already in your Reading List ✅";
      return;
    }

    list.push({ id: current.id, title: current.title, author: current.author, genre: current.genre });
    saveToLocal("readify_reading_list", list);

    msgEl.textContent = "Saved to Reading List ✅";
  });
});
