import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  HiPlus,
  HiDownload,
  HiMail,
  HiBadgeCheck,
} from 'react-icons/hi';
import { certificateAPI, volunteerAPI, eventAPI } from '../../utils/api';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import Skeleton from '../../components/common/Skeleton';
import toast from 'react-hot-toast';

const certificateTypes = [
  'Participation',
  'Appreciation',
  'Completion',
  'Excellence',
  'Volunteer Hours',
];

function GenerateCertificateModal({ isOpen, onClose, onGenerated }) {
  const [volunteers, setVolunteers] = useState([]);
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    volunteer: '',
    event: '',
    type: '',
  });
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const [volRes, evtRes] = await Promise.all([
            volunteerAPI.getAll({}),
            eventAPI.getAll({}),
          ]);
          setVolunteers(volRes.data?.data || volRes.data?.volunteers || []);
          setEvents(evtRes.data?.data || evtRes.data?.events || []);
        } catch {
          toast.error('Failed to load form data');
        }
      };
      fetchData();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.volunteer || !form.event || !form.type) {
      toast.error('Please fill all fields');
      return;
    }
    try {
      setGenerating(true);
      await certificateAPI.generate({
        volunteer: form.volunteer,
        event: form.event,
        type: form.type,
      });
      toast.success('Certificate generated successfully');
      onGenerated();
      onClose();
      setForm({ volunteer: '', event: '', type: '' });
    } catch {
      toast.error('Failed to generate certificate');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generate Certificate" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Select Volunteer *
          </label>
          <select
            value={form.volunteer}
            onChange={(e) => setForm((p) => ({ ...p, volunteer: e.target.value }))}
            required
            className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Choose a volunteer</option>
            {volunteers.map((v) => (
              <option key={v._id} value={v._id}>{v.name} ({v.email})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Select Event *
          </label>
          <select
            value={form.event}
            onChange={(e) => setForm((p) => ({ ...p, event: e.target.value }))}
            required
            className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Choose an event</option>
            {events.map((evt) => (
              <option key={evt._id} value={evt._id}>{evt.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Certificate Type *
          </label>
          <select
            value={form.type}
            onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
            required
            className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select type</option>
            {certificateTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={generating}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {generating ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchCertificates = useCallback(async () => {
    try {
      setLoading(true);
      const res = await certificateAPI.getAll();
      setCertificates(res.data?.data || res.data?.certificates || []);
    } catch {
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  const handleDownload = async (id) => {
    try {
      const res = await certificateAPI.download(id);
      const blob = new Blob([res.data], { type: res.headers['content-type'] || 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Certificate downloaded');
    } catch {
      toast.error('Failed to download certificate');
    }
  };

  const handleSendEmail = async (id) => {
    try {
      await certificateAPI.sendEmail(id);
      toast.success('Certificate sent via email');
    } catch {
      toast.error('Failed to send certificate email');
    }
  };

  const columns = [
    {
      key: 'certificateId',
      label: 'Certificate ID',
      render: (val, row) => (
        <span className="font-mono text-xs">{row._id?.slice(-8).toUpperCase() || val || '-'}</span>
      ),
    },
    {
      key: 'volunteer',
      label: 'Volunteer Name',
      render: (val) => (typeof val === 'object' ? val.name : val) || '-',
    },
    {
      key: 'event',
      label: 'Event Name',
      render: (val) => (typeof val === 'object' ? val.title : val) || '-',
    },
    {
      key: 'issueDate',
      label: 'Issue Date',
      render: (val) => val ? new Date(val).toLocaleDateString('en-IN') : '-',
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleDownload(row._id)}
            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            title="Download"
          >
            <HiDownload className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleSendEmail(row._id)}
            className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
            title="Send Email"
          >
            <HiMail className="w-4 h-4" />
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Certificates</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Generate and manage volunteer certificates
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
        >
          <HiPlus className="w-4 h-4 mr-2" />
          Generate Certificate
        </button>
      </div>

      {loading ? (
        <Skeleton type="table" />
      ) : (
        <DataTable columns={columns} data={certificates} searchable pageSize={10} />
      )}

      <GenerateCertificateModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onGenerated={fetchCertificates}
      />
    </motion.div>
  );
}
