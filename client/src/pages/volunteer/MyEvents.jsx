import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiCalendar,
  HiClock,
  HiLocationMarker,
  HiX,
  HiExclamationCircle,
} from 'react-icons/hi';
import { eventAPI } from '../../utils/api';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import Skeleton from '../../components/common/Skeleton';
import toast from 'react-hot-toast';

const tabs = ['upcoming', 'past'];

export default function MyEvents() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [cancelModal, setCancelModal] = useState({ open: false, event: null });
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await eventAPI.getMyEvents();
        const data = res.data?.data || res.data || [];
        setEvents(data);
      } catch (err) {
        toast.error('Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const now = new Date();
  const filtered = events.filter((event) => {
    const eventDate = new Date(event.date);
    if (activeTab === 'upcoming') return eventDate >= now || event.status === 'registered';
    return eventDate < now && event.status !== 'registered';
  });

  const handleCancel = async () => {
    if (!cancelModal.event) return;
    try {
      setCancelling(true);
      await eventAPI.cancel(cancelModal.event._id);
      setEvents((prev) =>
        prev.map((e) =>
          e._id === cancelModal.event._id ? { ...e, status: 'cancelled' } : e
        )
      );
      toast.success('Registration cancelled');
      setCancelModal({ open: false, event: null });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel registration');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Events</h1>

      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {tab === 'upcoming' ? 'Upcoming Events' : 'Past Events'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton type="card" count={4} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <HiCalendar className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {activeTab === 'upcoming'
              ? 'No upcoming events. Browse events to register!'
              : 'No past events found.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {filtered.map((event, idx) => (
              <motion.div
                key={event._id || idx}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    {event.title || event.name}
                  </h3>
                  <StatusBadge status={event.status} />
                </div>

                <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <HiCalendar className="w-4 h-4 flex-shrink-0" />
                    <span>
                      {event.date
                        ? new Date(event.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                        : 'TBD'}
                    </span>
                  </div>
                  {event.time && (
                    <div className="flex items-center space-x-2">
                      <HiClock className="w-4 h-4 flex-shrink-0" />
                      <span>{event.time}</span>
                    </div>
                  )}
                  {event.venue && (
                    <div className="flex items-center space-x-2">
                      <HiLocationMarker className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{event.venue}</span>
                    </div>
                  )}
                </div>

                {activeTab === 'upcoming' && event.status === 'registered' && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <button
                      onClick={() => setCancelModal({ open: true, event })}
                      className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors"
                    >
                      Cancel Registration
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Modal
        isOpen={cancelModal.open}
        onClose={() => setCancelModal({ open: false, event: null })}
        title="Cancel Registration"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <HiExclamationCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Are you sure you want to cancel your registration for{' '}
              <strong className="text-gray-900 dark:text-white">
                {cancelModal.event?.title || cancelModal.event?.name}
              </strong>
              ?
            </p>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button
              onClick={() => setCancelModal({ open: false, event: null })}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Keep Registration
            </button>
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
            </button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
