import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiBadgeCheck, HiDownload, HiDocumentText, HiOutlineExclamationCircle } from 'react-icons/hi';
import { certificateAPI } from '../../utils/api';
import Skeleton from '../../components/common/Skeleton';
import toast from 'react-hot-toast';

export default function MyCertificates() {
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        const res = await certificateAPI.getMyCertificates();
        const data = res.data?.data || res.data || [];
        setCertificates(data);
      } catch (err) {
        toast.error('Failed to load certificates');
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  const handleDownload = async (cert) => {
    try {
      setDownloading(cert._id);
      const res = await certificateAPI.download(cert._id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate_${cert.certificateId || cert._id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Certificate downloaded');
    } catch (err) {
      toast.error('Failed to download certificate');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Certificates</h1>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Skeleton type="card" count={6} />
        </div>
      ) : certificates.length === 0 ? (
        <div className="text-center py-16">
          <HiBadgeCheck className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No certificates yet. Attend events to earn certificates!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {certificates.map((cert, idx) => (
            <motion.div
              key={cert._id || idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <HiDocumentText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <HiBadgeCheck className="w-6 h-6 text-green-500" />
              </div>

              <div className="space-y-2">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  ID: {cert.certificateId || cert._id?.slice(-8).toUpperCase()}
                </p>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {cert.eventName || cert.event?.title || 'Event Certificate'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {cert.issuedAt || cert.createdAt
                    ? new Date(cert.issuedAt || cert.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : 'Date not available'}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={() => handleDownload(cert)}
                  disabled={downloading === cert._id}
                  className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {downloading === cert._id ? (
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <HiDownload className="w-4 h-4" />
                  )}
                  <span>{downloading === cert._id ? 'Downloading...' : 'Download'}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
