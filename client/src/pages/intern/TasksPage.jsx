import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiClipboardList,
  HiCalendar,
  HiCheckCircle,
  HiPlay,
  HiRefresh,
} from 'react-icons/hi';
import { internshipAPI } from '../../utils/api';
import StatusBadge from '../../components/common/StatusBadge';
import Skeleton from '../../components/common/Skeleton';
import toast from 'react-hot-toast';

export default function TasksPage() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const res = await internshipAPI.getDashboard();
        const data = res.data?.data || res.data || {};
        setTasks(data.tasks || []);
      } catch (err) {
        toast.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleUpdateStatus = async (task, newStatus) => {
    try {
      setUpdating(task._id);
      const taskStatus =
        newStatus === 'in-progress'
          ? 'in_progress'
          : newStatus === 'completed'
            ? 'completed'
            : newStatus;
      await internshipAPI.updateTaskStatus(task.internshipId || task._internship, task._id, {
        status: taskStatus,
      });
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, status: taskStatus } : t))
      );
      toast.success(`Task marked as ${newStatus}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task status');
    } finally {
      setUpdating(null);
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const order = { pending: 0, in_progress: 1, completed: 2 };
    return (order[a.status] ?? 0) - (order[b.status] ?? 0);
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Tasks</h1>

      {loading ? (
        <div className="space-y-4">
          <Skeleton type="card" count={5} />
        </div>
      ) : sortedTasks.length === 0 ? (
        <div className="text-center py-16">
          <HiClipboardList className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">No tasks assigned yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedTasks.map((task, idx) => (
            <motion.div
              key={task._id || idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {task.title}
                    </h3>
                    <StatusBadge status={task.status} />
                  </div>
                  {task.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {task.description}
                    </p>
                  )}
                  {task.deadline && (
                    <div className="flex items-center space-x-1.5 mt-2 text-xs text-gray-400">
                      <HiCalendar className="w-3.5 h-3.5" />
                      <span>
                        Deadline:{' '}
                        {new Date(task.deadline).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {(task.status === 'pending' || task.status === 'in_progress') && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center space-x-3">
                  {task.status === 'pending' && (
                    <button
                      onClick={() => handleUpdateStatus(task, 'in-progress')}
                      disabled={updating === task._id}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {updating === task._id ? (
                        <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <HiPlay className="w-3.5 h-3.5" />
                      )}
                      <span>{updating === task._id ? 'Updating...' : 'Start'}</span>
                    </button>
                  )}
                  {task.status === 'in_progress' && (
                    <button
                      onClick={() => handleUpdateStatus(task, 'completed')}
                      disabled={updating === task._id}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {updating === task._id ? (
                        <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <HiCheckCircle className="w-3.5 h-3.5" />
                      )}
                      <span>{updating === task._id ? 'Updating...' : 'Mark Completed'}</span>
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
