import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  HiBell,
  HiBellAlert,
  HiCalendar,
  HiBadgeCheck,
  HiUserGroup,
  HiInformationCircle,
  HiCheckCircle,
  HiMail,
} from 'react-icons/hi';
import { notificationAPI } from '../../utils/api';
import Skeleton from '../../components/common/Skeleton';
import toast from 'react-hot-toast';

const iconMap = {
  event: { icon: HiCalendar, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  certificate: { icon: HiBadgeCheck, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  volunteer: { icon: HiUserGroup, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
  info: { icon: HiInformationCircle, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800' },
  alert: { icon: HiBellAlert, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' },
  mail: { icon: HiMail, color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
  default: { icon: HiBell, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800' },
};

function getNotificationMeta(type) {
  return iconMap[type] || iconMap.default;
}

export default function InternNotifications() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await notificationAPI.getAll();
      const data = res.data?.data || res.data || [];
      setNotifications(data);
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setMarkingAll(true);
      await notificationAPI.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to mark all as read');
    } finally {
      setMarkingAll(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={markingAll}
            className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <HiCheckCircle className="w-4 h-4" />
            <span>{markingAll ? 'Marking...' : 'Mark all as read'}</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton type="card" count={5} />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16">
          <HiBell className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif, idx) => {
            const meta = getNotificationMeta(notif.type);
            const Icon = meta.icon;
            return (
              <motion.div
                key={notif._id || idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                onClick={() => !notif.read && handleMarkRead(notif._id)}
                className={`flex items-start space-x-4 p-4 rounded-xl border cursor-pointer transition-all ${
                  notif.read
                    ? 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                    : 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                }`}
              >
                <div className={`p-2 rounded-lg ${meta.bg} ${meta.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {notif.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {notif.message}
                      </p>
                    </div>
                    {!notif.read && (
                      <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">
                    {notif.createdAt
                      ? new Date(notif.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : ''}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
