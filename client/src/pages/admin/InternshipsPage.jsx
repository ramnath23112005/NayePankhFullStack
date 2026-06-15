import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  HiEye,
  HiClipboardList,
  HiAcademicCap,
} from 'react-icons/hi';
import { internshipAPI } from '../../utils/api';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import Skeleton from '../../components/common/Skeleton';
import toast from 'react-hot-toast';

const statusOptions = ['all', 'pending', 'under-review', 'approved', 'rejected'];
const departmentOptions = [
  'all',
  'Computer Science',
  'Electronics',
  'Mechanical',
  'Civil',
  'Electrical',
  'Marketing',
  'Finance',
  'Human Resources',
];

function InternshipDetailModal({ application, isOpen, onClose, onStatusChange }) {
  const [reviewerComment, setReviewerComment] = useState('');
  const [changing, setChanging] = useState(false);

  if (!application) return null;

  const handleStatusChange = async (newStatus) => {
    try {
      setChanging(true);
      await internshipAPI.updateStatus(application._id, {
        status: newStatus,
        reviewerComment,
      });
      toast.success(`Status updated to ${newStatus.replace('-', ' ')}`);
      onStatusChange();
      onClose();
    } catch {
      toast.error('Failed to update status');
    } finally {
      setChanging(false);
    }
  };

  const fields = [
    { label: 'Full Name', value: application.name },
    { label: 'Email', value: application.email },
    { label: 'Phone', value: application.phone },
    { label: 'Department', value: application.department },
    { label: 'Year of Study', value: application.yearOfStudy },
    { label: 'Duration', value: application.duration },
    { label: 'College', value: application.college },
    { label: 'Reason', value: application.reason },
    { label: 'Status', value: application.status, badge: true },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Internship Application Details" size="lg">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map((f) => (
            <div key={f.label} className={f.label === 'Reason' ? 'sm:col-span-2' : ''}>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {f.label}
              </p>
              {f.badge ? (
                <div className="mt-1">
                  <StatusBadge status={f.value} />
                </div>
              ) : (
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {f.value || '-'}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Change Status
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {['pending', 'under-review', 'approved', 'rejected'].map((s) => (
              <button
                key={s}
                disabled={changing || s === application.status}
                onClick={() => handleStatusChange(s)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  s === application.status
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    : s === 'approved'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200'
                    : s === 'rejected'
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200'
                    : s === 'under-review'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200'
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 hover:bg-yellow-200'
                }`}
              >
                {s === 'under-review' ? 'Under Review' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <textarea
            placeholder="Reviewer comments..."
            value={reviewerComment}
            onChange={(e) => setReviewerComment(e.target.value)}
            rows={3}
            className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>
    </Modal>
  );
}

export default function InternshipsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (departmentFilter) params.department = departmentFilter;
      const res = await internshipAPI.getAll(params);
      setApplications(res.data?.data || res.data?.internships || []);
    } catch {
      toast.error('Failed to load internship applications');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, departmentFilter]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleView = (app) => {
    setSelectedApp(app);
    setModalOpen(true);
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'department', label: 'Department' },
    { key: 'duration', label: 'Duration' },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <button
          onClick={() => handleView(row)}
          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          title="View"
        >
          <HiEye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Internships</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage internship applications and review submissions
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-1.5 flex-1 min-w-[200px] max-w-xs">
            <HiAcademicCap className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search applications..."
              className="bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none w-full"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 w-auto sm:w-auto"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s === 'all' ? '' : s}>
                {s === 'all' ? 'All Statuses' : s === 'under-review' ? 'Under Review' : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 w-auto sm:w-auto"
          >
            {departmentOptions.map((d) => (
              <option key={d} value={d === 'all' ? '' : d}>
                {d === 'all' ? 'All Departments' : d}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="p-6">
            <Skeleton type="table" />
          </div>
        ) : (
          <DataTable columns={columns} data={applications} pageSize={10} />
        )}
      </div>

      <InternshipDetailModal
        application={selectedApp}
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedApp(null); }}
        onStatusChange={fetchApplications}
      />
    </motion.div>
  );
}
