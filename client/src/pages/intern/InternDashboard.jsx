import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiClipboardCheck,
  HiBadgeCheck,
  HiClock,
  HiDocumentReport,
  HiCheckCircle,
  HiXCircle,
  HiClock as HiPending,
} from 'react-icons/hi';
import { internshipAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';
import Skeleton from '../../components/common/Skeleton';
import toast from 'react-hot-toast';

const statusSteps = [
  { key: 'pending', label: 'Applied', icon: HiDocumentReport },
  { key: 'under-review', label: 'Under Review', icon: HiClock },
  { key: 'approved', label: 'Approved', icon: HiCheckCircle },
  { key: 'rejected', label: 'Rejected', icon: HiXCircle },
];

const stepColors = {
  pending: 'border-yellow-400 text-yellow-500',
  'under-review': 'border-blue-400 text-blue-500',
  approved: 'border-green-400 text-green-500',
  rejected: 'border-red-400 text-red-500',
};

export default function InternDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState({
    applicationStatus: '',
    overallProgress: 0,
    tasks: [],
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await internshipAPI.getDashboard();
        const data = res.data?.data || res.data || {};
        setDashboard({
          applicationStatus: data.applicationStatus || 'pending',
          overallProgress: data.overallProgress ?? 0,
          tasks: data.tasks || [],
        });
      } catch (err) {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const currentStatus = dashboard.applicationStatus?.toLowerCase().replace(/\s+/g, '-') || 'pending';
  const currentStepIdx = statusSteps.findIndex((s) => s.key === currentStatus);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name || 'Intern'}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Track your internship journey
        </p>
      </div>

      {loading ? (
        <>
          <Skeleton type="card" />
          <Skeleton type="card" />
        </>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <HiClipboardCheck className="w-5 h-5 mr-2 text-gray-400" />
              Application Status
            </h3>
            <div className="flex items-center justify-between relative">
              {statusSteps.map((step, idx) => {
                const StepIcon = step.icon;
                const isActive = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                const isRejected = currentStatus === 'rejected';
                const isPast = idx < currentStepIdx;

                return (
                  <div key={step.key} className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                        isActive
                          ? isCurrent && currentStatus === 'rejected'
                            ? 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-500'
                            : isRejected && idx >= statusSteps.findIndex((s) => s.key === 'approved')
                              ? 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-400'
                              : `${stepColors[step.key]} bg-white dark:bg-gray-900`
                          : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-400'
                      }`}
                    >
                      <StepIcon className="w-5 h-5" />
                    </div>
                    <p
                      className={`mt-2 text-xs font-medium text-center ${
                        isActive && !(isRejected && keyAfterRejected(idx))
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              })}
              <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 z-0">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{
                    width: currentStatus === 'rejected'
                      ? `${((statusSteps.findIndex((s) => s.key === 'under-review') + 1) / (statusSteps.length - 1)) * 100}%`
                      : `${(currentStepIdx / (statusSteps.length - 1)) * 100}%`,
                  }}
                  className={`h-full transition-all ${
                    currentStatus === 'rejected' ? 'bg-red-500' : 'bg-green-500'
                  }`}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center">
                <HiBadgeCheck className="w-5 h-5 mr-2 text-gray-400" />
                Overall Progress
              </h3>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                {dashboard.overallProgress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${dashboard.overallProgress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="bg-green-600 h-3 rounded-full"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center">
                <HiDocumentReport className="w-5 h-5 mr-2 text-gray-400" />
                Assigned Tasks
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {dashboard.tasks.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No tasks assigned yet</p>
              ) : (
                dashboard.tasks.map((task, idx) => (
                  <motion.div
                    key={task._id || idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {task.title}
                      </p>
                      {task.deadline && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          Due: {new Date(task.deadline).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      )}
                    </div>
                    <StatusBadge status={task.status} />
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
