"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { fetchCurrentWeatherByCoords, fetchFiveDayForecastByCoords } from "@/lib/weatherService";
import Sidebar from "@/components/Sidebar";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [userInfo, setUserInfo] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user subscription status
  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/register");
    }

    if (status === "authenticated") {
      const fetchUser = async () => {
        const res = await fetch("/api/me");
        if (res.ok) {
          const data = await res.json();
          setUserInfo(data.user);

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

  const getDayName = (dt: number) =>
    new Date(dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });

  const formatTime = (dt: number) =>
    new Date(dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6 pl-70">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Weather Dashboard</h1>
            <p className="text-gray-600">
              Hello {session?.user?.name}
            </p>
          </div>

          {/* Current Weather */}
          <section className="mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg overflow-hidden text-white">
              <div className="p-6 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{currentWeather.name}</h2>
                  <p className="text-blue-100">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-xl mt-2 capitalize">{currentWeather.weather[0].description}</p>
                </div>
                <div className="text-right">
                  <span className="text-5xl font-bold">{Math.round(currentWeather.main.temp)}°C</span>
                  <img
                    src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@4x.png`}
                    alt={currentWeather.weather[0].description}
                    className="h-24 w-24 -mr-4 -mt-4"
                  />
                </div>
              </div>

              <div className="bg-blue-600 bg-opacity-30 p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Humidity */}
                <div className="flex items-center">
                  <p className="text-sm text-blue-100 mr-2">Humidity:</p>
                  <p className="font-semibold">{currentWeather.main.humidity}%</p>
                </div>
                {/* Wind */}
                <div className="flex items-center">
                  <p className="text-sm text-blue-100 mr-2">Wind:</p>
                  <p className="font-semibold">{currentWeather.wind.speed} km/h</p>
                </div>
                {/* Pressure */}
                <div className="flex items-center">
                  <p className="text-sm text-blue-100 mr-2">Pressure:</p>
                  <p className="font-semibold">{currentWeather.main.pressure} hPa</p>
                </div>
                {/* Feels Like */}
                <div className="flex items-center">
                  <p className="text-sm text-blue-100 mr-2">Feels Like:</p>
                  <p className="font-semibold">{Math.round(currentWeather.main.feels_like)}°C</p>
                </div>
              </div>
            </div>
          </section>

          {/* 5-Day Forecast */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">5-Day Forecast</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {forecast.list
                .filter((_: any, i: number) => i % 8 === 0)
                .slice(0, 5)
                .map((item: any) => (
                  <div
                    key={item.dt}
                    className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow text-center"
                  >
                    <h3 className="font-semibold text-lg text-gray-800">
                      {getDayName(item.dt)}
                    </h3>
                    <img
                      src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                      alt={item.weather[0].description}
                      className="h-16 w-16 mx-auto my-3"
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
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Today's Forecast</h2>
            <div className="bg-white rounded-xl shadow-md p-4 overflow-x-auto">
              <div className="flex space-x-22">
                {forecast.list.slice(0, 8).map((item: any) => (
                  <div
                    key={item.dt}
                    className="flex flex-col items-center min-w-max"
                  >
                    <p className="text-gray-600">{formatTime(item.dt)}</p>
                    <img
                      src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                      alt={item.weather[0].description}
                      className="h-10 w-10 my-2"
                    />
                    <p className="font-semibold text-gray-800">
                      {Math.round(item.main.temp)}°
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
