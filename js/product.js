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
  const cities = [
    { name: "Астана", latitude: 51.16, longitude: 71.45 },
    { name: "Алматы", latitude: 43.25, longitude: 76.95 },
    { name: "Шымкент", latitude: 42.31, longitude: 69.59 }
  ];

  for (const city of cities) {
    const weatherData = await getWeather(city.latitude, city.longitude);

    // Карточка погоды
    const cardWeather = document.createElement("div");
    cardWeather.className = "weather__card";

    // Название города
    const titleWeather = document.createElement("h3");
    titleWeather.className = "weather__title";
    titleWeather.textContent = city.name;
    cardWeather.appendChild(titleWeather);

    // если данных нет — выводим сообщение
    if (!weatherData || !weatherData.current) {
      const errorMsg = document.createElement("p");
      errorMsg.textContent = "Погода недоступна";
      cardWeather.appendChild(errorMsg);
      container.appendChild(cardWeather);
      continue; // переход к следующему городу
    }

    const temp = weatherData.current.temperature_2m;
    const precipitation = weatherData.current.precipitation;
    const windspeed = weatherData.current.windspeed_10m;
    const cloudcover = weatherData.current.cloudcover;
    const visibility = weatherData.current.visibility;
    const time = weatherData.current.time;

    const weather = new Weather(
      temp > 25 && cloudcover < 30,
      cloudcover > 50 && precipitation === 0,
      temp >= 0 && precipitation > 0,
      temp < 0 && precipitation > 0,
      windspeed > 10,
      cloudcover > 80 || (visibility && visibility < 1000),
      windspeed > 20 && precipitation > 0
    );

    const category = weather.getRecommendedCategory();
    const clothing = ClothingAdvisor.getRecommendation(category)

    // Время
    const timeWeather = document.createElement("p");
    timeWeather.className = "weather__time";
    // преобразовывается ISO‑строку в локальное время
    /* ISO‑строка — это универсальный формат даты и времени
    (год‑месяц‑день, часы‑минуты‑секунды, плюс часовой пояс), 
    который используется для передачи времени в API
    и легко преобразуется в локальный формат для пользователя. */
    const now = new Date();
    timeWeather.textContent = `Время: ${now.toLocaleString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "long",
      timeZone: "Asia/Almaty"
    })}`;

    // Температура
    const tempWeather = document.createElement("p");
    tempWeather.className = "weather__temp";
    tempWeather.textContent = `Температура: ${temp} °C`;

    // Осадки
    const precipitationWeather = document.createElement("p");
    precipitationWeather.className = "weather__precip";
    precipitationWeather.textContent = `Осадки: ${precipitation} мм`;

    // Ветер
    const windWeather = document.createElement("p");
    windWeather.className = "weather__wind";
    windWeather.textContent = `Ветер: ${windspeed} км/ч`;

    // Облачность
    const cloudWeather = document.createElement("p");
    cloudWeather.className = "weather__cloud";
    cloudWeather.textContent = `Облачность: ${cloudcover}%`;

    // Категория
    const weatherCategory = document.createElement("p");
    weatherCategory.className = "weather__category";
    weatherCategory.textContent = `Категория товаров по погоде: ${category}`;

    // Рекомендация
    // const clothingRecommendation = ClothingAdvisor.getRecommendation(category) || "Нет рекомендации";
    const weatherRecommendation = document.createElement("p");
    weatherRecommendation.className = "weather__recommendation";
    weatherRecommendation.textContent = `Сейчас ${temp} °C - рекомендуем одеть категорию: ${clothing}`;

    // собирается карточка погоды
    cardWeather.append(titleWeather, timeWeather, tempWeather,
      precipitationWeather, windWeather, cloudWeather,
      weatherCategory, weatherRecommendation
    );

    container.appendChild(cardWeather);

    await new Promise(resolve => setTimeout(resolve, 1500)); // пауза между запросами
  }
})