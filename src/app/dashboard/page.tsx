'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { fetchCurrentWeather } from '@/lib/weatherService';

type Location = {
  id: string;
  city: string;
  country: string;
};

type WeatherData = {
  city: string;
  country: string;
  icon: string;
  temp: number;
  condition: string;
  high: number;
  low: number;
};

export default function Dashboard() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        // 1. Get saved locations
        const res = await fetch('/api/locations');
        if (!res.ok) throw new Error('Failed to load locations');
        const locationsData = await res.json();
        setLocations(locationsData);

        // 2. Fetch weather for each location
        const weatherPromises = locationsData.map(async (loc: Location) => {
          const data = await fetchCurrentWeather(loc.city);
          return {
            city: loc.city,
            country: loc.country,
            temp: Math.round(data.main.temp),
            condition: data.weather[0].description,
            high: Math.round(data.main.temp_max),
            low: Math.round(data.main.temp_min),
          };
        });

        const allWeather = await Promise.all(weatherPromises);
        setWeatherData(allWeather);
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
      <main className="flex-1 p-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Weather Dashboard</h2>

        {loading ? (
          <div className="text-gray-600">Loading weather data...</div>
        ) : weatherData.length === 0 ? (
          <div className="text-gray-600">No locations added yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weatherData.map((weather) => (
              <div
                key={`${weather.city}-${weather.country}`}
                className="bg-white rounded-lg shadow p-6"
              >
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {weather.city}
                  </h3>
                  <p className="text-sm text-gray-500">{weather.country}</p>
                  <p className="text-gray-500 capitalize mt-1">{weather.condition}</p>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold">{weather.temp}°C</p>
                  <p className="text-sm text-gray-500 mt-1">
                    H: {weather.high}° L: {weather.low}°
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
