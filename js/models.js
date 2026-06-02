/* Используется export и import (экспорт и импорт) потому что классы применяются в других файлах проекта */
// Класс пользователь (используется в auth.js файле для регистрации и входа)
export class User {
    constructor(name, email, password) {
      this.name = name; // свойство объекта (имя пользователя)
      this.email = email; 
      this.password = password;
    }

    checkPassword(password) {
    return this.password === password;
  }
}

// Класс погода (используется для работу с погодой)
export class Weather {
  constructor(sun, cloudy, rain, snowy, windy, foggy, stormy) {
    this.sun = sun; // солнечная погода
    this.cloudy = cloudy; // облачная погода
    this.rain = rain; // дождливая погода
    this.snowy = snowy; // снежная погода
    this.windy = windy; // ветренная погода
    this.foggy = foggy; // туманная погода
    this.stormy = stormy; // штормовая погода
  }

  // метод для определения категории товаров
  getRecommendedCategory() {
    if (this.sun) return "sun";
    if (this.cloudy) return "cloudy";
    if (this.rain) return "rain";
    if (this.snowy) return "snowy";
    if (this.windy) return "windy";
    if (this.foggy) return "foggy";
    if (this.stormy) return "stormy";
    return "default";
  }
}

export async function getRecommendedProducts(latitude, longitude) {
  const weather = await getWeather(latitude, longitude);

  const temp = weather.current.temperature_2m;
  const rain = weather.current.precipitation;

  let category;
  if (temp > 25) category = "summer";
  else if (rain > 0) category = "umbrella";
  else if (temp < 0) category = "winter";
  else category = "default";

  return products.filter(p => p.category === category);
}

export class ClothingAdvisor {
  static getRecommendation(category) {
     switch (category) {
      case "sun": return "кепку или футболку";
      case "cloudy": return "лёгкую кофту";
      case "rain": return "зонт или дождевик";
      case "snowy": return "тёплую куртку и шапку";
      case "windy": return "ветровку";
      case "foggy": return "светоотражающую одежду";
      case "stormy": return "плащ и прочную обувь";
      default: return "удобную одежду";
    }
  }
}

export class Product {
  constructor(id, title, price, description, image, category) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.description = description;
    this.image = image;
    this.category = category;
  }

   // безопасный рендер карточки для каталога
  renderCard() {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = this.image;
    img.alt = this.title;

    const h3 = document.createElement("h3");
    h3.textContent = `Товар: ${this.title}`;

    const price = document.createElement("p");
    price.textContent = `Цена: ${this.price} ₸`;

    const link = document.createElement("a");
    link.href = `product.html?id=${this.id}`;
    link.textContent = "Подробнее";

    card.append(img, h3, price, link);
    return card;
  }

   // рендер подробной информации на странице товара
  renderDetails() {
    const container = document.createElement("div");
    container.className = "product-details";

    const img = document.createElement("img");
    img.src = this.image;
    img.alt = this.title;

    const h2 = document.createElement("h2");
    h2.textContent = `Товар: ${this.title}`;

    const desc = document.createElement("p");
    desc.textContent = this.description;

    const price = document.createElement("p");
    price.textContent = `Цена: ${this.price} ₸`;

    container.append(img, h2, desc, price);
    return container;
  }
}

// Класс для одного элемента корзины
export class CartItem {
  constructor(product, quantity = 1) {
    this.product = product;   // объект Product
    this.quantity = quantity; // количество
  }

  // итоговая цена за этот товар
  getTotalPrice() {
    return this.product.price * this.quantity;
  }
}

// Класс корзины
export class Cart {
  constructor(items = []) {
    this.items = items; // массив CartItem
  }

  // добавить товар
  addItem(product) {
    const existing = this.items.find(item => item.product.id === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      this.items.push(new CartItem(product, 1));
    }
    this.save();
  }

  // полностью удалить товар
  removeItem(productId) {
    this.items = this.items.filter(item => item.product.id !== productId);
    this.save();
  }

  // удалить товар кол-во 1
  decreaseItem(productId) {
    const item = this.items.find(i => i.product.id === productId);
    if (!item) return;

     if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      // если количество стало 0 — удалить товар
      this.items = this.items.filter(i => i.product.id !== productId);
    }
    this.save();
  }

  // очистить корзину
  clear() {
    this.items = [];
    this.save();
  }

  // итоговая сумма
  getTotal() {
    return this.items.reduce(
      (sum, item) => sum + item.getTotalPrice(),
    0);
  }

  // сохранить корзину в LocalStorage
  save() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const key = currentUser ? `cart_${currentUser.email}` : "cart_guest";
    localStorage.setItem(key, JSON.stringify(this.items));
  }

  // загрузить корзину из LocalStorage с сохранением авторизованным / не авторизованным пользователем
  static load() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const key = currentUser ? `cart_${currentUser.email}` : "cart_guest";
    const data = JSON.parse(localStorage.getItem(key)) || [];
    return new Cart(data.map(obj => new CartItem(obj.product, obj.quantity)));
  }
}