import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  HiCamera,
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiCalendar,
  HiUser,
  HiTag,
  HiX,
  HiPlus,
  HiSave,
  HiExclamationCircle,
} from 'react-icons/hi';
import { volunteerAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import Skeleton from '../../components/common/Skeleton';
import StatusBadge from '../../components/common/StatusBadge';
import toast from 'react-hot-toast';

const initialFormState = {
  phone: '',
  dob: '',
  gender: '',
  address: '',
  bio: '',
  skills: [],
  interests: [],
  availability: 'weekends',
  emergencyContact: { name: '', phone: '', relation: '' },
};

export default function VolunteerProfile() {
  const { user, loadUser } = useAuth();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [profileCompletion, setProfileCompletion] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await volunteerAPI.getDashboard();
        const data = res.data?.data || res.data || {};
        const profile = data.profile || data;
        setForm({
          phone: profile.phone || user?.phone || '',
          dob: profile.dob ? profile.dob.split('T')[0] : user?.dob ? user.dob.split('T')[0] : '',
          gender: profile.gender || user?.gender || '',
          address: profile.address || user?.address || '',
          bio: profile.bio || user?.bio || '',
          skills: profile.skills || user?.skills || [],
          interests: profile.interests || user?.interests || [],
          availability: profile.availability || user?.availability || 'weekends',
          emergencyContact: profile.emergencyContact || user?.emergencyContact || { name: '', phone: '', relation: '' },
        });
        setProfileCompletion(profile.profileCompletion ?? data.profileCompletion ?? 0);
        if (profile.avatar || user?.avatar) {
          setAvatarPreview(profile.avatar || user?.avatar);
        }
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const calculateCompletion = (data) => {
    const fields = [
      data.phone, data.dob, data.gender, data.address,
      data.bio, data.skills?.length > 0, data.interests?.length > 0,
      data.emergencyContact?.name, data.emergencyContact?.phone,
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = name.includes('emergencyContact.')
      ? { ...form, emergencyContact: { ...form.emergencyContact, [name.split('.')[1]]: value } }
      : { ...form, [name]: value };
    setForm(updated);
    setProfileCompletion(calculateCompletion(updated));
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s || form.skills.includes(s)) return;
    const updated = { ...form, skills: [...form.skills, s] };
    setForm(updated);
    setProfileCompletion(calculateCompletion(updated));
    setSkillInput('');
  };

  const removeSkill = (skill) => {
    const updated = { ...form, skills: form.skills.filter((s) => s !== skill) };
    setForm(updated);
    setProfileCompletion(calculateCompletion(updated));
  };

  const addInterest = () => {
    const i = interestInput.trim();
    if (!i || form.interests.includes(i)) return;
    const updated = { ...form, interests: [...form.interests, i] };
    setForm(updated);
    setProfileCompletion(calculateCompletion(updated));
    setInterestInput('');
  };

  const removeInterest = (interest) => {
    const updated = { ...form, interests: form.interests.filter((x) => x !== interest) };
    setForm(updated);
    setProfileCompletion(calculateCompletion(updated));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (key === 'emergencyContact') {
          formData.append('emergencyContact', JSON.stringify(val));
        } else if (key === 'skills' || key === 'interests') {
          val.forEach((v) => formData.append(`${key}[]`, v));
        } else {
          formData.append(key, val);
        }
      });
      if (avatarFile) formData.append('avatar', avatarFile);

      await volunteerAPI.updateProfile(formData);
      await loadUser();
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton type="profile" />
        <Skeleton type="profile" />
      </div>
    );
  }

  const inputClass = 'w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors';
  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-4 mb-1">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Profile Completion</span>
          <span className="text-sm font-semibold text-green-600 dark:text-green-400">{profileCompletion}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${profileCompletion}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="bg-green-600 h-2.5 rounded-full"
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 border-4 border-white dark:border-gray-900 shadow">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <HiUser className="w-12 h-12" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleAvatarClick}
                className="absolute bottom-0 right-0 p-1.5 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors shadow"
              >
                <HiCamera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
              <div className="flex items-center justify-center sm:justify-start space-x-2 mt-1">
                <HiMail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</span>
              </div>
              <div className="mt-2">
                <StatusBadge status={user?.role || 'volunteer'} />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Phone</label>
              <div className="relative">
                <HiPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" className={`${inputClass} pl-10`} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Date of Birth</label>
              <div className="relative">
                <HiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="date" name="dob" value={form.dob} onChange={handleChange} className={`${inputClass} pl-10`} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Gender</label>
              <div className="relative">
                <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select name="gender" value={form.gender} onChange={handleChange} className={`${inputClass} pl-10`}>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass}>Address</label>
              <div className="relative">
                <HiLocationMarker className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="Enter your address" className={`${inputClass} pl-10`} />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Skills & Interests</h3>
          <div>
            <label className={labelClass}>Skills</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.skills.map((skill) => (
                <span key={skill} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="ml-1.5 hover:text-red-500 transition-colors">
                    <HiX className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} placeholder="Type a skill and press Enter" className={inputClass} />
              <button type="button" onClick={addSkill} className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex-shrink-0">
                <HiPlus className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div>
            <label className={labelClass}>Interests</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.interests.map((interest) => (
                <span key={interest} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  {interest}
                  <button type="button" onClick={() => removeInterest(interest)} className="ml-1.5 hover:text-red-500 transition-colors">
                    <HiX className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input type="text" value={interestInput} onChange={(e) => setInterestInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())} placeholder="Type an interest and press Enter" className={inputClass} />
              <button type="button" onClick={addInterest} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0">
                <HiPlus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Availability</h3>
          <div className="flex flex-wrap gap-4">
            {[
              { value: 'weekdays', label: 'Weekdays' },
              { value: 'weekends', label: 'Weekends' },
              { value: 'both', label: 'Both' },
              { value: 'flexible', label: 'Flexible' },
            ].map((option) => (
              <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="availability"
                  value={option.value}
                  checked={form.availability === option.value}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 dark:border-gray-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
              </label>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Bio</h3>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={4}
            placeholder="Tell us a little about yourself..."
            className={inputClass}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Emergency Contact</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Name</label>
              <input type="text" name="emergencyContact.name" value={form.emergencyContact.name} onChange={handleChange} placeholder="Full name" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input type="tel" name="emergencyContact.phone" value={form.emergencyContact.phone} onChange={handleChange} placeholder="Phone number" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Relation</label>
              <input type="text" name="emergencyContact.relation" value={form.emergencyContact.relation} onChange={handleChange} placeholder="e.g. Spouse, Parent" className={inputClass} />
            </div>
          </div>
        </motion.div>

        <div className="flex justify-end">
          <motion.button
            type="submit"
            disabled={saving}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors space-x-2"
          >
            {saving ? (
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <HiSave className="w-5 h-5" />
            )}
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
