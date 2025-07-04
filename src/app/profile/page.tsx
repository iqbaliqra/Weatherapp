'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/register');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Determine subscription status and plan
  const subscriptionStatus = session?.user?.subscription_status || "INACTIVE";
  const subscriptionPlan = subscriptionStatus === "ACTIVE" ? "Premium" : "Free";
  

  const handleManageSubscription = async () => {
    const res = await fetch("/api/create-portal-session", { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } else {
      alert("Failed to load subscription management portal.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">User Profile</h1>
            <p className="text-gray-600">View your account information</p>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Profile Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold mr-4">
                    {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {session?.user?.name || 'Unknown User'}
                    </h2>
                    <p className="text-gray-600">{session?.user?.email}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Subscription: {subscriptionStatus}
                    </p>
                  </div>
                </div>

                {/* SHOW BUTTON ONLY IF SUBSCRIPTION IS ACTIVE */}
                {subscriptionStatus==="ACTIVE" && (
                  <button
                    onClick={handleManageSubscription}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-150 ease-in-out"
                  >
                    Manage Subscription
                  </button>
                )}
              </div>
            </div>

            {/* User Details */}
            <div className="divide-y divide-gray-200">
              <div className="px-6 py-5">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Full Name
                    </label>
                    <p className="text-gray-800">
                      {session?.user?.name || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Email Address
                    </label>
                    <p className="text-gray-800">
                      {session?.user?.email || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Subscription Status
                    </label>
                    <p
                      className={
                        subscriptionStatus === "ACTIVE"
                          ? "text-green-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                    >
                      {subscriptionStatus}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Subscription Plan
                    </label>
                    <p className="text-gray-800">
                      {subscriptionPlan}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
