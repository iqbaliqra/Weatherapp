'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FiCloud, FiHome, FiMapPin, FiUser, FiLogOut } from 'react-icons/fi';
import { signOut, useSession } from 'next-auth/react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: <FiHome /> },
  { href: '/weather', label: 'Weather', icon: <FiCloud /> },
  { href: '/locations', label: 'Locations', icon: <FiMapPin /> },
  { href: '/profile', label: 'Profile', icon: <FiUser /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="w-64 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 h-screen flex flex-col fixed">
      {/* Logo */}
      <div className="p-6 pb-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          WeatherTrack
        </h1>
        <p className="text-xs text-gray-400 mt-1">Your weather companion</p>
      </div>

      {/* Navigation Items + Logout */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link href={item.href} key={item.href} legacyBehavior>
            <a
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                pathname === item.href
                  ? 'text-white bg-gradient-to-r from-blue-500 to-cyan-400 shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span
                className={`mr-3 text-lg ${
                  pathname === item.href ? 'text-white' : 'text-gray-500'
                }`}
              >
                {item.icon}
              </span>
              {item.label}
              {pathname === item.href && (
                <span className="ml-auto w-2 h-2 bg-white rounded-full"></span>
              )}
            </a>
          </Link>
        ))}

        {/* Logout Button as a nav item */}
        <button
          onClick={() => signOut({ callbackUrl: '/register',session:null })}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors group"
        >
          <FiLogOut className="mr-3 text-lg text-gray-500 group-hover:text-red-500 transition-colors" />
          Logout
          <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-xs text-red-400">
            Click to sign out
          </span>
        </button>
      </nav>
    </div>
  );
}