'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import {
  fetchCurrentWeather,
  fetchFiveDayForecast,
  fetchSixteenDayForecast,
} from '@/lib/weatherService';
import { Location } from '@/types/location';
import { WeatherData } from '@/types/weather';
import { ForecastItem } from '@/types/forecast';
import { FiPlus, FiRefreshCw } from 'react-icons/fi';
import Link from 'next/link';

export default function WeatherPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);

  const { status } = useSession();
  const router = useRouter();

  // Check authentication and subscription status
  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push('/register');
      return;
    }

    if (status === 'authenticated') {
      const fetchUser = async () => {
        const res = await fetch('/api/me');
        if (res.ok) {
          const data = await res.json();
          setSubscriptionStatus(data.user.subscription_status);
        }
      };
      fetchUser();
    }
  }, [status, router]);

  // Load weather data
  const loadWeather = async () => {
    try {
      setRefreshing(true);

      // Fetch saved locations
      const res = await fetch('/api/locations');
      if (!res.ok) throw new Error('Failed to load locations');
      const locationsData = await res.json();
      setLocations(locationsData);

      const weatherPromises = locationsData.map(async (loc: Location) => {
        const current = await fetchCurrentWeather(loc.city);

        let fiveDayRes: any = null;
        let sixteenDayRes: any = null;

        // Always fetch 5-day
        fiveDayRes = await fetchFiveDayForecast(loc.city);

        // Try 16-day if active
        if (subscriptionStatus === 'ACTIVE') {
          try {
            sixteenDayRes = await fetchSixteenDayForecast(loc.city);
          } catch (err) {
            console.warn(`16-day forecast not available for ${loc.city}`);
            sixteenDayRes = undefined;
          }
        }

        // Process 5-day forecast
        const forecastMap5 = new Map();
        fiveDayRes.list.forEach((entry: any) => {
          const date = entry.dt_txt.split(' ')[0];
          if (!forecastMap5.has(date)) {
            forecastMap5.set(date, {
              temps: [],
              icon: entry.weather[0].icon,
              condition: entry.weather[0].main,
            });
          }
          forecastMap5.get(date).temps.push(entry.main.temp);
        });

        const forecast5 = Array.from(forecastMap5.entries())
          .slice(0, 5)
          .map(([date, { temps, icon, condition }]) => ({
            date,
            temp: Math.round(
              temps.reduce((sum:any, t:any) => sum + t, 0) / temps.length
            ),
            icon,
            condition,
          }));

        // 16-day forecast
        let forecast16: ForecastItem[] | undefined = undefined;
        if (sixteenDayRes) {
          forecast16 = sixteenDayRes.list.map((day: any) => ({
            date: new Date(day.dt * 1000).toISOString().split('T')[0],
            temp: Math.round(day.temp.day),
            icon: day.weather[0].icon,
            condition: day.weather[0].main,
          }));
        }

        // Mock historical data
        const historical: ForecastItem[] = Array.from({ length: 3 }).map((_, idx) => {
          const date = new Date();
          date.setDate(date.getDate() - (idx + 1));
          return {
            date: date.toISOString().split('T')[0],
            temp: Math.round(current.main.temp - idx * 2),
            icon: current.weather[0].icon,
            condition: current.weather[0].main,
          };
        });

        return {
          city: loc.city,
          country: loc.country,
          icon: current.weather[0].icon,
          temp: Math.round(current.main.temp),
          condition: current.weather[0].main,
          high: Math.round(current.main.temp_max),
          low: Math.round(current.main.temp_min),
          humidity: current.main.humidity,
          wind: Math.round(current.wind.speed),
          feels_like: Math.round(current.main.feels_like),
          forecast5,
          forecast16,
          historical,
        };
      });

      const allWeather = await Promise.all(weatherPromises);
      setWeatherData(allWeather);
    } catch (err) {
      console.error(err);
      alert('Error loading weather data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, [subscriptionStatus]);

  const getWeatherIcon = (iconCode: string) =>
    `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  const getBackgroundColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return 'bg-gradient-to-br from-blue-100 to-blue-50';
      case 'clouds':
        return 'bg-gradient-to-br from-gray-100 to-gray-50';
      case 'rain':
        return 'bg-gradient-to-br from-blue-200 to-blue-100';
      case 'snow':
        return 'bg-gradient-to-br from-blue-50 to-white';
      case 'thunderstorm':
        return 'bg-gradient-to-br from-purple-100 to-blue-100';
      default:
        return 'bg-gradient-to-br from-gray-50 to-white';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 md:pl-70">
        {/* Upgrade Banner */}
        {subscriptionStatus === 'INACTIVE' && (
          <div className="mb-4 p-4 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg flex items-center justify-between">
            <div>
              <strong className="font-semibold">Upgrade to Premium</strong> to unlock extended forecasts and historical weather.
            </div>
            <Link href="/plans" className="ml-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">
              Upgrade
            </Link>
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Weather Dashboard</h2>
            <p className="text-gray-500 text-sm mt-1">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <button
            onClick={loadWeather}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          >
            {refreshing ? <FiRefreshCw className="animate-spin" /> : <FiRefreshCw />}
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow p-6 animate-pulse" />
            ))}
          </div>
        ) : weatherData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow p-6 text-center">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <FiPlus className="text-blue-500 text-2xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No locations added</h3>
            <p className="text-gray-500 mb-4">Add locations to see weather information</p>
            <Link href="/locations" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Add Locations
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {weatherData.map((weather) => (
              <div
                key={`${weather.city}-${weather.country}`}
                className={`${getBackgroundColor(weather.condition)} rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02]`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{weather.city}</h3>
                      <p className="text-sm text-gray-600">{weather.country}</p>
                    </div>
                    {weather.icon && (
                      <img src={getWeatherIcon(weather.icon)} alt={weather.condition} className="w-16 h-16 -mt-4 -mr-2" />
                    )}
                  </div>

                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-4xl font-bold text-gray-800">{weather.temp}°C</p>
                      <p className="text-sm text-gray-600 capitalize mt-1">{weather.condition}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">H: {weather.high}° L: {weather.low}°</p>
                      <p className="text-xs text-gray-500 mt-1">Feels like {weather.feels_like}°C</p>
                    </div>
                  </div>

                  {/* 5-Day Forecast */}
                  <div className="mt-4 pt-4 border-t border-gray-200 border-opacity-50">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">5-Day Forecast</h4>
                    <div className="grid grid-cols-5 gap-2">
                      {weather.forecast5.map((day) => (
                        <div key={day.date} className="flex flex-col items-center bg-white bg-opacity-50 rounded p-2">
                          <p className="text-xs text-gray-600">
                            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                          </p>
                          <img src={getWeatherIcon(day.icon)} alt={day.condition} className="w-8 h-8" />
                          <p className="text-sm font-medium">{day.temp}°C</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 16-Day Forecast */}
                  {subscriptionStatus === 'ACTIVE' && (
                    <div className="mt-4 pt-4 border-t border-gray-200 border-opacity-50">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">16-Day Forecast</h4>
                      {weather.forecast16 ? (
                        <div className="grid grid-cols-4 gap-2">
                          {weather.forecast16.map((day) => (
                            <div key={day.date} className="flex flex-col items-center bg-white bg-opacity-50 rounded p-2">
                              <p className="text-xs text-gray-600">
                                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                              </p>
                              <img src={getWeatherIcon(day.icon)} alt={day.condition} className="w-8 h-8" />
                              <p className="text-sm font-medium">{day.temp}°C</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">16-day forecast not available.</p>
                      )}
                    </div>
                  )}

                  {/* Historical */}
                  {subscriptionStatus === 'ACTIVE' && weather.historical && (
                    <div className="mt-4 pt-4 border-t border-gray-200 border-opacity-50">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Historical Weather (Last 3 Days)</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {weather.historical.map((day) => (
                          <div key={day.date} className="flex flex-col items-center bg-white bg-opacity-50 rounded p-2">
                            <p className="text-xs text-gray-600">
                              {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                            </p>
                            <img src={getWeatherIcon(day.icon)} alt={day.condition} className="w-8 h-8" />
                            <p className="text-sm font-medium">{day.temp}°C</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
