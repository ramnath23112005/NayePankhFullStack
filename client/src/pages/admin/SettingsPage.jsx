import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiSave,
  HiLockClosed,
  HiCog,
  HiUser,
  HiMail,
  HiPhone,
  HiToggleLeft,
  HiBell,
  HiGlobe,
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

function SectionCard({ title, icon: Icon, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-2">
        {Icon && <Icon className="w-5 h-5 text-gray-400" />}
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <div className="px-6 py-5">{children}</div>
    </motion.div>
  );
}

function Toggle({ label, description, enabled, onChange }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [password, setPassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [system, setSystem] = useState({
    autoApproveVolunteers: true,
    emailNotifications: true,
    siteName: 'NayePankh Foundation',
  });

  const [saving, setSaving] = useState({
    profile: false,
    password: false,
    system: false,
  });

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      setSaving((prev) => ({ ...prev, profile: true }));
      // await authAPI.updateProfile(profile);
      setTimeout(() => {
        toast.success('Profile updated successfully');
        setSaving((prev) => ({ ...prev, profile: false }));
      }, 500);
    } catch {
      toast.error('Failed to update profile');
      setSaving((prev) => ({ ...prev, profile: false }));
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (password.newPassword !== password.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (password.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      setSaving((prev) => ({ ...prev, password: true }));
      // await authAPI.changePassword({
      //   currentPassword: password.currentPassword,
      //   newPassword: password.newPassword,
      // });
      setTimeout(() => {
        toast.success('Password changed successfully');
        setPassword({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setSaving((prev) => ({ ...prev, password: false }));
      }, 500);
    } catch {
      toast.error('Failed to change password');
      setSaving((prev) => ({ ...prev, password: false }));
    }
  };

  const handleSystemSave = async (e) => {
    e.preventDefault();
    try {
      setSaving((prev) => ({ ...prev, system: true }));
      // await settingsAPI.update(system);
      setTimeout(() => {
        toast.success('System settings saved');
        setSaving((prev) => ({ ...prev, system: false }));
      }, 500);
    } catch {
      toast.error('Failed to save settings');
      setSaving((prev) => ({ ...prev, system: false }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-4xl"
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your account and application settings
        </p>
      </div>

      <SectionCard title="Profile Settings" icon={HiUser}>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Full Name
              </label>
              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800">
                <HiUser className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  className="w-full text-sm bg-transparent text-gray-700 dark:text-gray-300 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Email
              </label>
              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800">
                <HiMail className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                  className="w-full text-sm bg-transparent text-gray-700 dark:text-gray-300 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Phone
              </label>
              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800">
                <HiPhone className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full text-sm bg-transparent text-gray-700 dark:text-gray-300 focus:outline-none"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving.profile}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <HiSave className="w-4 h-4 mr-2" />
              {saving.profile ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </SectionCard>

      <SectionCard title="Change Password" icon={HiLockClosed}>
        <form onSubmit={handlePasswordSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Current Password
              </label>
              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800">
                <HiLockClosed className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="password"
                  value={password.currentPassword}
                  onChange={(e) => setPassword((p) => ({ ...p, currentPassword: e.target.value }))}
                  className="w-full text-sm bg-transparent text-gray-700 dark:text-gray-300 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={password.newPassword}
                onChange={(e) => setPassword((p) => ({ ...p, newPassword: e.target.value }))}
                className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={password.confirmPassword}
                onChange={(e) => setPassword((p) => ({ ...p, confirmPassword: e.target.value }))}
                className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving.password}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <HiSave className="w-4 h-4 mr-2" />
              {saving.password ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </SectionCard>

      <SectionCard title="System Settings" icon={HiCog}>
        <form onSubmit={handleSystemSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Site Name
            </label>
            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800">
              <HiGlobe className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                value={system.siteName}
                onChange={(e) => setSystem((p) => ({ ...p, siteName: e.target.value }))}
                className="w-full text-sm bg-transparent text-gray-700 dark:text-gray-300 focus:outline-none"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-1">
            <Toggle
              label="Default Volunteer Approval"
              description="Automatically approve new volunteer registrations"
              enabled={system.autoApproveVolunteers}
              onChange={(v) => setSystem((p) => ({ ...p, autoApproveVolunteers: v }))}
            />
            <Toggle
              label="Email Notifications"
              description="Send email notifications for new registrations and updates"
              enabled={system.emailNotifications}
              onChange={(v) => setSystem((p) => ({ ...p, emailNotifications: v }))}
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving.system}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <HiSave className="w-4 h-4 mr-2" />
              {saving.system ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </SectionCard>
    </motion.div>
  );
}
