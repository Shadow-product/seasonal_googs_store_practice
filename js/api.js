const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

export async function getWeather(latitude, longitude) {
  const URL_WEATHER = `${WEATHER_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation,cloudcover,windspeed_10m,visibility&timezone=auto`;
  const RESULT_WEATHER = await fetch(URL_WEATHER);
  return RESULT_WEATHER.json();
}

export async function getForecast(lat, lon) {
  const URL_FORECAST = `${WEATHER_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,cloudcover,windspeed_10m,visibility&timezone=auto`;
  const RESULT_FORECAST = await fetch(URL_FORECAST);
  return RESULT_FORECAST.json();
}

// Тест
const products = [
  { id: 1, title: "Кепка", price: 3500, description: "Для солнца", image: "images/cap.webp", category: "sun" },
  { id: 2, title: "Куртка", price: 18000, description: "Для ветра", image: "images/jacket.webp", category: "cloudy" },
  { id: 3, title: "Зонт", price: 4500, description: "Для дождя", image: "images/umbrella.webp", category: "rain" },
  { id: 4, title: "Зимняя куртка", price: 30000, description: "Для снега", image: "images/winterJacket.webp", category: "snowy" },
  { id: 5, title: "Ветровка", price: 22000, description: "Для ветра", image: "images/windBreaker.webp", category: "windy" },
  { id: 6, title: "Респиратор", price: 1790, description: "Для тумана", image: "images/reflective vest.webp", category: "foggy"},
  { id: 7, title: "Дождевик", price: 16000, description: "Для шторма", image: "images/raincoat.webp", category: "stormy"}
];

export async function getProducts() {
  return Promise.resolve(products);
}

export async function getProductById(id) {
  const products = await getProducts();
  return products.find(p => p.id == id);
}