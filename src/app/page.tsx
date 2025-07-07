"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-xl w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Your App 🎉</h1>
        <p className="text-gray-600 mb-6">
          This is your Next.js app with Google Authentication.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="bg-blue-600 text-white font-medium px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Get Started
        </button>
      </div>
    </main>
  );
}
