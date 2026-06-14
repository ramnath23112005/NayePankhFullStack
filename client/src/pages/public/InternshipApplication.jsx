import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiUser,
  HiMail,
  HiPhone,
  HiAcademicCap,
  HiLightningBolt,
  HiDocumentText,
  HiUpload,
  HiCalendar,
  HiBriefcase,
  HiCheckCircle,
  HiClock,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { internshipAPI } from '../../utils/api';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const departments = [
  'Community Outreach',
  'Fundraising',
  'Marketing',
  'IT',
  'Research',
  'Administration',
];

const durations = [
  { label: '1 Month', value: '1' },
  { label: '2 Months', value: '2' },
  { label: '3 Months', value: '3' },
  { label: '6 Months', value: '6' },
];

const skillOptions = [
  'Communication',
  'Teamwork',
  'Leadership',
  'Problem Solving',
  'Data Analysis',
  'Content Writing',
  'Social Media',
  'Graphic Design',
  'Event Planning',
  'Public Speaking',
  'Research',
  'Project Management',
  'Fundraising',
  'Photography',
  'Video Editing',
  'Languages',
];

export default function InternshipApplication() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const resumeRef = useRef(null);
  const coverLetterRef = useRef(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    education: '',
    institution: '',
    yearOfStudy: '',
    department: '',
    duration: '',
    startDate: '',
    skills: [],
    whyJoin: '',
  });
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleFileUpload = (field, file) => {
    if (!file) return;
    const allowedTypes = ['application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload PDF files only');
      return;
    }
    if (field === 'resume') setResume(file);
    if (field === 'coverLetter') setCoverLetter(file);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!form.phone.trim()) newErrors.phone = 'Phone is required';
    if (!form.education.trim()) newErrors.education = 'Education is required';
    if (!form.department) newErrors.department = 'Please select a department';
    if (!form.duration) newErrors.duration = 'Please select duration';
    if (!form.startDate) newErrors.startDate = 'Please select start date';
    if (!resume) toast.error('Please upload your resume (PDF)');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && !!resume;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (!user) {
      toast.error('Please login first to apply for internship');
      navigate('/login');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'skills') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });
      if (resume) formData.append('resume', resume);
      if (coverLetter) formData.append('coverLetter', coverLetter);

      await internshipAPI.apply(formData);
      toast.success('Internship application submitted successfully!');
      navigate('/intern/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Application submission failed';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-xl border ${
      errors[field]
        ? 'border-red-500 focus:ring-red-500'
        : 'border-gray-300 dark:border-gray-600 focus:ring-green-500'
    } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent outline-none transition-colors`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 md:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
              <HiBriefcase className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Internship <span className="text-green-600">Application</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Kickstart your career with hands-on experience at NayePankh Foundation.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Info */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <HiUser className="w-5 h-5 mr-2 text-green-600" />
                  Personal Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      className={inputClass('name')}
                      placeholder="Your full name"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        className={`${inputClass('email')} pl-10`}
                        placeholder="you@example.com"
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <HiPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        className={`${inputClass('phone')} pl-10`}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Education */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <HiAcademicCap className="w-5 h-5 mr-2 text-green-600" />
                  Education
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Highest Education <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.education}
                      onChange={(e) => updateField('education', e.target.value)}
                      className={inputClass('education')}
                      placeholder="e.g. B.Tech, B.A., M.Sc..."
                    />
                    {errors.education && <p className="mt-1 text-sm text-red-500">{errors.education}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Institution
                    </label>
                    <input
                      type="text"
                      value={form.institution}
                      onChange={(e) => updateField('institution', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      placeholder="University / College name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Year of Study
                    </label>
                    <input
                      type="text"
                      value={form.yearOfStudy}
                      onChange={(e) => updateField('yearOfStudy', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      placeholder="e.g. 3rd Year, Graduate"
                    />
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <HiLightningBolt className="w-5 h-5 mr-2 text-green-600" />
                  Skills & Preferences
                </h2>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Preferred Department <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={form.department}
                        onChange={(e) => updateField('department', e.target.value)}
                        className={inputClass('department')}
                      >
                        <option value="">Select department</option>
                        {departments.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                      {errors.department && <p className="mt-1 text-sm text-red-500">{errors.department}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Duration <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={form.duration}
                        onChange={(e) => updateField('duration', e.target.value)}
                        className={inputClass('duration')}
                      >
                        <option value="">Select duration</option>
                        {durations.map((d) => (
                          <option key={d.value} value={d.value}>{d.label}</option>
                        ))}
                      </select>
                      {errors.duration && <p className="mt-1 text-sm text-red-500">{errors.duration}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <HiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          value={form.startDate}
                          onChange={(e) => updateField('startDate', e.target.value)}
                          className={`${inputClass('startDate')} pl-10`}
                        />
                      </div>
                      {errors.startDate && <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Skills
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {skillOptions.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => {
                            if (form.skills.includes(skill)) {
                              updateField('skills', form.skills.filter((s) => s !== skill));
                            } else {
                              updateField('skills', [...form.skills, skill]);
                            }
                          }}
                          className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                            form.skills.includes(skill)
                              ? 'bg-green-600 text-white border-green-600'
                              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:border-green-400'
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <HiDocumentText className="w-5 h-5 mr-2 text-green-600" />
                  Documents
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Resume (PDF) <span className="text-red-500">*</span>
                    </label>
                    <div
                      onClick={() => resumeRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-green-400 dark:hover:border-green-500 transition-colors"
                    >
                      {resume ? (
                        <div className="flex items-center justify-center space-x-2">
                          <HiCheckCircle className="w-6 h-6 text-green-600" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{resume.name}</span>
                        </div>
                      ) : (
                        <div>
                          <HiUpload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload resume</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">PDF only, max 5MB</p>
                        </div>
                      )}
                      <input
                        ref={resumeRef}
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => handleFileUpload('resume', e.target.files[0])}
                        className="hidden"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cover Letter (PDF)
                    </label>
                    <div
                      onClick={() => coverLetterRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-green-400 dark:hover:border-green-500 transition-colors"
                    >
                      {coverLetter ? (
                        <div className="flex items-center justify-center space-x-2">
                          <HiCheckCircle className="w-6 h-6 text-green-600" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{coverLetter.name}</span>
                        </div>
                      ) : (
                        <div>
                          <HiUpload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload cover letter</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">PDF only (optional)</p>
                        </div>
                      )}
                      <input
                        ref={coverLetterRef}
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => handleFileUpload('coverLetter', e.target.files[0])}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Why Join */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <HiClock className="w-5 h-5 mr-2 text-green-600" />
                  Why do you want to join?
                </h2>
                <textarea
                  value={form.whyJoin}
                  onChange={(e) => updateField('whyJoin', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                  placeholder="Tell us about your motivation, goals, and what you hope to learn..."
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {submitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting Application...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
