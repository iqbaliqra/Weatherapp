"use client";

import { useState } from "react";

export default function PricingPage() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    const res = await fetch("/api/stripe/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        priceId: "price_XXXX", // Replace with your Stripe Price ID
      }),
    });

    const data = await res.json();
    if (data.sessionId) {
      window.location.href = `https://checkout.stripe.com/pay/${data.sessionId}`;
    } else {
      alert("Error creating checkout session.");
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-center mb-8">Choose Your Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Free Plan */}
        <div className="border rounded-lg p-6 flex flex-col">
          <h2 className="text-2xl font-semibold mb-2">Free</h2>
          <p className="text-gray-600 mb-4">Basic access to weather forecasts.</p>
          <ul className="space-y-2 text-sm text-gray-700 mb-6">
            <li> 5-day forecasts</li>
            <li> Basic weather info</li>
            <li> No weather alerts</li>
            <li> No historical data</li>
          </ul>
          <button
            disabled
            className="mt-auto bg-gray-300 text-gray-600 py-2 px-4 rounded cursor-not-allowed"
          >
            Current Plan
          </button>
        </div>

        {/* Premium Plan */}
        <div className="border rounded-lg p-6 flex flex-col">
          <h2 className="text-2xl font-semibold mb-2">Premium</h2>
          <p className="text-gray-600 mb-4">
            Unlock all premium weather features.
          </p>
          <ul className="space-y-2 text-sm text-gray-700 mb-6">
            <li> 10-day forecasts</li>
            <li> Weather alerts</li>
            <li> Historical data</li>
            <li> Priority support</li>
          </ul>
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className={`mt-auto py-2 px-4 rounded ${
              loading
                ? "bg-blue-300 cursor-wait"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Redirecting..." : "Subscribe for $10/month"}
          </button>
        </div>
      </div>
    </main>
  );
}
