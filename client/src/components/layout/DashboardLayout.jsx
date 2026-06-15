import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { HiOutlineMenu, HiBell, HiSearch, HiChevronDown, HiSun, HiMoon } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Sidebar from './Sidebar';
import Footer from './Footer';

const pageTitleMap = {
  '/admin/dashboard': 'Dashboard',
  '/admin/volunteers': 'Volunteers',
  '/admin/internships': 'Internships',
  '/admin/events': 'Events',
  '/admin/certificates': 'Certificates',
  '/admin/analytics': 'Analytics',
  '/admin/settings': 'Settings',
  '/volunteer/dashboard': 'Dashboard',
  '/volunteer/events': 'My Events',
  '/volunteer/certificates': 'My Certificates',
  '/volunteer/notifications': 'Notifications',
  '/intern/dashboard': 'Dashboard',
  '/intern/application': 'Application Status',
  '/intern/tasks': 'Tasks',
  '/intern/notifications': 'Notifications',
  '/profile': 'Profile',
};

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const location = useLocation();

  const pageTitle = pageTitleMap[location.pathname] || 'Dashboard';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="lg:ml-64 pt-16 transition-all duration-300">
        {/* Top Bar */}
        <header className="sticky top-16 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Open sidebar"
            >
              <HiOutlineMenu className="w-5 h-5" />
            </button>
            <h1 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Bar */}
            <div className="hidden sm:flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-1.5">
              <HiSearch className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none w-40 lg:w-56"
              />
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {darkMode ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
            </button>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
              <HiBell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* User Avatar (always visible) */}
            <div className="flex sm:hidden items-center">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            </div>

            {/* User Info (desktop) */}
            <div className="hidden sm:flex items-center space-x-2 pl-2 border-l border-gray-200 dark:border-gray-700">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {user?.role || ''}
                </p>
              </div>
              <HiChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-3 sm:p-6 lg:p-8">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}
