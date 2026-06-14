import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  HiEye,
  HiCheck,
  HiX,
  HiTrash,
  HiDownload,
  HiUserGroup,
} from 'react-icons/hi';
import { volunteerAPI } from '../../utils/api';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import Skeleton from '../../components/common/Skeleton';
import toast from 'react-hot-toast';

const skillOptions = [
  'Teaching',
  'Healthcare',
  'Technology',
  'Marketing',
  'Fundraising',
  'Content Writing',
  'Photography',
  'Event Management',
  'Social Work',
  'Legal',
];

const statusOptions = ['all', 'pending', 'approved', 'rejected', 'active'];

function VolunteerDetailModal({ volunteer, isOpen, onClose }) {
  if (!volunteer) return null;

  const fields = [
    { label: 'Name', value: volunteer.name },
    { label: 'Email', value: volunteer.email },
    { label: 'Phone', value: volunteer.phone },
    { label: 'Age', value: volunteer.age },
    { label: 'Gender', value: volunteer.gender },
    { label: 'Address', value: volunteer.address },
    { label: 'City', value: volunteer.city },
    { label: 'State', value: volunteer.state },
    { label: 'Pincode', value: volunteer.pincode },
    { label: 'Occupation', value: volunteer.occupation },
    { label: 'Skills', value: volunteer.skills?.join(', ') },
    { label: 'Availability', value: volunteer.availability },
    { label: 'Motivation', value: volunteer.motivation },
    { label: 'Status', value: volunteer.status, badge: true },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Volunteer Details" size="lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.label} className={f.label === 'Motivation' ? 'sm:col-span-2' : ''}>
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
    </Modal>
  );
}

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchVolunteers = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (skillFilter) params.skill = skillFilter;
      if (statusFilter) params.status = statusFilter;
      const res = await volunteerAPI.getAll(params);
      setVolunteers(res.data?.data || res.data?.volunteers || []);
    } catch (err) {
      toast.error('Failed to load volunteers');
    } finally {
      setLoading(false);
    }
  }, [search, skillFilter, statusFilter]);

  useEffect(() => {
    fetchVolunteers();
  }, [fetchVolunteers]);

  const handleApprove = async (id) => {
    try {
      await volunteerAPI.approve(id);
      toast.success('Volunteer approved successfully');
      fetchVolunteers();
    } catch {
      toast.error('Failed to approve volunteer');
    }
  };

  const handleReject = async (id) => {
    try {
      await volunteerAPI.reject(id);
      toast.success('Volunteer rejected');
      fetchVolunteers();
    } catch {
      toast.error('Failed to reject volunteer');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this volunteer?')) return;
    try {
      await volunteerAPI.delete?.(id) || await volunteerAPI.reject(id);
      toast.success('Volunteer deleted');
      fetchVolunteers();
    } catch {
      toast.error('Failed to delete volunteer');
    }
  };

  const handleView = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setModalOpen(true);
  };

  const handleExportCSV = async () => {
    try {
      const res = await volunteerAPI.exportCSV();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'volunteers.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('CSV exported successfully');
    } catch {
      toast.error('Failed to export CSV');
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    {
      key: 'skills',
      label: 'Skills',
      render: (val) => (
        <div className="flex flex-wrap gap-1">
          {(val || []).slice(0, 2).map((s, i) => (
            <span key={i} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
              {s}
            </span>
          ))}
          {val?.length > 2 && (
            <span className="text-xs text-gray-400">+{val.length - 2}</span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleView(row)}
            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            title="View"
          >
            <HiEye className="w-4 h-4" />
          </button>
          {row.status === 'pending' && (
            <>
              <button
                onClick={() => handleApprove(row._id)}
                className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                title="Approve"
              >
                <HiCheck className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleReject(row._id)}
                className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                title="Reject"
              >
                <HiX className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={() => handleDelete(row._id)}
            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            title="Delete"
          >
            <HiTrash className="w-4 h-4" />
          </button>
        </div>
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Volunteers</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage volunteer applications and profiles
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
        >
          <HiDownload className="w-4 h-4 mr-2" />
          Export CSV
        </button>
      </div>

      {loading ? (
        <Skeleton type="table" />
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center gap-4">
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-1.5 flex-1 max-w-xs">
              <HiUserGroup className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search volunteers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none w-full"
              />
            </div>
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Skills</option>
              {skillOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s === 'all' ? '' : s}>
                  {s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <DataTable columns={columns} data={volunteers} pageSize={10} />
        </div>
      )}

      <VolunteerDetailModal
        volunteer={selectedVolunteer}
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedVolunteer(null); }}
      />
    </motion.div>
  );
}
