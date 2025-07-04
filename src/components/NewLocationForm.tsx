"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import LocationSearch from "@/components/LocationPicker";
import locationsData from "@/app/data/location_mock_data.json";
import { Location } from "@/types/location";
import { signOut } from "next-auth/react";
export default function NewLocationForm() {
  const { data: session, status } = useSession();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [savedLocations, setSavedLocations] = useState<Location[]>([]);

  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchLocations = async () => {
      const res = await fetch("/api/locations");
      if (res.ok) {
        const data = await res.json();
        setSavedLocations(data);
      }
    };
    fetchLocations();
  }, [status]);

  const handleAddLocation = async () => {
    if (!selectedLocation) {
      alert("Please select a location first.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/locations", {
      method: "POST",
      body: JSON.stringify(selectedLocation),
    });
    setLoading(false);

    if (res.ok) {
      const newLoc = await res.json();
      setSavedLocations((prev) => [...prev, newLoc]);
      setSelectedLocation(null);
    } else {
      alert("Error saving location.");
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-blue-200 rounded mb-4"></div>
          <div className="text-blue-500">Loading your weather data...</div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="max-w-md mx-auto mt-16 p-6 bg-gradient-to-br from-yellow-50 to-amber-100 rounded-xl shadow-lg border border-amber-200">
        <div className="flex items-center mb-4">
          <svg className="w-8 h-8 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-bold text-amber-800">Access Required</h2>
        </div>
        <p className="text-amber-700 mb-4">You must be logged in to manage your weather locations.</p>
        <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg shadow hover:shadow-md transition"   onClick={() => signOut({ callbackUrl: '/login' })}>
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 md:p-8 text-white shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Weather Locations</h1>
        <p className="opacity-90">Manage your favorite locations for weather tracking</p>
      </div>

      {/* Search & Add Location */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search & Add Location
          </h2>
        </div>
        <div className="p-6">
          <LocationSearch
            locations={locationsData}
            onSelect={(loc) => setSelectedLocation(loc)}
          />

          {selectedLocation && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-center">
              <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium">{selectedLocation.city}, {selectedLocation.country}</span>
            </div>
          )}

          <button
            onClick={handleAddLocation}
            disabled={loading || !selectedLocation}
            className={`mt-6 w-full md:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-lg shadow-md text-white transition-all
              ${!selectedLocation ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'}
              ${loading ? 'opacity-70' : ''}`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Location
              </>
            )}
          </button>
        </div>
      </div>

      {/* Saved Locations */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4 md:mb-0">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            Your Saved Locations
          </h2>
          <a
            href="/weather"
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition text-white bg-gradient-to-r from-blue-500 to-cyan-500 shadow-md hover:from-blue-600 hover:to-cyan-600"
          >
            <svg className="w-4 h-4 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            View Weather Dashboard
          </a>
        </div>

        <div className="p-6">
          {savedLocations.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No locations saved</h3>
              <p className="mt-1 text-gray-500">Search and add locations to track their weather.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-blue-500 to-cyan-500">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      City
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Country
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {savedLocations.map((loc) => (
                    <tr key={loc.id || `${loc.city}-${loc.country}`} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{loc.city}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{loc.country}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}