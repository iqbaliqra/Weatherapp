import { ForecastItem } from "./forecast";
export interface WeatherData {
  city: string;
  country: string;
  icon: string;
  temp: number;
  condition: string;
  high: number;
  low: number;
  humidity: number;
  wind: number;
  feels_like: number;
  forecast5: ForecastItem[];
  forecast16?: ForecastItem[];
  historical?: ForecastItem[];
}