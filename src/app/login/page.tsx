'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState({
    email: false,
    password: false
  });

  const handleCredentialsLogin = async () => {
    setLoading(true);
    setError("");
    
    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/dashboard");
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleFocus = (field: string) => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: string) => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-blue-100 overflow-hidden">
      {/* Weather background */}
      <WeatherBackground />

      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

      {/* Main form container */}
      <form className="relative z-10 w-full max-w-md p-8 mx-4 rounded-2xl shadow-xl bg-white/90 backdrop-blur-md border border-white/90 space-y-6 animate-fadeInUp">
        {/* Header with weather icon */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center">
            <div className="text-5xl animate-float-delay">🌤️</div>
          </div>
          <h1 className="text-3xl font-bold text-blue-800">Welcome Back</h1>
          <p className="text-blue-600">Sign in to your WeatherTrack account</p>
        </div>

        {/* Google login button */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 border border-blue-200 bg-white rounded-lg py-3 px-4 hover:bg-blue-50 transition-all duration-300"
        >
          <img 
            src="https://www.svgrepo.com/show/475656/google-color.svg" 
            alt="Google" 
            className="w-5 h-5" 
          />
          <span className="text-blue-700 font-medium">Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="flex items-center">
          <hr className="flex-grow border-blue-100" />
          <span className="mx-3 text-blue-400 text-sm">or</span>
          <hr className="flex-grow border-blue-100" />
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm animate-shake">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Email field */}
        <div className="animate-fadeInUp" style={{animationDelay: "0.1s"}}>
          <label htmlFor="email" className="block text-sm font-medium text-blue-900 mb-1">
            Email
          </label>
          <div className={`relative transition-all duration-200 ${isFocused.email ? "transform scale-[1.01]" : ""}`}>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              onFocus={() => handleFocus("email")}
              onBlur={() => handleBlur("email")}
              required
              className="w-full px-4 py-3 rounded-lg bg-white border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-blue-400/60 pr-10"
              placeholder="name@example.com"
            />
            <div className="absolute right-3 top-3 text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Password field */}
        <div className="animate-fadeInUp" style={{animationDelay: "0.2s"}}>
          <label htmlFor="password" className="block text-sm font-medium text-blue-900 mb-1">
            Password
          </label>
          <div className={`relative transition-all duration-200 ${isFocused.password ? "transform scale-[1.01]" : ""}`}>
            <input
              id="password"
              name="password"
              type={passwordVisible ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onFocus={() => handleFocus("password")}
              onBlur={() => handleBlur("password")}
              required
              className="w-full px-4 py-3 rounded-lg bg-white border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-blue-400/60 pr-10"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-10 top-3 text-blue-400 hover:text-blue-600 transition"
              aria-label={passwordVisible ? "Hide password" : "Show password"}
            >
              {passwordVisible ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              )}
            </button>
            <div className="absolute right-3 top-3 text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Forgot password link */}
        <div className="text-right animate-fadeInUp" style={{animationDelay: "0.3s"}}>
          <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot password?
          </a>
        </div>

        {/* Login button */}
        <button
          onClick={handleCredentialsLogin}
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-blue-200 active:scale-[0.98]"
          } text-white relative overflow-hidden group animate-fadeInUp`}
          style={{animationDelay: "0.4s"}}
        >
          <span className={`relative z-10 flex items-center ${
            loading ? "opacity-0" : "opacity-100"
          }`}>
            Sign In
          </span>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
        </button>

        {/* Sign up link */}
        <div className="text-center text-sm text-blue-900 animate-fadeInUp" style={{animationDelay: "0.5s"}}>
          <p>Don't have an account?{" "}
            <a href="/register" className="font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200 underline-offset-2 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </form>
    </main>
  );
}

function WeatherBackground() {
  const weatherIcons = ["☀️", "⛅", "🌤️", "🌥️", "☁️", "🌦️", "🌧️", "⛈️", "🌩️", "🌨️", "❄️", "🌪️"];
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => {
        const size = `${2 + Math.random() * 3}rem`;
        const delay = `${Math.random() * 5}s`;
        const duration = `${15 + Math.random() * 20}s`;
        const left = `${Math.random() * 100}%`;
        const top = `${Math.random() * 100}%`;
        const opacity = 0.5 + Math.random() * 0.3;
        
        return (
          <div 
            key={i}
            className="absolute text-blue-200 animate-fadeIn"
            style={{
              left,
              top,
              fontSize: size,
              animationDelay: delay,
              animationDuration: duration,
              opacity,
              textShadow: '0 0 10px rgba(255,255,255,0.7)',
              zIndex: 0
            }}
          >
            {weatherIcons[Math.floor(Math.random() * weatherIcons.length)]}
          </div>
        );
      })}
    </div>
  );
}