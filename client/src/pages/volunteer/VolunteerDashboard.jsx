import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiCalendar,
  HiBadgeCheck,
  HiClock,
  HiUserGroup,
  HiAcademicCap,
} from 'react-icons/hi';
import { volunteerAPI, eventAPI, certificateAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import Skeleton from '../../components/common/Skeleton';
import toast from 'react-hot-toast';

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    eventsRegistered: 0,
    eventsAttended: 0,
    certificatesEarned: 0,
    totalHours: 0,
    profileCompletion: 0,
  });
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentCertificates, setRecentCertificates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashRes, eventsRes, certRes] = await Promise.all([
          volunteerAPI.getDashboard(),
          eventAPI.getMyEvents(),
          certificateAPI.getMyCertificates(),
        ]);

        const dashData = dashRes.data?.data || dashRes.data || {};
        setStats({
          eventsRegistered: dashData.eventsRegistered ?? 0,
          eventsAttended: dashData.eventsAttended ?? 0,
          certificatesEarned: dashData.certificatesEarned ?? 0,
          totalHours: dashData.totalHours ?? 0,
          profileCompletion: dashData.profileCompletion ?? 0,
        });

        const events = eventsRes.data?.data || eventsRes.data || [];
        setUpcomingEvents(
          events
            .filter((e) => e.status === 'registered' || e.status === 'upcoming')
            .slice(0, 5)
        );

        const certs = certRes.data?.data || certRes.data || [];
        setRecentCertificates(certs.slice(0, 3));
      } catch (err) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name || 'Volunteer'}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Here&apos;s your volunteering overview
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Skeleton type="card" count={4} />
        </div>
      ) : (
        <>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Profile Completion
              </span>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                {stats.profileCompletion}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.profileCompletion}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="bg-green-600 h-2.5 rounded-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard
              title="Events Registered"
              value={stats.eventsRegistered}
              icon={HiCalendar}
              color="blue"
            />
            <StatCard
              title="Events Attended"
              value={stats.eventsAttended}
              icon={HiUserGroup}
              color="green"
            />
            <StatCard
              title="Certificates Earned"
              value={stats.certificatesEarned}
              icon={HiBadgeCheck}
              color="purple"
            />
            <StatCard
              title="Total Hours"
              value={stats.totalHours}
              icon={HiClock}
              color="yellow"
            />
          </div>
        </>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center">
              <HiCalendar className="w-5 h-5 mr-2 text-gray-400" />
              My Events
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {loading ? (
              <Skeleton type="card" />
            ) : upcomingEvents.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">
                No upcoming events. Register for an event to get started!
              </p>
            ) : (
              upcomingEvents.map((event, idx) => (
                <motion.div
                  key={event._id || idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {event.date
                          ? new Date(event.date).getDate()
                          : '--'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {event.title || event.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {event.date
                          ? new Date(event.date).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : ''}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={event.status} />
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center">
              <HiAcademicCap className="w-5 h-5 mr-2 text-gray-400" />
              Recent Certificates
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {loading ? (
              <Skeleton type="card" />
            ) : recentCertificates.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">
                No certificates yet. Attend events to earn certificates!
              </p>
            ) : (
              recentCertificates.map((cert, idx) => (
                <motion.div
                  key={cert._id || idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <HiBadgeCheck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {cert.eventName || cert.event?.title || 'Certificate'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {cert.issuedAt || cert.createdAt
                          ? new Date(
                              cert.issuedAt || cert.createdAt
                            ).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : ''}
                      </p>
                    </div>
                  </div>
                  <HiBadgeCheck className="w-5 h-5 text-green-500" />
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
