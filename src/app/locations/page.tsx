'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { FiPlus, FiX } from 'react-icons/fi';
import { Location } from '@/types/location';
import LocationPicker from '@/components/LocationPicker';

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [selectedLocation, setSelectedLocation] = useState<{
    city: string;
    country: string;
    lat: number | null;
    lng: number | null;
  } | null>(null);

  // Fetch existing locations on mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch('/api/locations');
        if (!res.ok) {
          throw new Error('Failed to load locations');
        }
        const data = await res.json();
        setLocations(data);
      } catch (err) {
        console.error(err);
        alert('Error loading locations');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const handleAddLocation = async () => {
    if (!selectedLocation) {
      alert('Please select a location first.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: selectedLocation.city,
          country: selectedLocation.country,
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || 'Error adding location.');
        return;
      }

      const newLocation = await res.json();
      setLocations((prev) => [...prev, newLocation]);
      setSelectedLocation(null);
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveLocation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this location?')) return;

    try {
      const res = await fetch(`/api/locations/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || 'Error deleting location.');
        return;
      }

      setLocations((prev) => prev.filter((loc) => loc.id !== id));
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Manage Locations</h2>

        <div className="bg-white rounded-lg shadow p-6 mb-6 space-y-4">
          <LocationPicker onSelectLocation={setSelectedLocation} />

          {selectedLocation && (
            <div className="text-gray-700 text-sm">
              Selected: {selectedLocation.city}, {selectedLocation.country}
            </div>
          )}

          <button
            onClick={handleAddLocation}
            disabled={loading}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <FiPlus className="mr-2" />
            {loading ? 'Adding...' : 'Add Location'}
          </button>
        </div>

        {initialLoading ? (
          <div className="text-gray-600">Loading locations...</div>
        ) : locations.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {locations.map((loc) => (
                  <tr key={loc.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {loc.city}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {loc.country}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => handleRemoveLocation(loc.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiX />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-gray-600">No locations added yet.</div>
        )}
      </main>
    </div>
  );
}
