import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User } from 'lucide-react';

export function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-100 rounded-full p-3">
              <User className="h-12 w-12 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}