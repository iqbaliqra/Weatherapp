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
      const locationsData: Location[] = await res.json();

      const weatherPromises = locationsData.map(async (loc: Location) => {
        const current = await fetchCurrentWeather(loc.city);

        const fiveDayRes: Awaited<ReturnType<typeof fetchFiveDayForecast>> =
          await fetchFiveDayForecast(loc.city);

        let sixteenDayRes: Awaited<
          ReturnType<typeof fetchSixteenDayForecast>
        > | undefined = undefined;

        if (subscriptionStatus === 'ACTIVE') {
          try {
            sixteenDayRes = await fetchSixteenDayForecast(loc.city);
          } catch {
            console.warn(`16-day forecast not available for ${loc.city}`);
          }
        }

        // Process 5-day forecast
        const forecastMap5 = new Map<
          string,
          { temps: number[]; icon: string; condition: string }
        >();

        fiveDayRes.list.forEach((entry) => {
          const date = entry.dt_txt.split(' ')[0];
          if (!forecastMap5.has(date)) {
            forecastMap5.set(date, {
              temps: [],
              icon: entry.weather[0].icon,
              condition: entry.weather[0].main,
            });
          }
          forecastMap5.get(date)!.temps.push(entry.main.temp);
        });

        const forecast5: ForecastItem[] = Array.from(forecastMap5.entries())
          .slice(0, 5)
          .map(([date, { temps, icon, condition }]) => ({
            date,
            temp: Math.round(
              temps.reduce((sum, t) => sum + t, 0) / temps.length
            ),
            icon,
            condition,
          }));

        let forecast16: ForecastItem[] | undefined = undefined;
        if (sixteenDayRes) {
          forecast16 = sixteenDayRes.list.map((day) => ({
            date: new Date(day.dt * 1000).toISOString().split('T')[0],
            temp: Math.round(day.temp.day),
            icon: day.weather[0].icon,
            condition: day.weather[0].main,
          }));
        }

        const historical: ForecastItem[] = Array.from({ length: 3 }).map(
          (_, idx) => {
            const date = new Date();
            date.setDate(date.getDate() - (idx + 1));
            return {
              date: date.toISOString().split('T')[0],
              temp: Math.round(current.main.temp - idx * 2),
              icon: current.weather[0].icon,
              condition: current.weather[0].main,
            };
          }
        );

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
    } catch (error) {
      console.error(error);
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
        {subscriptionStatus === 'INACTIVE' && (
          <div className="mb-4 p-4 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg flex items-center justify-between">
            <div>
              <strong className="font-semibold">Upgrade to Premium</strong> to unlock extended forecasts and historical weather.
            </div>
            <Link
              href="/plans"
              className="ml-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
            >
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
            <Link
              href="/locations"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Locations
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {weatherData.map((weather) => (
              <div
                key={`${weather.city}-${weather.country}`}
                className={`${getBackgroundColor(
                  weather.condition
                )} rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02]`}
              >
                <div className="p-6">
                  {/* Your card content */}
                  {/* [You can keep the forecast and historical display here] */}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
