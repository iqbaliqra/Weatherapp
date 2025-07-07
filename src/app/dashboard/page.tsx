"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { fetchCurrentWeatherByCoords, fetchFiveDayForecastByCoords } from "@/lib/weatherService";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";

interface WeatherItem {
  dt: number;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    feels_like: number;
    pressure: number;
    humidity: number;
  };
  weather: { description: string; icon: string }[];
  wind: { speed: number };
}

interface ForecastResponse {
  list: WeatherItem[];
}

interface CurrentWeather {
  name: string;
  main: WeatherItem["main"];
  weather: WeatherItem["weather"];
  wind: WeatherItem["wind"];
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loadingUser, setLoadingUser] = useState(true);

  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user subscription status
  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/register");
      return;
    }

    if (status === "authenticated") {
      const fetchUser = async () => {
        const res = await fetch("/api/me");
        if (res.ok) {
          const data = await res.json();

          if (data.user.subscription_status === "INACTIVE") {
            router.push("/plans");
          }
        }
        setLoadingUser(false);
      };

      fetchUser();
    }
  }, [status, router]);

  // Load weather data
  useEffect(() => {
    if (status !== "authenticated") return;

    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by your browser.");
      setLoadingWeather(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const [current, forecastData] = await Promise.all([
            fetchCurrentWeatherByCoords(latitude, longitude),
            fetchFiveDayForecastByCoords(latitude, longitude),
          ]);
          setCurrentWeather(current);
          setForecast(forecastData);
        } catch (err) {
          console.error(err);
          setError("Failed to fetch weather data.");
        } finally {
          setLoadingWeather(false);
        }
      },
      (err) => {
        console.error(err);
        setError("Unable to retrieve your location. Please enable location services.");
        setLoadingWeather(false);
      }
    );
  }, [status]);

  if (status === "loading" || loadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading your account...</p>
      </div>
    );
  }

  if (loadingWeather) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border-l-4 border-red-500 p-4 max-w-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!currentWeather || !forecast) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-700">No weather data available.</p>
      </div>
    );
  }

  const getDayName = (dt: number) =>
    new Date(dt * 1000).toLocaleDateString("en-US", { weekday: "short" });

  const formatTime = (dt: number) =>
    new Date(dt * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6 pl-70">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Weather Dashboard</h1>
            <p className="text-gray-600">Hello {session?.user?.name}</p>
          </div>

          {/* Current Weather */}
          <section className="mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg text-white overflow-hidden">
              <div className="p-6 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{currentWeather.name}</h2>
                  <p className="text-blue-100">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-xl mt-2 capitalize">{currentWeather.weather[0].description}</p>
                </div>
                <div className="text-right">
                  <span className="text-5xl font-bold">{Math.round(currentWeather.main.temp)}°C</span>
                  <Image
                    src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@4x.png`}
                    alt={currentWeather.weather[0].description}
                    width={100}
                    height={100}
                    className="-mr-4 -mt-4"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 5-Day Forecast */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">5-Day Forecast</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {forecast.list
                .filter((_, i) => i % 8 === 0)
                .slice(0, 5)
                .map((item) => (
                  <div
                    key={item.dt}
                    className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow text-center"
                  >
                    <h3 className="font-semibold text-lg text-gray-800">{getDayName(item.dt)}</h3>
                    <Image
                      src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                      alt={item.weather[0].description}
                      width={64}
                      height={64}
                      className="mx-auto my-3"
                    />
                    <p className="text-gray-600 capitalize">{item.weather[0].description}</p>
                    <div className="flex justify-center space-x-2 mt-2">
                      <span className="font-bold text-gray-800">{Math.round(item.main.temp_max)}°</span>
                      <span className="text-gray-500">{Math.round(item.main.temp_min)}°</span>
                    </div>
                  </div>
                ))}
            </div>
          </section>

          {/* Today's Forecast */}
          <section>
<h2 className="text-2xl font-bold text-gray-800 mb-4">Today&apos;s Forecast</h2>
            <div className="bg-white rounded-xl shadow-md p-4 overflow-x-auto">
              <div className="flex space-x-6">
                {forecast.list.slice(0, 8).map((item) => (
                  <div key={item.dt} className="flex flex-col items-center min-w-max">
                    <p className="text-gray-600">{formatTime(item.dt)}</p>
                    <Image
                      src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                      alt={item.weather[0].description}
                      width={40}
                      height={40}
                      className="my-2"
                    />
                    <p className="font-semibold text-gray-800">{Math.round(item.main.temp)}°</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
