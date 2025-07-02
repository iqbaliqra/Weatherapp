'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { fetchCurrentWeather, fetchFiveDayForecast } from '@/lib/weatherService';

type Location = {
  id: string;
  city: string;
  country: string;
};

type CurrentWeather = {
  city: string;
  country: string;
  temp: number;
  condition: string;
  icon: string;
};

type ForecastItem = {
  dt: string; // date-time
  temp: number;
  icon: string;
};

type LocationWeather = {
  current: CurrentWeather;
  forecast: ForecastItem[];
};

export default function WeatherPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [weatherData, setWeatherData] = useState<Record<string, LocationWeather>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        // 1. Fetch all saved locations
        const res = await fetch('/api/locations');
        if (!res.ok) throw new Error('Failed to load locations');
        const locs: Location[] = await res.json();
        setLocations(locs);

        // 2. For each location, fetch current and forecast data
        const dataPromises = locs.map(async (loc) => {
          const [current, forecast] = await Promise.all([
            fetchCurrentWeather(loc.city),
            fetchFiveDayForecast(loc.city),
          ]);

          const currentData: CurrentWeather = {
            city: loc.city,
            country: loc.country,
            temp: Math.round(current.main.temp),
            condition: current.weather[0].description,
            icon: `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`,
          };

          // Get forecast per day (simplified: pick every 8th 3-hour interval)
          const forecastData: ForecastItem[] = forecast.list
            .filter((_: any, idx: number) => idx % 8 === 0)
            .map((entry: any) => ({
              dt: entry.dt_txt,
              temp: Math.round(entry.main.temp),
              icon: `https://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png`,
            }));

          return {
            key: `${loc.city}-${loc.country}`,
            data: {
              current: currentData,
              forecast: forecastData,
            },
          };
        });

        const allWeather = await Promise.all(dataPromises);
        const weatherObj: Record<string, LocationWeather> = {};
        allWeather.forEach((w) => {
          weatherObj[w.key] = w.data;
        });
        setWeatherData(weatherObj);
      } catch (err) {
        console.error(err);
        alert('Error loading weather data');
      } finally {
        setLoading(false);
      }
    };

    loadWeather();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-10 overflow-y-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Weather Overview
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading weather data...</p>
        ) : locations.length === 0 ? (
          <p className="text-gray-500">No locations added yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {locations.map((loc) => {
              const key = `${loc.city}-${loc.country}`;
              const weather = weatherData[key];
              if (!weather) return null;

              return (
                <div
                  key={key}
                  className="bg-white rounded-lg shadow p-6 space-y-4"
                >
                  {/* Current Weather */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {loc.city}
                      </h3>
                      <p className="text-sm text-gray-500">{loc.country}</p>
                      <p className="capitalize text-gray-500">
                        {weather.current.condition}
                      </p>
                    </div>
                    <img
                      src={weather.current.icon}
                      alt={weather.current.condition}
                      className="h-12 w-12"
                    />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">
                      {weather.current.temp}°C
                    </p>
                  </div>

                  {/* Forecast */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      5-Day Forecast
                    </h4>
                    <div className="grid grid-cols-5 gap-2">
                      {weather.forecast.map((f) => (
                        <div
                          key={f.dt}
                          className="flex flex-col items-center bg-gray-50 rounded p-2"
                        >
                          <p className="text-xs text-gray-500">
                            {new Date(f.dt).toLocaleDateString(undefined, {
                              weekday: 'short',
                            })}
                          </p>
                          <img
                            src={f.icon}
                            alt=""
                            className="h-8 w-8"
                          />
                          <p className="text-sm font-medium">
                            {f.temp}°
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
