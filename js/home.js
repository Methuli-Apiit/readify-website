// -------------------- QUOTES (auto rotate) --------------------
const quotes = [
  "Reading is a window to the world.",
  "A reader lives a thousand lives before he dies.",
  "Books are uniquely portable magic.",
  "Today a reader, tomorrow a leader."
];

let quoteIndex = 0;

function rotateQuote() {
  const quoteElement = document.getElementById("quote");
  if (!quoteElement) return;

  quoteElement.textContent = quotes[quoteIndex];
  quoteIndex = (quoteIndex + 1) % quotes.length;
}

setInterval(rotateQuote, 3000);
rotateQuote();


// -------------------- AUTHOR OF THE DAY (date-based) --------------------
const authors = [
  { name: "Arthur C. Clarke", hint: "Sci-fi + imagination (also lived in Sri Lanka)." },
  { name: "Jane Austen", hint: "Classic novels about society and relationships." },
  { name: "Agatha Christie", hint: "Famous for mystery and detectives." },
  { name: "J. R. R. Tolkien", hint: "Fantasy worlds and epic adventures." },
  { name: "George Orwell", hint: "Dystopian fiction and big ideas." },
  { name: "Mary Shelley", hint: "Early science fiction (Frankenstein)." }
];

function setAuthorOfTheDay() {
  const nameEl = document.getElementById("authorName");
  const hintEl = document.getElementById("authorHint");
  if (!nameEl || !hintEl) return;

  const today = new Date();
  const dayNumber = today.getFullYear() * 1000 + (today.getMonth() + 1) * 50 + today.getDate();
  const index = dayNumber % authors.length;

  nameEl.textContent = authors[index].name;
  hintEl.textContent = authors[index].hint;
}

setAuthorOfTheDay();


// -------------------- NEWSLETTER (localStorage) --------------------
function setupNewsletter() {
  const form = document.getElementById("newsletterForm");
  const emailInput = document.getElementById("emailInput");
  const msg = document.getElementById("newsletterMsg");

  if (!form || !emailInput || !msg) return;

  // if already subscribed, show it
  const savedEmail = loadFromLocal("readify_newsletter_email", "");
  if (savedEmail) {
    msg.textContent = `Subscribed as: ${savedEmail}`;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim().toLowerCase();

    // basic validation (beginner-friendly)
    if (!email.includes("@") || !email.includes(".")) {
      msg.textContent = "Please enter a valid email address.";
      return;
    }

    saveToLocal("readify_newsletter_email", email);
    msg.textContent = `Thanks! Subscribed as: ${email}`;
    form.reset();
  });
}

setupNewsletter();

