import { renderHeader, renderFooter, showGreeting, updateCartIcon, updateCartCount } from "./common.js";

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();

  const loginForm = document.querySelector(".auth__form--login");
  const registerForm = document.querySelector(".auth__form--register");

  // Переключение вкладок
  document.querySelector(".auth__tab--login").addEventListener("click", () => {
    loginForm.classList.remove("auth__form--hidden"); // показать вход
    registerForm.classList.add("auth__form--hidden"); // скрыть регистрацию
    buildLoginForm();
  });

  document.querySelector(".auth__tab--register").addEventListener("click", () => {
    loginForm.classList.add("auth__form--hidden");        // скрыть вход
    registerForm.classList.remove("auth__form--hidden");  // показать регистрацию
    buildRegisterForm();
  });

  // Форма входа
  function buildLoginForm() {
    /* Удаляет все существующие дочерние элементы у выбранного узла.
    Добавляет новые узлы, которые ты передаются в аргументах.
    Работает сразу и как «очистка», и как «добавление». */
    loginForm.replaceChildren(); 

    const form = document.createElement("form");
    form.id = "login";

    const email = document.createElement("input");
    email.type = "email";
    email.placeholder = "Email:";

    const password = document.createElement("input");
    password.type = "password";
    password.placeholder = "Пароль:";

    const submitLogin = document.createElement("button");
    submitLogin.type = "submit";
    submitLogin.className = "button button--submit"
    submitLogin.textContent = "Войти";

    form.append(email, password, submitLogin);
    loginForm.appendChild(form);

    form.addEventListener("submit", (event) => {
      event.preventDefault(); // отмена стандартной отправки

      const users = JSON.parse(localStorage.getItem("users")) || [];
      const found = users.find(u => u.email === email.value && u.password === password.value);

      if (found) {
        localStorage.setItem("currentUser", JSON.stringify(found));
        showGreeting();
        updateCartIcon();
        updateCartCount();
        alert(`Вы вошли как ${found.name}!`);
        window.location.href = "index.html";
      } else {
        alert("Неверный email или пароль");
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

    const password = document.createElement("input");
    password.type = "password";
    password.placeholder = "Пароль:";

    const submit = document.createElement("button");
    submit.type = "submit";
    submit.className = "button button--registration"
    submit.textContent = "Зарегистрироваться";

    form.append(name, email, password, submit);
    registerForm.appendChild(form);

    form.addEventListener("submit", (e) => {
      e.preventDefault(); // отмена стандартной отправки

      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = {
        name: name.value,
        email: email.value,
        password: password.value
      };

      users.push(user);
      localStorage.setItem("users", JSON.stringify(users)); // общие пользователи
      localStorage.setItem("currentUser", JSON.stringify(user)); // текущий пользователь
      alert(`Регистрация успешна. Добро пожаловать, ${user.name}!`);
      window.location.href = "index.html";
    });
  }

  // По умолчанию показываем форму входа
  buildLoginForm();
});