import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiUserGroup,
  HiUserAdd,
  HiCalendar,
  HiBadgeCheck,
  HiClock,
  HiUserCircle,
  HiClipboardCheck,
  HiMail,
} from 'react-icons/hi';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { analyticsAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/common/StatCard';
import Skeleton from '../../components/common/Skeleton';
import toast from 'react-hot-toast';

function RecentActivity({ activities = [] }) {
  const iconMap = {
    volunteer_approved: { icon: HiUserCircle, color: 'text-green-500' },
    event_created: { icon: HiCalendar, color: 'text-blue-500' },
    certificate_generated: { icon: HiBadgeCheck, color: 'text-purple-500' },
    internship_applied: { icon: HiClipboardCheck, color: 'text-yellow-500' },
    email_sent: { icon: HiMail, color: 'text-indigo-500' },
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 h-full">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center">
          <HiClock className="w-5 h-5 mr-2 text-gray-400" />
          Recent Activity
        </h3>
      </div>
      <div className="p-6 space-y-4">
        {activities.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No recent activity</p>
        ) : (
          activities.map((item, idx) => {
            const meta = iconMap[item.type] || { icon: HiClock, color: 'text-gray-400' };
            const Icon = meta.icon;
            return (
              <motion.div
                key={item._id || idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-start space-x-3"
              >
                <div className={`p-2 rounded-lg bg-gray-50 dark:bg-gray-800 ${meta.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                    {item.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : ''}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-semibold" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVolunteers: 0,
    activeVolunteers: 0,
    totalEvents: 0,
    certificatesGenerated: 0,
  });
  const [volunteerGrowth, setVolunteerGrowth] = useState([]);
  const [eventParticipation, setEventParticipation] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashRes, growthRes, participationRes] = await Promise.all([
          analyticsAPI.getDashboard(),
          analyticsAPI.getVolunteerGrowth(),
          analyticsAPI.getEventParticipation(),
        ]);

        const dashData = dashRes.data?.data || dashRes.data || {};
        setStats({
          totalVolunteers: dashData.totalVolunteers ?? 0,
          activeVolunteers: dashData.activeVolunteers ?? 0,
          totalEvents: dashData.totalEvents ?? 0,
          certificatesGenerated: dashData.certificatesGenerated ?? 0,
        });
        setRecentActivities(dashData.recentActivities || dashData.recentActivity || []);
        setVolunteerGrowth(Array.isArray(growthRes.data?.data) ? growthRes.data.data : growthRes.data?.data?.months || []);
        setEventParticipation(Array.isArray(participationRes.data?.data) ? participationRes.data.data : []);
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
          Welcome back, {user?.name || 'Admin'}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Here&apos;s what&apos;s happening with NayePankh Foundation
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

          <Skeleton type="card" count={4} />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title="Total Volunteers"
            value={stats.totalVolunteers}
            icon={HiUserGroup}
            color="green"
          />
          <StatCard
            title="Active Volunteers"
            value={stats.activeVolunteers}
            icon={HiUserAdd}
            color="blue"
          />
          <StatCard
            title="Total Events"
            value={stats.totalEvents}
            icon={HiCalendar}
            color="yellow"
          />
          <StatCard
            title="Certificates Generated"
            value={stats.certificatesGenerated}
            icon={HiBadgeCheck}
            color="purple"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <>
              <Skeleton type="chart" />
              <Skeleton type="chart" />
            </>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
              >
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                  Monthly Volunteer Growth
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={volunteerGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="volunteers"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ r: 4, fill: '#10B981' }}
                      name="Volunteers"
                    />
                    <Line
                      type="monotone"
                      dataKey="new"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={{ r: 4, fill: '#3B82F6' }}
                      name="New Registrations"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
              >
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                  Event Participation Trends
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={eventParticipation}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="registered" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Registered" />
                    <Bar dataKey="attended" fill="#10B981" radius={[4, 4, 0, 0]} name="Attended" />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </>
          )}
        </div>

        <div className="lg:col-span-1">
          {loading ? (
            <Skeleton type="card" />
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="h-full"
            >
              <RecentActivity activities={recentActivities} />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
