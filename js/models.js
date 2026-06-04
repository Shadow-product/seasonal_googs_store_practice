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
    if (this.sun) return "Солнечная погода";
    if (this.cloudy) return "Облачная погода";
    if (this.rain) return "Дождливая погода";
    if (this.snowy) return "Снежная погода";
    if (this.windy) return "Ветренная погода";
    if (this.foggy) return "Туман";
    if (this.stormy) return "Шторм";
    return "Комфортная погода";
  }
}

export class ClothingAdvisor {
  static getRecommendation(category) {
     switch (category) {
      case "Солнечная погода": return "кепка";
      case "Облачная погода": return "куртка";
      case "Дождливая погода": return "зонт";
      case "Снежная погода": return "зимняя куртка";
      case "Ветренная погода": return "ветровка";
      case "Туман": return "светоотражающий жилет";
      case "Шторм": return "дождевик";
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

  createBaseElement() {
    const img = document.createElement("img");
    img.src = this.image;
    img.alt = this.title;
    img.className = "product__img";

    const title = document.createElement("h3");
    title.textContent = `Товар: ${this.title}`;

    const price = document.createElement("p");
    price.textContent = `Цена: ${this.price} ₸`;

    return { img, title, price };
  }

   // безопасный рендер карточки для каталога
  renderCard(recommendationText = null, categoryName = null) {
    const card = document.createElement("div");
    card.className = "product__card";

    const { img, title, price } = this.createBaseElement();
    card.append(img, title, price);

    const link = document.createElement("a");
    link.href = `product.html?id=${this.id}`;
    link.textContent = "Подробнее";
    card.appendChild(link);

    if (categoryName) {
      const category = document.createElement("p");
      category.textContent = `Категория: ${categoryName}`;
      card.appendChild(category);
    }
    
    if (recommendationText) {
      const rec = document.createElement("p");
      rec.className = "recommendation";
      rec.textContent = recommendationText;
      card.appendChild(rec);
    }
    return card;
  }

   // рендер подробной информации на странице товара
  renderDetails(categoryName = null, recommendationText = null) {
    const container = document.createElement("div");
    container.className = "product__details";

    const { img, title, price } = this.createBaseElement();
    container.append(img, title, price);

    const desc = document.createElement("p");
    desc.textContent = this.description;
    container.appendChild(desc);

    if (categoryName) {
      const category = document.createElement("p");
      category.textContent = `Категория: ${categoryName}`;
      container.appendChild(category);
    }

    if (recommendationText) {
      const rec = document.createElement("p");
      rec.textContent = recommendationText;
      container.appendChild(rec);
    }

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