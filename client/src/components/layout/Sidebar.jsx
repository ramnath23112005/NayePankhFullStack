import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiHome,
  HiUserGroup,
  HiAcademicCap,
  HiCalendar,
  HiBadgeCheck,
  HiChartBar,
  HiCog,
  HiBell,
  HiClipboardList,
  HiDocumentText,
  HiBriefcase,
  HiX,
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

const adminNav = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: HiHome },
  { label: 'Volunteers', path: '/admin/volunteers', icon: HiUserGroup },
  { label: 'Internships', path: '/admin/internships', icon: HiAcademicCap },
  { label: 'Events', path: '/admin/events', icon: HiCalendar },
  { label: 'Certificates', path: '/admin/certificates', icon: HiBadgeCheck },
  { label: 'Analytics', path: '/admin/analytics', icon: HiChartBar },
  { label: 'Settings', path: '/admin/settings', icon: HiCog },
];

const volunteerNav = [
  { label: 'Dashboard', path: '/volunteer/dashboard', icon: HiHome },
  { label: 'My Events', path: '/volunteer/events', icon: HiCalendar },
  { label: 'My Certificates', path: '/volunteer/certificates', icon: HiBadgeCheck },
  { label: 'Notifications', path: '/volunteer/notifications', icon: HiBell },
];

const internNav = [
  { label: 'Dashboard', path: '/intern/dashboard', icon: HiHome },
  { label: 'Application Status', path: '/intern/application', icon: HiClipboardList },
  { label: 'Tasks', path: '/intern/tasks', icon: HiBriefcase },
  { label: 'Notifications', path: '/intern/notifications', icon: HiBell },
];

const roleNavMap = {
  admin: adminNav,
  volunteer: volunteerNav,
  intern: internNav,
};

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = user ? roleNavMap[user.role] || [] : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black z-40 lg:hidden"
        />
      )}
      <motion.aside
        initial={false}
        animate={{
          width: isOpen ? 256 : 0,
          x: isOpen ? 0 : -256,
        }}
        transition={{ type: 'tween', duration: 0.3 }}
        className={`fixed top-16 left-0 bottom-0 z-50 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-hidden ${
          isOpen ? 'lg:w-64' : 'lg:w-64'
        }`}
      >
        <div className="w-64 h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200 dark:border-gray-700">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">NP</span>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                NayePankh
              </span>
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          {user && (
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {user.role}
              </p>
            </div>
          )}
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
