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
      router.push('/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-blue-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Profile</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-medium">
              {session?.user?.name
                ? session.user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                : 'U'}
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {session?.user?.name || 'Unknown User'}
            </h3>
            <p className="text-gray-500">{session?.user?.email || 'No email provided'}</p>
            <button className="mt-4 text-sm text-blue-600 hover:text-blue-800">
              Edit Profile
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
