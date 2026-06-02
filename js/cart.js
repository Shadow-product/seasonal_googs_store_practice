import { Cart } from "./models.js";
import { getProductById } from "./api.js";
import { renderHeader, renderFooter, updateCartIcon, updateCartCount } from "./common.js";

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();

  const cartItemsContainer = document.getElementById("div__cart--items");

  // Обработчик на кнопку "Удалить"
  cartItemsContainer.addEventListener("click", event => {
    if (event.target.classList.contains("button--remove")) {
      const id = parseInt(event.target.dataset.id, 10);
      const cart = Cart.load(); // загружаются актуальные данные

      const item = cart.items.find(i => i.product.id === id)
      if (item) {
        console.log(`Удален товар: ${item.product.title}`);
      }

      // Удаляется 1 товар из корзины (класс Cart)
      cart.decreaseItem(id);
      updateCartIcon();
      updateCartCount();
      renderCart(); // пересчёт и перерисовка
    }
  });

  renderCart(); // первый рендер корзины
});

async function renderCart() {
  const cartItemsContainer = document.getElementById("div__cart--items");
  const cartTotalEl = document.getElementById("p__cart--total");

  // Загрузить корзину из LocalStorage
  const cart = Cart.load();
  // Очистить контейнер
  cartItemsContainer.replaceChildren();

  cartTotalEl.textContent = `Итоговая сумма: ${cart.getTotal()} ₸`;
  console.log(`Итоговая сумма: ${cart.getTotal()} ₸`)

  // Вывод товаров
  for (const item of cart.items) {
    const product = await getProductById(item.product.id);

    const div = document.createElement("div");
    div.className = "div__cart--item";

    const btnRemove = document.createElement("button");
    btnRemove.className = "button button--remove"
    btnRemove.textContent = "Удалить";
    btnRemove.dataset.id = product.id;

    const title = document.createElement("p");
    title.textContent = `${product.title} - ${product.price} ₸ × ${item.quantity} = ${item.getTotalPrice()} ₸`;
    console.log(`${product.title} - ${product.price} ₸ × ${item.quantity} = ${item.getTotalPrice()} ₸`)

    div.append(title, btnRemove);
    cartItemsContainer.appendChild(div);
  }
}