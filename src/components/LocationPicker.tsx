"use client";

import { useState, useEffect } from "react";
import { Location } from "@/types/location";
interface Props {
  locations: Location[];
  onSelect: (location: Location) => void;
}

export default function LocationPicker({ locations, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<Location[]>([]);

  useEffect(() => {
    if (query.trim() === "") {
      setFiltered([]);
      return;
    }
    const lower = query.toLowerCase();
    setFiltered(
      locations.filter(
        (loc) =>
          loc.city.toLowerCase().includes(lower) ||
          loc.country.toLowerCase().includes(lower)
      )
    );
  }, [query, locations]);

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        className="w-full border border-gray-300 rounded px-3 py-2"
        placeholder="Search city or country..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {filtered.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-200 mt-1 w-full rounded shadow">
          {filtered.map((loc, idx) => (
            <li
              key={idx}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onSelect(loc);
                setQuery(`${loc.city}, ${loc.country}`);
                setFiltered([]);
              }}
            >
              {loc.city}, {loc.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
