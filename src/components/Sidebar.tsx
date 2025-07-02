'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FiCloud,FiHome, FiMapPin, FiUser, FiLogOut } from 'react-icons/fi';
import { signOut } from 'next-auth/react';

const navItems = [
    
  { href: '/dashboard', label: 'Dashboard', icon: <FiHome /> },
  { href: '/weather', label: 'Weather', icon: <FiCloud /> },
  { href: '/locations', label: 'Locations', icon: <FiMapPin /> },
  { href: '/profile', label: 'Profile', icon: <FiUser /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white shadow-md h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600">WeatherTrack</h1>
      </div>
      <nav className="mt-6 space-y-1">
        {navItems.map((item) => (
          <Link href={item.href} key={item.href}>
            <button
              className={`flex items-center w-full px-6 py-3 text-left transition-colors ${
                pathname === item.href
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </button>
          </Link>
        ))}
        <div className="mt-10 px-6">
          <button
            onClick={() => signOut({ callbackUrl: '/signin' })}
            className="flex items-center w-full px-4 py-3 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FiLogOut className="mr-3" />
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
}
