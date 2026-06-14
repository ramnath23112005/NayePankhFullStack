import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiCalendar,
  HiClock,
  HiLocationMarker,
  HiUserGroup,
  HiFilter,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import { eventAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import Skeleton from '../../components/common/Skeleton';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: 'easeOut' },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Completed', value: 'completed' },
];

export default function Events() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [registering, setRegistering] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await eventAPI.getAll();
      setEvents(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((event) => {
    if (activeFilter === 'all') return true;
    const now = new Date();
    const eventDate = new Date(event.date);
    if (activeFilter === 'upcoming') return eventDate >= now;
    if (activeFilter === 'completed') return eventDate < now;
    return true;
  });

  const handleRegister = async (eventId) => {
    if (!user) {
      toast.error('Please login to register for events');
      navigate('/login');
      return;
    }
    try {
      setRegistering(eventId);
      await eventAPI.register(eventId);
      toast.success('Successfully registered for the event!');
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(null);
    }
  };

  const getCapacityPercentage = (event) => {
    if (!event.capacity) return 0;
    const registered = event.registeredCount || 0;
    return Math.min(Math.round((registered / event.capacity) * 100), 100);
  };

  const isEventPast = (date) => {
    return new Date(date) < new Date();
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-600 via-green-700 to-green-900 text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-6xl font-extrabold mb-4"
            >
              Events & <span className="text-green-200">Activities</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-lg md:text-xl text-green-100 max-w-3xl mx-auto leading-relaxed"
            >
              Participate in our events, drives, and community activities. Every
              contribution brings us closer to a better world.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 overflow-x-auto">
            <HiFilter className="w-5 h-5 text-gray-400 flex-shrink-0" />
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeFilter === filter.value
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900/50 min-h-[400px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Skeleton type="card" count={6} />
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20">
              <HiCalendar className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400">
                No events found
              </h3>
              <p className="text-gray-400 dark:text-gray-500 mt-2">
                Check back later for upcoming events.
              </p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredEvents.map((event) => {
                const capacityPercent = getCapacityPercentage(event);
                const past = isEventPast(event.date);
                return (
                  <motion.div
                    key={event._id}
                    variants={fadeUp}
                    className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 group hover:shadow-xl transition-all"
                  >
                    <div className={`h-40 flex items-center justify-center ${
                      past
                        ? 'bg-gray-400 dark:bg-gray-600'
                        : 'bg-gradient-to-br from-green-400 to-green-700'
                    }`}>
                      <HiCalendar className={`w-12 h-12 ${past ? 'text-gray-300' : 'text-white/60'}`} />
                      {past && (
                        <span className="absolute bg-gray-800/70 text-white text-xs font-semibold px-3 py-1 rounded-full">
                          Completed
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                        {event.title}
                      </h3>
                      <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center">
                          <HiCalendar className="w-4 h-4 mr-2 flex-shrink-0" />
                          {new Date(event.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                        {event.time && (
                          <div className="flex items-center">
                            <HiClock className="w-4 h-4 mr-2 flex-shrink-0" />
                            {event.time}
                          </div>
                        )}
                        {event.venue && (
                          <div className="flex items-center">
                            <HiLocationMarker className="w-4 h-4 mr-2 flex-shrink-0" />
                            {event.venue}
                          </div>
                        )}
                      </div>
                      {event.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                          {event.description}
                        </p>
                      )}
                      {/* Capacity */}
                      {event.capacity && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 mb-1">
                            <span className="flex items-center">
                              <HiUserGroup className="w-3.5 h-3.5 mr-1" />
                              Capacity
                            </span>
                            <span>{event.registeredCount || 0}/{event.capacity}</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                capacityPercent >= 90
                                  ? 'bg-red-500'
                                  : capacityPercent >= 60
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500'
                              }`}
                              style={{ width: `${capacityPercent}%` }}
                            />
                          </div>
                        </div>
                      )}
                      {!past && (
                        <button
                          onClick={() => handleRegister(event._id)}
                          disabled={registering === event._id}
                          className={`w-full py-2.5 rounded-xl font-medium text-sm transition-colors ${
                            user
                              ? 'bg-green-600 text-white hover:bg-green-700 disabled:opacity-50'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {registering === event._id
                            ? 'Registering...'
                            : user
                              ? 'Register Now'
                              : 'Login to Register'}
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
