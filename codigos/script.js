// ===== LOGIN SIMPLES =====
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    const error = document.getElementById("loginError");

    if (user === "admin" && pass === "1234") {
      localStorage.setItem("loggedIn", "true");
      window.location.href = "dashboard.html";
    } else {
      error.textContent = "Usuário ou senha incorretos!";
      error.style.color = "red";
    }
  });
}

// ===== LOGOUT =====
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loggedIn");
    window.location.href = "index.html";
  });
}

// ===== CRUD LIVROS =====
const bookForm = document.getElementById("bookForm");
const booksTable = document.getElementById("booksTable")?.querySelector("tbody");

function loadBooks() {
  const books = JSON.parse(localStorage.getItem("books") || "[]");
  booksTable.innerHTML = "";
  books.forEach((book, index) => {
    const row = `
      <tr>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>
          <button class="action-btn" onclick="editBook(${index})">✏️</button>
          <button class="action-btn" onclick="deleteBook(${index})">🗑️</button>
        </td>
      </tr>
    `;
    booksTable.innerHTML += row;
  });
}

if (bookForm) {
  bookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("bookTitle").value;
    const author = document.getElementById("bookAuthor").value;

    const books = JSON.parse(localStorage.getItem("books") || "[]");
    books.push({ title, author });
    localStorage.setItem("books", JSON.stringify(books));
    bookForm.reset();
    loadBooks();
  });

  loadBooks();
}

function deleteBook(index) {
  const books = JSON.parse(localStorage.getItem("books") || "[]");
  books.splice(index, 1);
  localStorage.setItem("books", JSON.stringify(books));
  loadBooks();
}

function editBook(index) {
  const books = JSON.parse(localStorage.getItem("books") || "[]");
  const newTitle = prompt("Novo título:", books[index].title);
  const newAuthor = prompt("Novo autor:", books[index].author);
  if (newTitle && newAuthor) {
    books[index] = { title: newTitle, author: newAuthor };
    localStorage.setItem("books", JSON.stringify(books));
    loadBooks();
  }
}
