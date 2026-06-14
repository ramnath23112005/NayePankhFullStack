import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiUserGroup,
  HiUserAdd,
  HiCalendar,
  HiBadgeCheck,
  HiAcademicCap,
  HiClipboardList,
} from 'react-icons/hi';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { analyticsAPI } from '../../utils/api';
import StatCard from '../../components/common/StatCard';
import Skeleton from '../../components/common/Skeleton';
import toast from 'react-hot-toast';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
const PIE_COLORS = {
  pending: '#F59E0B',
  'under-review': '#3B82F6',
  approved: '#10B981',
  rejected: '#EF4444',
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-semibold" style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
        </p>
      ))}
    </div>
  );
}

const chartVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [volunteerGrowth, setVolunteerGrowth] = useState([]);
  const [eventParticipation, setEventParticipation] = useState([]);
  const [internshipStats, setInternshipStats] = useState([]);
  const [popularEvents, setPopularEvents] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [dash, growth, participation, internship, popular] = await Promise.all([
          analyticsAPI.getDashboard(),
          analyticsAPI.getVolunteerGrowth(),
          analyticsAPI.getEventParticipation(),
          analyticsAPI.getInternshipStats(),
          analyticsAPI.getPopularEvents(),
        ]);

        const dd = dash.data?.data || dash.data || {};
        setStats({
          totalVolunteers: dd.totalVolunteers ?? 0,
          activeVolunteers: dd.activeVolunteers ?? 0,
          totalEvents: dd.totalEvents ?? 0,
          certificatesGenerated: dd.certificatesGenerated ?? 0,
          totalInternships: dd.totalInternships ?? 0,
          pendingReviews: dd.pendingReviews ?? 0,
        });

        setVolunteerGrowth(Array.isArray(growth.data?.data?.months) ? growth.data.data.months : Array.isArray(growth.data?.data) ? growth.data.data : []);
        setEventParticipation(Array.isArray(participation.data?.data) ? participation.data.data : []);
        setInternshipStats(Array.isArray(internship.data?.data) ? internship.data.data : internship.data?.data?.statusCounts ? Object.entries(internship.data.data.statusCounts).map(([name, value]) => ({ name, value })) : []);
        setPopularEvents(Array.isArray(popular.data?.data) ? popular.data.data : []);
      } catch {
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const statCards = [
    { title: 'Total Volunteers', value: stats.totalVolunteers, icon: HiUserGroup, color: 'green' },
    { title: 'Active Volunteers', value: stats.activeVolunteers, icon: HiUserAdd, color: 'blue' },
    { title: 'Total Events', value: stats.totalEvents, icon: HiCalendar, color: 'yellow' },
    { title: 'Certificates', value: stats.certificatesGenerated, icon: HiBadgeCheck, color: 'purple' },
    { title: 'Internships', value: stats.totalInternships, icon: HiAcademicCap, color: 'indigo' },
    { title: 'Pending Reviews', value: stats.pendingReviews, icon: HiClipboardList, color: 'red' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Comprehensive insights and performance metrics
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton type="card" count={6} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((card, idx) => (
            <StatCard key={idx} {...card} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <>
            <Skeleton type="chart" />
            <Skeleton type="chart" />
            <Skeleton type="chart" />
            <Skeleton type="chart" />
          </>
        ) : (
          <>
            <motion.div
              custom={0}
              variants={chartVariants}
              initial="hidden"
              animate="visible"
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
                  <Line type="monotone" dataKey="volunteers" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} name="Total Volunteers" />
                  <Line type="monotone" dataKey="new" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} name="New Registrations" />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              custom={1}
              variants={chartVariants}
              initial="hidden"
              animate="visible"
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
            >
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Event Participation
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

            <motion.div
              custom={2}
              variants={chartVariants}
              initial="hidden"
              animate="visible"
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
            >
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Internship Application Statistics
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={internshipStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {internshipStats.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={PIE_COLORS[entry.name?.toLowerCase().replace(/\s+/g, '-')] || '#9CA3AF'}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              custom={3}
              variants={chartVariants}
              initial="hidden"
              animate="visible"
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
            >
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Most Popular Events
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={popularEvents} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} stroke="#9CA3AF" width={120} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="registrations" fill="#8B5CF6" radius={[0, 4, 4, 0]} name="Registrations" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
}
