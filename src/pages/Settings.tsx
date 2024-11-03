import React, { useState } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

export function Settings() {
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-indigo-100 rounded-full p-3">
              <SettingsIcon className="h-8 w-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-gray-700">Email notifications</span>
              </label>
              <p className="mt-1 text-sm text-gray-500">
                Receive email notifications when someone comments on your posts
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}