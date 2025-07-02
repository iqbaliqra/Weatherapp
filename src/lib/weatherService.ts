const BASE_URL = 'https://api.openweathermap.org/data/2.5';



export async function fetchCurrentWeather(city: string) {
  const res = await fetch(
    `${BASE_URL}/weather?q=${city}&units=metric&appid=09bdc13c424cec372e4364fa404ec507`
  );
  if (!res.ok) {
    throw new Error('Failed to fetch current weather');
  }
  return res.json();
}

export async function fetchFiveDayForecast(city: string) {
  const res = await fetch(
    `${BASE_URL}/forecast?q=${city}&units=metric&appid=09bdc13c424cec372e4364fa404ec507`
  );
  if (!res.ok) {
    throw new Error('Failed to fetch 5-day forecast');
  }
  return res.json();
}
