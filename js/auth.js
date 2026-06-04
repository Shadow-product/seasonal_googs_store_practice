import { renderHeader, renderFooter, showGreeting, updateCartIcon, updateCartCount } from "./common.js";
import { User } from "./models.js";

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();

  const loginForm = document.querySelector(".auth__form--login");
  const registerForm = document.querySelector(".auth__form--register");

  // Валидация регулярными выражениями (проверка на имя (name), почту (email) и пароль (password))
  function validateName(name) {
    return name.trim().length > 0;
  }

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validatePassword(password) {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  }

  // Переключение вкладок
  document.querySelector(".auth__tab--login").addEventListener("click", () => {
    loginForm.classList.remove("auth__form--hidden");
    registerForm.classList.add("auth__form--hidden");
    buildLoginForm();
  });

  document.querySelector(".auth__tab--register").addEventListener("click", () => {
    loginForm.classList.add("auth__form--hidden");
    registerForm.classList.remove("auth__form--hidden");
    buildRegisterForm();
  });

  // Форма входа
  function buildLoginForm() {
    loginForm.replaceChildren();

    const form = document.createElement("form");
    form.id = "login";

    const email = document.createElement("input");
    email.type = "email";
    email.placeholder = "Email:";

    const passwordWrapper = document.createElement("div");
    passwordWrapper.className = "password-wrapper";

    const password = document.createElement("input");
    password.type = "password";
    password.placeholder = "Пароль:";

    // кнопка глаз на форме входа / регистрации
    const toggleBtn = document.createElement("span");
    toggleBtn.className = "fa-solid fa-eye toggle-password";

    toggleBtn.addEventListener("click", () => {
      if (password.type === "password") {
        password.type = "text";
        toggleBtn.classList.replace("fa-eye", "fa-eye-slash");
      } else {
        password.type = "password";
        toggleBtn.classList.replace("fa-eye-slash", "fa-eye");
      }
  });

    passwordWrapper.append(password, toggleBtn);

    const submitLogin = document.createElement("button");
    submitLogin.type = "submit";
    submitLogin.className = "button button--submit";
    submitLogin.textContent = "Войти";

    form.append(email, passwordWrapper, submitLogin);
    loginForm.appendChild(form);

    form.addEventListener("submit", (event) => {
      event.preventDefault(); // отмена стандартной отправки

      if (!validateEmail(email.value)) {
        alert("Введите корректный email");
        return;
      }
      if (!validatePassword(password.value)) {
        alert("Пароль должен содержать минимум 8 символов, букву и цифру");
        return;
      }

    /* Если все проверки пройдены сохраняется пользователь */
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const found = users.find(u => u.email === email.value);

    if (found) {
      const user = new User(found.name, found.email, found.password);
      if (user.checkPassword(password.value)) {
          localStorage.setItem("currentUser", JSON.stringify(user));
          showGreeting();
          updateCartIcon();
          updateCartCount();
          alert(`Вы вошли как ${user.name}!`);
          window.location.href = "index.html";
      } else {
          alert("Неверный пароль");
      }
    } else {
      alert("Пользователь не найден");
    }
  });
}

  // Форма регистрации
  function buildRegisterForm() {
    registerForm.replaceChildren();

    const form = document.createElement("form");
    form.id = "register";

    const name = document.createElement("input");
    name.type = "text";
    name.placeholder = "Имя:";

    const email = document.createElement("input");
    email.type = "email";
    email.placeholder = "Email:";

    const passwordWrapper = document.createElement("div");
    passwordWrapper.className = "password-wrapper";

    const password = document.createElement("input");
    password.type = "password";
    password.placeholder = "Пароль:";

    const toggleBtn = document.createElement("span");
    toggleBtn.className = "fa-solid fa-eye toggle-password";

    toggleBtn.addEventListener("click", () => {
      if (password.type === "password") {
        password.type = "text";
        toggleBtn.classList.replace("fa-eye", "fa-eye-slash");
      } else {
        password.type = "password";
        toggleBtn.classList.replace("fa-eye-slash", "fa-eye");
      }
    });

    passwordWrapper.append(password, toggleBtn);

    const submitRegistration = document.createElement("button");
    submitRegistration.type = "submit";
    submitRegistration.className = "button button--registration";
    submitRegistration.textContent = "Зарегистрироваться";

    form.append(name, email, passwordWrapper, submitRegistration);
    registerForm.appendChild(form);

    form.addEventListener("submit", (e) => {
      e.preventDefault(); // Отмена стандартной отправки

      if (!validateName(name.value)) {
        alert("Введите имя");
        return;
      }
      if (!validateEmail(email.value)) {
        alert("Введите корректный email");
        return;
      }
      if (!validatePassword(password.value)) {
        alert("Пароль должен содержать минимум 8 символов, букву и цифру");
        return;
      }

      const users = JSON.parse(localStorage.getItem("users")) || [];

      // Проверка уникальности email
      if (users.some(u => u.email === email.value)) {
        alert("Пользователь с таким email уже зарегистрирован");
        return;
      }

      const user = new User(name.value, email.value, password.value);
      users.push(user);
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(user));
      alert(`Регистрация успешна. Добро пожаловать, ${user.name}!`);
      window.location.href = "index.html";
    });
  }

  // По умолчанию показываем форму входа
  buildLoginForm();
});