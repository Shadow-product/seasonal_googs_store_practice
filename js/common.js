// Работа с пользователем 
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

function setCurrentUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

function logoutUser() {
  localStorage.removeItem("currentUser");
}

//  Шапка интернет-магазина
export function renderHeader() {
  const header = document.getElementById("header");
  if (!header) return;

  const logo = document.createElement("div");
  logo.className = "header__logo";
  const linkLogo = document.createElement("a");
  linkLogo.href = "index.html";
  linkLogo.textContent = "🌤 Seasonal Goods Store";
  logo.appendChild(linkLogo);

  const nav = document.createElement("nav");
  nav.className = "header__nav";

  const linkMain = document.createElement("a");
  linkMain.href = "index.html";
  linkMain.textContent = "Главная";

  const linkCatalog = document.createElement("a");
  linkCatalog.href = "product.html";
  linkCatalog.textContent = "Товары";

  const linkCart = document.createElement("a");
  linkCart.href = "cart.html";
  linkCart.textContent = "Корзина";

  // контейнер для приветствия/авторизации
  const greetingContainer = document.createElement("div");
  greetingContainer.id = "greeting";

  nav.append(linkMain, linkCatalog, linkCart, greetingContainer);

  const hamburger = document.createElement("button");
  hamburger.id = "hamburger-menu";
  hamburger.className = "hamburger-menu";
  hamburger.textContent = "☰";

  header.replaceChildren(logo, hamburger, nav);

    hamburger.addEventListener('click', () => {
      nav.classList.toggle('active');
    });

    showGreeting();
  }

export function showGreeting() {
  const user = getCurrentUser();
  const greetingEl = document.getElementById("greeting");
  if (!greetingEl) return;

  greetingEl.replaceChildren(); // очистка

  const userBlock = document.createElement("div");
  userBlock.className = "header__user";

  if (user) {
    const greeting = document.createElement("span");
    greeting.className = "header__greeting";
    greeting.textContent = `Привет, ${user.name || user.email}`;

    const logoutBtn = document.createElement("button");
    logoutBtn.id = "logout-btn";
    logoutBtn.className = "button button--logout";
    logoutBtn.textContent = "Выйти";

    logoutBtn.addEventListener("click", () => {
      logoutUser();
      window.location.href = "auth.html";
    });

    userBlock.append(greeting, logoutBtn);
    greetingEl.append(userBlock);
  } else {
    const linkAuth = document.createElement("a");
    linkAuth.href = "auth.html";
    linkAuth.textContent = "Вход / регистрация";
    greetingEl.append(linkAuth);
  }
}

export function updateCartIcon() {
  const cartIconEl = document.getElementById("cart-icon");
  if (!cartIconEl) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartIconEl.textContent = `(${totalItems})`;
}

export function updateCartCount() {
  const cartCountEl = document.getElementById("cart-count");
  if (!cartCountEl) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountEl.textContent = totalItems;
}

// Подвал интернет-магазина
export function renderFooter() {
  const footer = document.getElementById("footer");
  if (!footer) return;

  const links = document.createElement("div");
  links.className = "footer__links";

  const linkMain = document.createElement("a");
  linkMain.href = "index.html";
  linkMain.textContent = "Главная";

  const linkCatalog = document.createElement("a");
  linkCatalog.href = "product.html";
  linkCatalog.textContent = "Товары";

  const linkCart = document.createElement("a");
  linkCart.href = "cart.html";
  linkCart.textContent = "Корзина";

  const linkAuth = document.createElement("a");
  linkAuth.href = "auth.html";
  linkAuth.textContent = "Вход / регистрация";

  links.append(linkMain, linkCatalog, linkCart, linkAuth);

  const copy = document.createElement("div");

  copy.className = "footer__copy";
  copy.textContent = "© 2026  🌤 Seasonal Goods Store";

  footer.replaceChildren(links, copy);
}

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
});