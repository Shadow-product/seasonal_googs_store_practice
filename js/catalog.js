import { renderHeader, renderFooter } from "./common.js";
import { getProducts, getWeather } from "./api.js";
import { Product, Weather } from "./models.js";

document.addEventListener("DOMContentLoaded", async () => {
  renderHeader();
  renderFooter();

  const container = document.getElementById("catalog");
  if (!container) return;

  try {
    // Получает погоду (Алматы)
    const weatherData = await getWeather(43.25, 76.95);
    console.log("Погода Алматы:", weatherData);

    // Определяем условия погоды
    const temp = weatherData.current.temperature_2m;
    const precipitation = weatherData.current.precipitation;
    const windspeed = weatherData.current.windspeed_10m;
    const cloudcover = weatherData.current.cloudcover;
    const visibility = weatherData.current.visibility;

    const sun = temp > 25 && cloudcover < 30;
    const cloudy = cloudcover > 50 && precipitation === 0;
    const rain = temp >= 0 && precipitation > 0;
    const snowy = temp < 0 && precipitation > 0;
    const windy = windspeed > 10;
    const foggy = cloudcover > 80 || (visibility && visibility < 1000);
    const stormy = windspeed > 20 && precipitation > 0;

    // Создается объект Weather
    const weather = new Weather(sun, cloudy, rain, snowy, windy, foggy, stormy);
    // Получает категорию товаров по погоде
    const category = weather.getRecommendedCategory();

    // Загружает список товаров
    const products = await getProducts();
    // Фильтрует товары по категории
    const filtered = products.filter(p => p.category === category);

    // Выводим рекомендацию
    const recommendation = document.createElement("p");
    recommendation.className = "recommendation";
    recommendation.textContent = `Сейчас ${temp}°C — рекомендуем одеть: ${category}`;
    container.appendChild(recommendation);

    // Отображает карточки товаров
    container.replaceChildren(recommendation);
    for (const p of filtered) {
      const product = new Product(p.id, p.title, p.price, p.description, p.image, p.category);
      const card = product.renderCard();
      card.addEventListener("click", () => {
      localStorage.setItem("selectedProductId", p.id);
      window.location.href = "product.html"; // без ?id
    });
    container.appendChild(card);
  }

    // Поиск
    const searchInput = document.getElementById("search");
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        container.replaceChildren();
        for (const p of filtered.filter(p => p.title.toLowerCase().includes(query))) {
          const product = new Product(p.id, p.title, p.price, p.description, p.image, p.category);
          container.appendChild(product.renderCard());
        }
      });
    }

    // Сортировка
    const sortSelect = document.getElementById("sort");
    if (sortSelect) {
      sortSelect.addEventListener("change", () => {
        const sorted = [...filtered];
        if (sortSelect.value === "price-asc") sorted.sort((a, b) => a.price - b.price);
        if (sortSelect.value === "price-desc") sorted.sort((a, b) => b.price - a.price);

        container.replaceChildren();
        for (const p of sorted) {
          const product = new Product(p.id, p.title, p.price, p.description, p.image, p.category);
          container.appendChild(product.renderCard());
        }
      });
    }
  } catch (error) {
    console.error("Ошибка при загрузке каталога:", error);
    container.textContent = "Не удалось загрузить каталог. Попробуйте позже.";
  }
});