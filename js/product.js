import { renderHeader, renderFooter } from "./common.js";
import { getProductById, getWeather, getRecommendedProducts } from "./api.js";
import { Product, Cart, Weather, ClothingAdvisor } from "./models.js";

const categoryMap = {
  sun: "Солнечная погода",
  cloudy: "Облачная погода",
  rain: "Дождливая погода",
  snowy: "Снежная погода",
  windy: "Ветренная погода",
  foggy: "Туман",
  stormy: "Шторм",
  default: "Комфортная погода"
};

document.addEventListener("DOMContentLoaded", async () => {
  renderHeader();
  renderFooter();

  const container = document.getElementById("product-details");
  const productId = localStorage.getItem("selectedProductId");

  if (!productId) {
    container.textContent = "Товар не выбран";
    return;
  }

  const p = await getProductById(productId);
  if (!p) {
    container.textContent = "Товар не найден";
    return;
  }

  const product = new Product(
    p.id, p.title, p.price, p.description, p.image, p.category
  );

  container.replaceChildren();

  // Блок и кнопки страницы товары
  const divActions = document.createElement("div");
  divActions.className = "div__actions";

  const addBtn = document.createElement("button");
  addBtn.className = "button button--add";
  addBtn.textContent = "Добавить в корзину";
  addBtn.addEventListener("click", () => {
    const cart = Cart.load(); // загрузить корзину из LocalStorage
    cart.addItem(product); // увеличивает quantity и сохраняет
    alert("Товар добавлен в корзину!");
  });

  const catalogBtn = document.createElement("button");
  catalogBtn.className = "button button--catalog--product";
  catalogBtn.textContent = "В каталог";

  // Обработчик события на главную страницу
  catalogBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  const cartBtn = document.createElement("button");
  cartBtn.className = "button button--cart";
  cartBtn.textContent = "В корзину";

  // Обработчик события на страницу корзины
   cartBtn.addEventListener("click", () => {
    window.location.href = "cart.html";
  });

  divActions.append(addBtn, catalogBtn, cartBtn);

  // Карточка товара
    const productCard = document.createElement("div");
    productCard.className = "product__card";

    const productImage = document.createElement("img");
    productImage.src = product.image;
    productImage.alt = product.title;

    const productTitle = document.createElement("h2");
    productTitle.textContent = `Товар: ${product.title}`;

    const productDesc = document.createElement("p");
    productDesc.textContent = `Описание: ${product.description}`; 

    const productPrice = document.createElement("p");
    productPrice.textContent = `Цена: ${product.price} ₸`;

    // Категория товара
    const productCategory = document.createElement("p");
    const categoryName = categoryMap[product.category] || "Неизвестно";
    productCategory.textContent = `Категория: ${categoryName}`;

    // Рекомендация товара
    const recommendation = ClothingAdvisor.getRecommendation(categoryName) || "Нет рекомендации";
    const productRecommendation = document.createElement("p");
    productRecommendation.textContent = `Рекомендация: ${recommendation}`;

    // собирается карточка товара
    productCard.append(productImage, productTitle, productDesc,
      productPrice, productCategory, productRecommendation);
    container.appendChild(productCard);
    container.appendChild(divActions);

  // Карточки координатов городов
  const cities = {
    Астана: { latitude: 51.16, longitude: 71.45 },
    Алматы: { latitude: 43.25, longitude: 76.95 },
    Шымкент: { latitude: 42.31, longitude: 69.59 }
  };

  for (const [name, coords] of Object.entries(cities)) {
    const weatherData = await getWeather(coords.latitude, coords.longitude);
    console.log("Информация о погоде:", weatherData);

  if (weatherData.current) {
    const temp = weatherData.current.temperature_2m;
    const precipitation = weatherData.current.precipitation;
    const windspeed = weatherData.current.windspeed;
    const cloudcover = weatherData.current.cloudcover;
    const visibility = weatherData.current.visibility;

    // Определяются условия погоды
    const sun = temp > 25 && cloudcover < 30;
    const cloudy = cloudcover > 50 && precipitation === 0;
    const rain   = temp >= 0 && precipitation > 0;
    const snowy  = temp < 0 && precipitation > 0;
    const windy  = windspeed > 10;
    const foggy  = cloudcover > 80 || (visibility && visibility < 1000);
    const stormy = windspeed > 20 && precipitation > 0;

    const weather = new Weather(sun, cloudy, rain, snowy, windy, foggy, stormy);
    const category = weather.getRecommendedCategory();
    const clothing = ClothingAdvisor.getRecommendation(category)

    // Карточка погоды
    const cardWeather = document.createElement("div");
    cardWeather.className = "weather__card";

    // Название города
    const titleWeather = document.createElement("h3");
    titleWeather.className = "weather__title";
    titleWeather.textContent = name;

    // Время
    const timeWeather = document.createElement("p");
    timeWeather.className = "weather__time";

    // преобразовывается ISO‑строку в локальное время
    /* ISO‑строка — это универсальный формат даты и времени
    (год‑месяц‑день, часы‑минуты‑секунды, плюс часовой пояс), 
    который используется для передачи времени в API
    и легко преобразуется в локальный формат для пользователя. */
    const date = new Date(weatherData.current.time);
    timeWeather.textContent = `Время: ${date.toLocaleString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "long"
    })}`;

    // Температура
    const tempWeather = document.createElement("p");
    tempWeather.className = "weather__temp";
    tempWeather.textContent = `Температура: ${weatherData.current.temperature_2m} °C`;

    // Осадки
    const precipitationWeather= document.createElement("p");
    precipitationWeather.className = "weather__precip";
    precipitationWeather.textContent = `Осадки: ${weatherData.current.precipitation} мм`;

    // Ветер
    const windWeather = document.createElement("p");
    windWeather.className = "weather__wind";
    windWeather.textContent = `Ветер: ${weatherData.current.windspeed_10m} км/ч`;

    // Облачность
    const cloudWeather = document.createElement("p");
    cloudWeather.className = "weather__cloud";
    cloudWeather.textContent = `Облачность: ${weatherData.current.cloudcover}%`;

    // Категория
    const weatherCategory = document.createElement("p");
    weatherCategory.className = "weather__category";
    weatherCategory.textContent = `Категория товаров по погоде: ${weather.getRecommendedCategory()}`;

    // Рекомендация
    // const clothingRecommendation = ClothingAdvisor.getRecommendation(category) || "Нет рекомендации";
    const weatherRecommendation = document.createElement("p");
    weatherRecommendation.className = "weather__recommendation";
    weatherRecommendation.textContent = `Сейчас ${temp} °C - рекомендуем одеть категорию: ${clothing}`;

    const recommended = await getRecommendedProducts(coords.latitude, coords.longitude);
    const recList = document.createElement("ul");
    recommended.forEach(prod => {
      const li = document.createElement("li");
      li.textContent = `${prod.title} — ${prod.price} ₸`;
      recList.appendChild(li);
    });

    // собирается карточка погоды
    cardWeather.append(titleWeather, timeWeather, tempWeather,
      precipitationWeather, windWeather, cloudWeather,
      weatherCategory, weatherRecommendation);

    container.appendChild(cardWeather);
    }
  }
});