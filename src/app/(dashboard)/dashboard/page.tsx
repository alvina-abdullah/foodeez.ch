'use client';

import { useSession } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">
        Welcome back, {session?.user?.name}!
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="bg-primary-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-primary-900">Profile Status</h3>
          <p className="mt-2 text-sm text-primary-700">
            Your profile is complete
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-green-900">Account Type</h3>
          <p className="mt-2 text-sm text-green-700">
            Standard Account
          </p>
        </div>
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900">Last Login</h3>
          <p className="mt-2 text-sm text-blue-700">
            {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
} 