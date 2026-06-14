import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiDocumentReport,
  HiClock,
  HiCheckCircle,
  HiXCircle,
  HiUser,
  HiMail,
  HiAcademicCap,
  HiBriefcase,
  HiCalendar,
  HiStar,
} from 'react-icons/hi';
import { internshipAPI } from '../../utils/api';
import Skeleton from '../../components/common/Skeleton';
import StatusBadge from '../../components/common/StatusBadge';
import toast from 'react-hot-toast';

const timelineSteps = [
  { key: 'pending', label: 'Application Submitted', icon: HiDocumentReport, description: 'Your application has been received' },
  { key: 'under-review', label: 'Under Review', icon: HiClock, description: 'Our team is reviewing your application' },
  { key: 'approved', label: 'Approved', icon: HiCheckCircle, description: 'Congratulations! Your application has been approved' },
  { key: 'rejected', label: 'Rejected', icon: HiXCircle, description: 'Your application has been rejected' },
];

export default function ApplicationStatus() {
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        const res = await internshipAPI.getMyApplication();
        const data = res.data?.data || res.data || null;
        setApplication(data);
      } catch (err) {
        if (err.response?.status !== 404) {
          toast.error('Failed to load application');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchApplication();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton type="profile" />
        <Skeleton type="card" />
      </div>
    );
  }

  if (!application) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <HiDocumentReport className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <p className="text-gray-500 dark:text-gray-400 text-lg">No application found</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          You haven&apos;t submitted an internship application yet.
        </p>
      </motion.div>
    );
  }

  const currentStatus = (application.status || 'pending').toLowerCase().replace(/\s+/g, '-');
  const currentStepIdx = timelineSteps.findIndex((s) => s.key === currentStatus);
  const isRejected = currentStatus === 'rejected';

  const detailFields = [
    { label: 'Full Name', value: application.name, icon: HiUser },
    { label: 'Email', value: application.email, icon: HiMail },
    { label: 'Education', value: application.education, icon: HiAcademicCap },
    { label: 'Department', value: application.department, icon: HiBriefcase },
    { label: 'Duration', value: application.duration, icon: HiCalendar },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-3xl mx-auto"
    >
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Application Status</h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
      >
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <HiUser className="w-5 h-5 mr-2 text-gray-400" />
          Application Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {detailFields.map((field) => {
            const Icon = field.icon;
            return (
              <div key={field.label} className="flex items-start space-x-3">
                <div className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg mt-0.5">
                  <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{field.label}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {field.value || '-'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <span className="text-xs text-gray-400 dark:text-gray-500">Current Status</span>
          <StatusBadge status={application.status} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
      >
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <HiClock className="w-5 h-5 mr-2 text-gray-400" />
          Status Timeline
        </h3>
        <div className="space-y-0 relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
          {timelineSteps.map((step, idx) => {
            const StepIcon = step.icon;
            const isCompleted = idx < currentStepIdx;
            const isCurrent = idx === currentStepIdx;
            const isActive = isCompleted || isCurrent;
            const isTimelineActive =
              isActive && !(isRejected && idx >= timelineSteps.findIndex((s) => s.key === 'approved'));

            if (isRejected && idx >= timelineSteps.findIndex((s) => s.key === 'approved')) {
              return null;
            }

            return (
              <div key={step.key} className="relative flex items-start space-x-4 pb-8 last:pb-0">
                <div
                  className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    isTimelineActive
                      ? isCurrent && isRejected
                        ? 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-500'
                        : isCurrent
                          ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-500'
                          : 'border-green-400 bg-green-50 dark:bg-green-900/20 text-green-500'
                      : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-400'
                  }`}
                >
                  <StepIcon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0 pt-1.5">
                  <p
                    className={`text-sm font-medium ${
                      isTimelineActive ? 'text-gray-900 dark:text-white' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p
                    className={`text-xs mt-0.5 ${
                      isTimelineActive
                        ? 'text-gray-500 dark:text-gray-400'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    {step.description}
                  </p>
                  {isCurrent && application?.updatedAt && (
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(application.updatedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {application.reviewerComments && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <HiStar className="w-5 h-5 mr-2 text-gray-400" />
            Reviewer Comments
          </h3>
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {application.reviewerComments}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
