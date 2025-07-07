"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { fetchCurrentWeatherByCoords, fetchFiveDayForecastByCoords } from "@/lib/weatherService";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import { WeatherData } from "@/types/weather";
import { ForecastItem } from "@/types/forecast";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastItem[] | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if unauthenticated
  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/register");
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

  if (status === "loading") {
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
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
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

  const getDayName = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { weekday: "short" });

  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6 pl-70">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Weather Dashboard</h1>
            <p className="text-gray-600">Hello {session?.user?.name}</p>
          </div>

          {/* Current Weather */}
          <section className="mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg overflow-hidden text-white">
              <div className="p-6 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{currentWeather.city}, {currentWeather.country}</h2>
                  <p className="text-blue-100">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-xl mt-2 capitalize">{currentWeather.condition}</p>
                </div>
                <div className="text-right">
                  <span className="text-5xl font-bold">{Math.round(currentWeather.temp)}°C</span>
                  <Image
                    src={`https://openweathermap.org/img/wn/${currentWeather.icon}@4x.png`}
                    alt={currentWeather.condition}
                    width={96}
                    height={96}
                    className="-mr-4 -mt-4"
                  />
                </div>
              </div>
              <div className="bg-blue-600 bg-opacity-30 p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center">
                  <p className="text-sm text-blue-100 mr-2">Humidity:</p>
                  <p className="font-semibold">{currentWeather.humidity}%</p>
                </div>
                <div className="flex items-center">
                  <p className="text-sm text-blue-100 mr-2">Wind:</p>
                  <p className="font-semibold">{currentWeather.wind} km/h</p>
                </div>
                <div className="flex items-center">
                  <p className="text-sm text-blue-100 mr-2">High:</p>
                  <p className="font-semibold">{currentWeather.high}°C</p>
                </div>
                <div className="flex items-center">
                  <p className="text-sm text-blue-100 mr-2">Feels Like:</p>
                  <p className="font-semibold">{Math.round(currentWeather.feels_like)}°C</p>
                </div>
              </div>
            </div>
          </section>

          {/* 5-Day Forecast */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">5-Day Forecast</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {forecast.slice(0, 5).map((item) => (
                <div
                  key={item.date}
                  className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow text-center"
                >
                  <h3 className="font-semibold text-lg text-gray-800">
                    {getDayName(item.date)}
                  </h3>
                  <Image
                    src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
                    alt={item.condition}
                    width={64}
                    height={64}
                    className="mx-auto my-3"
                  />
                  <p className="text-gray-600 capitalize">{item.condition}</p>
                  <p className="font-bold text-gray-800 mt-2">{Math.round(item.temp)}°C</p>
                </div>
              ))}
            </div>
          </section>

          {/* Today's Forecast */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Today&apos;s Forecast</h2>
            <div className="bg-white rounded-xl shadow-md p-4 overflow-x-auto">
              <div className="flex space-x-4">
                {forecast.slice(0, 8).map((item) => (
                  <div
                    key={item.date}
                    className="flex flex-col items-center min-w-max"
                  >
                    <p className="text-gray-600">{formatTime(item.date)}</p>
                    <Image
                      src={`https://openweathermap.org/img/wn/${item.icon}.png`}
                      alt={item.condition}
                      width={40}
                      height={40}
                      className="my-2"
                    />
                    <p className="font-semibold text-gray-800">
                      {Math.round(item.temp)}°
                    </p>
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
