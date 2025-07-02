'use client';

import { useState } from 'react';
import PlacesAutocomplete, { geocodeByPlaceId } from 'react-google-places-autocomplete';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

interface LocationPickerProps {
  onSelectLocation?: (location: {
    city: string;
    country: string;
    lat: number;
    lng: number;
  }) => void;
}

const containerStyle = {
  width: '100%',
  height: '300px',
};

export default function LocationPicker({ onSelectLocation }: LocationPickerProps) {
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: 52.52, lng: 13.405 });
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    libraries: ['places'],
  });

  const handleSelect = async (selected: string, placeId: string) => {
    setAddress(selected);

    try {
      const results = await geocodeByPlaceId(placeId);
      if (results.length > 0) {
        const location = results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        setCoordinates({ lat, lng });

        let cityName = '';
        let countryName = '';

        results[0].address_components.forEach((component) => {
          if (component.types.includes('locality')) {
            cityName = component.long_name;
          }
          if (component.types.includes('country')) {
            countryName = component.long_name;
          }
        });

        if (!cityName) {
          const adminComponent = results[0].address_components.find((c) =>
            c.types.includes('administrative_area_level_1')
          );
          if (adminComponent) {
            cityName = adminComponent.long_name;
          }
        }

        setCity(cityName);
        setCountry(countryName);

        if (onSelectLocation) {
          onSelectLocation({
            city: cityName,
            country: countryName,
            lat,
            lng,
          });
        }
      }
    } catch (err) {
      console.error('Error during geocoding', err);
    }
  };

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="space-y-4">
      <PlacesAutocomplete
        value={address}
        onChange={setAddress}
        onSelect={(value: string, placeId: string) => handleSelect(value, placeId)}
        searchOptions={{ types: ['(cities)'] }}
      >
        {({
          getInputProps,
          suggestions,
          getSuggestionItemProps,
          loading,
        }: {
          getInputProps: any;
          suggestions: any;
          getSuggestionItemProps: any;
          loading: boolean;
        }) => (
          <div className="relative">
            <input
              {...getInputProps({
                placeholder: 'Search for a city...',
                className:
                  'w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500',
              })}
            />
            <div className="absolute bg-white border border-gray-200 w-full z-10 rounded shadow">
              {loading && <div className="p-2 text-gray-500">Loading...</div>}
              {suggestions.map((suggestion: any) => (
                <div
                  {...getSuggestionItemProps(suggestion)}
                  className={`p-2 cursor-pointer hover:bg-gray-100 ${
                    suggestion.active ? 'bg-gray-100' : ''
                  }`}
                  key={suggestion.placeId}
                >
                  {suggestion.description}
                </div>
              ))}
            </div>
          </div>
        )}
      </PlacesAutocomplete>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={coordinates}
        zoom={10}
      >
        <Marker position={coordinates} />
      </GoogleMap>

      {city && country && (
        <div className="text-sm text-gray-700">
          <strong>Selected Location:</strong> {city}, {country}
        </div>
      )}
    </div>
  );
}
