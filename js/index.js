// index.js
import { renderHeader, renderFooter } from "./common.js";
import { getProducts } from "./api.js";
import { Product } from "./models.js";

document.addEventListener("DOMContentLoaded", async () => {
  renderHeader();
  renderFooter();

  const catalog = document.getElementById("catalog");
  if (!catalog) return;

  try {
    const products = await getProducts();
    catalog.replaceChildren();

    products.forEach(p => {
      const product = new Product(
        p.id, p.title, p.price, p.description, p.image, p.category
      );

      const card = product.renderCard();
      card.addEventListener("click", () => {
        localStorage.setItem("selectedProductId", p.id);
        window.location.href = "product.html";
      });

      catalog.appendChild(card);
    });

    // Вывод всех товаров виде таблицы (для наглядности)
    console.table(products, ["id", "title", "price"]);
    console.table(products, ["description", "image", "category"]);
    
  } catch (error) {
    console.error("Ошибка загрузки товаров:", error.message);
    catalog.textContent = "Не удалось загрузить каталог";
  }
});