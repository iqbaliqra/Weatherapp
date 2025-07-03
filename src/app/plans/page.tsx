"use client";

import { useRouter } from "next/navigation";

export default function PlansPage() {
  const router = useRouter();

  const handleFree = async () => {
    const res = await fetch("/api/activate-free-plan", { method: "POST" });
    if (res.ok) {
      router.push("/dashboard");
    }
  };

  const handlePremium = async () => {
    const res = await fetch("/api/stripe/create-checkout-session", { method: "POST" });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Choose Your Plan
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Select the plan that works best for you
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
          {/* Free Plan Card */}
          <div className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white transform transition-all hover:scale-105 hover:shadow-xl">
            <div className="px-6 py-8 sm:p-10 sm:pb-6">
              <div className="flex items-center justify-between">
                <h3 className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-green-100 text-green-600">
                  Free Plan
                </h3>
                <div className="mt-1 flex items-baseline text-4xl font-extrabold text-gray-900">
                  $0<span className="ml-1 text-lg font-medium text-gray-500">/mo</span>
                </div>
              </div>
              <p className="mt-4 text-lg text-gray-500">
                Perfect for getting started
              </p>
              <div className="mt-6">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-gray-700">Basic features</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-gray-700">Limited access</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-gray-700">Community support</p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-gray-50 sm:p-10 sm:pt-6">
              <button
                onClick={handleFree}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
              >
                Get started for free
              </button>
            </div>
          </div>

          {/* Premium Plan Card */}
          <div className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white transform transition-all hover:scale-105 hover:shadow-xl border-2 border-blue-500">
            <div className="px-6 py-8 sm:p-10 sm:pb-6">
              <div className="flex items-center justify-between">
                <h3 className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-blue-100 text-blue-600">
                  Premium
                </h3>
                <div className="mt-1 flex items-baseline text-4xl font-extrabold text-gray-900">
                  $10<span className="ml-1 text-lg font-medium text-gray-500">/mo</span>
                </div>
              </div>
              <p className="mt-4 text-lg text-gray-500">
                Best for professionals
              </p>
              <div className="mt-6">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-gray-700">All free features</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-gray-700">Advanced tools</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-gray-700">Priority support</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-gray-700">Exclusive content</p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-gray-50 sm:p-10 sm:pt-6">
              <button
                onClick={handlePremium}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              >
                Upgrade to Premium
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-500">
            Need help choosing? <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">Contact us</a>
          </p>
        </div>
      </div>
    </main>
  );
}