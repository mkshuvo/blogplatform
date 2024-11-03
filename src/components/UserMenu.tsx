import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Link } from 'react-router-dom';
import { ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function UserMenu({ email }: { email: string }) {
  const { logout } = useAuth();

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center items-center gap-x-1.5 text-sm font-semibold text-gray-900">
          {email}
          <ChevronDown className="-mr-1 h-4 w-4 text-gray-400" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <Link
                  to="/profile"
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } flex px-4 py-2 text-sm text-gray-700 items-center`}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  to="/settings"
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } flex px-4 py-2 text-sm text-gray-700 items-center`}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={logout}
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } flex w-full px-4 py-2 text-sm text-gray-700 items-center`}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}