"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [isFocused, setIsFocused] = useState({
    name: false,
    email: false,
    password: false
  });
  const router = useRouter();


  // Form validation state
  const [validation, setValidation] = useState({
    nameValid: true,
    emailValid: true,
    passwordValid: true
  });

  useEffect(() => {
    // Preload any assets if needed
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation
    if (name === "email") {
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      setValidation(prev => ({ ...prev, emailValid: isValid || value === "" }));
    } else if (name === "password") {
      setValidation(prev => ({ ...prev, passwordValid: value.length >= 6 || value === "" }));
    } else if (name === "name") {
      setValidation(prev => ({ ...prev, nameValid: value.trim().length > 0 || value === "" }));
    }
  };

  const handleFocus = (field: string) => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: string) => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Final validation check
    const isNameValid = formData.name.trim().length > 0;
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    const isPasswordValid = formData.password.length >= 6;

    if (!isNameValid || !isEmailValid || !isPasswordValid) {
      setValidation({
        nameValid: isNameValid,
        emailValid: isEmailValid,
        passwordValid: isPasswordValid
      });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        // Success animation before redirect
        await new Promise(resolve => setTimeout(resolve, 1000));
        router.push("/login");
      }
    } catch (error) {
      console.log(error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };
const handleGoogleSignUp = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };
  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-blue-100 overflow-hidden">
      {/* Dynamic weather background */}
      <WeatherBackground />

      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

      {/* Main form container */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md p-8 mx-4 rounded-2xl shadow-xl bg-white/90 backdrop-blur-md border border-white/90 space-y-6 animate-fadeInUp"
      >
        {/* Animated header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center">
            <div className="text-5xl animate-float-delay">⛅</div>
          </div>
          <h1 className="text-3xl font-bold text-blue-800">Join WeatherTrack</h1>
          <p className="text-blue-600">Your personal weather companion</p>
        </div>
       <button
          type="button"
          onClick={handleGoogleSignUp}
          className="w-full flex items-center justify-center gap-3 border border-blue-200 bg-white rounded-lg py-2.5 sm:py-3 px-4 hover:bg-blue-50 transition-all duration-300 text-sm sm:text-base"
        >
          <img 
            src="https://www.svgrepo.com/show/475656/google-color.svg" 
            alt="Google" 
            className="w-4 h-4 sm:w-5 sm:h-5" 
          />
          <span className="text-blue-700 font-medium">Continue with Google</span>
        </button>
        {/* Error message with smooth appearance */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm transition-all duration-300 animate-shake">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Form fields with enhanced UX */}
        <div className="space-y-5">
          {/* Name field */}
          <div className="animate-fadeInUp" style={{animationDelay: "0.1s"}}>
            <label htmlFor="name" className="block text-sm font-medium text-blue-900 mb-1">
              Full Name
              {!validation.nameValid && (
                <span className="text-red-500 text-xs ml-1">(required)</span>
              )}
            </label>
            <div className={`relative transition-all duration-200 ${isFocused.name ? "transform scale-[1.01]" : ""}`}>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                onFocus={() => handleFocus("name")}
                onBlur={() => handleBlur("name")}
                required
                className={`w-full px-4 py-3 rounded-lg bg-white border ${
                  validation.nameValid ? "border-blue-100 focus:border-blue-400" : "border-red-300 focus:border-red-400"
                } focus:outline-none focus:ring-2 ${
                  validation.nameValid ? "focus:ring-blue-200" : "focus:ring-red-200"
                } transition placeholder-blue-400/60 pr-10`}
                placeholder="John Doe"
              />
              <div className="absolute right-3 top-3 text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Email field */}
          <div className="animate-fadeInUp" style={{animationDelay: "0.2s"}}>
            <label htmlFor="email" className="block text-sm font-medium text-blue-900 mb-1">
              Email
              {!validation.emailValid && (
                <span className="text-red-500 text-xs ml-1">(invalid email)</span>
              )}
            </label>
            <div className={`relative transition-all duration-200 ${isFocused.email ? "transform scale-[1.01]" : ""}`}>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                onFocus={() => handleFocus("email")}
                onBlur={() => handleBlur("email")}
                required
                className={`w-full px-4 py-3 rounded-lg bg-white border ${
                  validation.emailValid ? "border-blue-100 focus:border-blue-400" : "border-red-300 focus:border-red-400"
                } focus:outline-none focus:ring-2 ${
                  validation.emailValid ? "focus:ring-blue-200" : "focus:ring-red-200"
                } transition placeholder-blue-400/60 pr-10`}
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
          <div className="animate-fadeInUp" style={{animationDelay: "0.3s"}}>
            <label htmlFor="password" className="block text-sm font-medium text-blue-900 mb-1">
              Password
              {!validation.passwordValid && (
                <span className="text-red-500 text-xs ml-1">(min 6 characters)</span>
              )}
            </label>
            <div className={`relative transition-all duration-200 ${isFocused.password ? "transform scale-[1.01]" : ""}`}>
              <input
                id="password"
                name="password"
                type={passwordVisible ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                onFocus={() => handleFocus("password")}
                onBlur={() => handleBlur("password")}
                required
                minLength={6}
                className={`w-full px-4 py-3 rounded-lg bg-white border ${
                  validation.passwordValid ? "border-blue-100 focus:border-blue-400" : "border-red-300 focus:border-red-400"
                } focus:outline-none focus:ring-2 ${
                  validation.passwordValid ? "focus:ring-blue-200" : "focus:ring-red-200"
                } transition placeholder-blue-400/60 pr-10`}
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
            <div className="flex items-center mt-1">
              <div className={`h-1 flex-1 rounded-full mr-1 ${
                formData.password.length > 0 ? (formData.password.length < 3 ? "bg-red-400" : 
                formData.password.length < 6 ? "bg-yellow-400" : "bg-green-400") : "bg-gray-200"
              }`}></div>
              <div className={`h-1 flex-1 rounded-full mr-1 ${
                formData.password.length > 2 ? (formData.password.length < 6 ? "bg-yellow-400" : "bg-green-400") : "bg-gray-200"
              }`}></div>
              <div className={`h-1 flex-1 rounded-full mr-1 ${
                formData.password.length > 4 ? "bg-green-400" : "bg-gray-200"
              }`}></div>
              <div className={`h-1 flex-1 rounded-full ${
                formData.password.length > 5 ? "bg-green-400" : "bg-gray-200"
              }`}></div>
            </div>
          </div>
        </div>

        {/* Submit button with enhanced states */}
        <button
          type="submit"
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
            Sign Up
          </span>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
          <span className="absolute inset-0 bg-blue-700 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
        </button>

        {/* Login link with smooth transition */}
        <div className="text-center text-sm text-blue-900 animate-fadeInUp" style={{animationDelay: "0.5s"}}>
          <p>Already have an account?{" "}
            <a href="/login" className="font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200 underline-offset-2 hover:underline">
              Log in
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
            className="absolute text-blue-200 animate-float"
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