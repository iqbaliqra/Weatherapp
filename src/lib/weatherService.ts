const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function fetchCurrentWeather(city: string) {
  const res = await fetch(
    `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=09bdc13c424cec372e4364fa404ec507`
  );
  if (!res.ok) {
    throw new Error('Failed to fetch current weather');
  }
  return res.json();
}

export async function fetchFiveDayForecast(city: string) {
  const res = await fetch(
    `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=09bdc13c424cec372e4364fa404ec507`
  );
  if (!res.ok) {
    throw new Error('Failed to fetch 5-day forecast');
  }
  return res.json();
}

export async function fetchCurrentWeatherByCoords(lat: number, lon: number) {
  const res = await fetch(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=09bdc13c424cec372e4364fa404ec507`
  );
  if (!res.ok) {
    throw new Error('Failed to fetch current weather by coordinates');
  }
  return res.json();
}

export async function fetchFiveDayForecastByCoords(lat: number, lon: number) {
  const res = await fetch(
    `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=09bdc13c424cec372e4364fa404ec507`
  );
  if (!res.ok) {
    throw new Error('Failed to fetch forecast by coordinates');
  }
  return res.json();
}

export async function fetchSixteenDayForecast(city: string) {
  const res = await fetch(
    `${BASE_URL}/forecast/daily?q=${encodeURIComponent(city)}&cnt=16&units=metric&appid=09bdc13c424cec372e4364fa404ec507`
  );
  if (!res.ok) {
    throw new Error('Failed to fetch 16-day forecast');
  }
  return res.json();
}
