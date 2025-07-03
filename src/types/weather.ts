import { ForecastItem } from "./forecast";
export type WeatherData = {
  city: string;
  country: string;
  icon: string;
  temp: number;
  condition: string;
  high: number;
  low: number;
  humidity?: number;
  wind?: number;
  feels_like?: number;
  forecast: ForecastItem[];
};