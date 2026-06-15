import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiUser,
  HiMail,
  HiPhone,
  HiCalendar,
  HiLocationMarker,
  HiLightningBolt,
  HiHeart,
  HiClock,
  HiDocumentText,
  HiPhoneOutgoing,
  HiUserGroup,
  HiCamera,
  HiCheck,
  HiChevronRight,
  HiChevronLeft,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { volunteerAPI } from '../../utils/api';

const fadeIn = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

const skillOptions = [
  'Teaching',
  'Healthcare',
  'Technology',
  'Event Management',
  'Fundraising',
  'Social Media',
  'Writing',
  'Photography',
  'Graphic Design',
  'Public Speaking',
  'Counseling',
  'Sports Coaching',
  'Music & Arts',
  'Translation',
  'Legal Aid',
  'Accounting',
];

const interestOptions = [
  'Children',
  'Education',
  'Environment',
  'Health',
  'Women Empowerment',
  'Animal Welfare',
  'Elderly Care',
  'Disability Support',
  'Disaster Relief',
  'Community Development',
  'Arts & Culture',
  'Skill Training',
];

const availabilityOptions = [
  'Weekdays (Mon-Fri)',
  'Weekends (Sat-Sun)',
  'Morning (8 AM - 12 PM)',
  'Afternoon (12 PM - 4 PM)',
  'Evening (4 PM - 8 PM)',
  'Flexible',
];

const steps = [
  { label: 'Personal Info', icon: HiUser },
  { label: 'Skills & Interests', icon: HiLightningBolt },
  { label: 'Availability', icon: HiClock },
  { label: 'Review', icon: HiCheck },
];

function ChipSelect({ options, selected, onChange, label }) {
  const handleToggle = (opt) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((s) => s !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => handleToggle(opt)}
            className={`px-3 py-2 sm:py-1.5 text-sm rounded-full border transition-colors min-h-[40px] sm:min-h-0 ${
              selected.includes(opt)
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:border-green-400'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function VolunteerRegistration() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(1);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    address: '',
    skills: [],
    interests: [],
    availability: [],
    bio: '',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: '',
  });

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfilePicPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const canNext = () => {
    if (step === 1) {
      return form.name.trim() && form.email.trim() && form.phone.trim();
    }
    return true;
  };

  const nextStep = () => {
    if (step === 1 && !canNext()) {
      toast.error('Please fill in required fields (Name, Email, Phone)');
      return;
    }
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      if (!user) {
        toast.error('Please login first to complete registration');
        navigate('/login');
        return;
      }
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });
      if (profilePic) {
        formData.append('profilePicture', profilePic);
      }
      await volunteerAPI.updateProfile(formData);
      toast.success('Volunteer profile created successfully! Welcome aboard!');
      navigate('/volunteer/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit registration');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-10">
      <div className="flex items-center justify-between">
        {steps.map((s, i) => {
          const stepNum = i + 1;
          const isActive = stepNum === step;
          const isDone = stepNum < step;
          return (
            <div key={s.label} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    isDone || isActive
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                  }`}
                >
                  {isDone ? <HiCheck className="w-5 h-5" /> : stepNum}
                </div>
                <span
                  className={`mt-1 text-xs font-medium hidden sm:block ${
                    isActive
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    isDone ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="space-y-5">
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
            {profilePicPreview ? (
              <img
                src={profilePicPreview}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <HiUser className="w-10 h-10 text-gray-400" />
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
            aria-label="Upload profile picture"
          >
            <HiCamera className="w-4 h-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePicChange}
            className="hidden"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            placeholder="Your full name"
          />
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
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              placeholder="you@example.com"
            />
          </div>
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
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              placeholder="+91 98765 43210"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date of Birth
          </label>
          <div className="relative">
            <HiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={form.dob}
              onChange={(e) => updateField('dob', e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Gender
          </label>
          <select
            value={form.gender}
            onChange={(e) => updateField('gender', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Address
          </label>
          <div className="relative">
            <HiLocationMarker className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={form.address}
              onChange={(e) => updateField('address', e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              placeholder="Your address"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-6">
      <ChipSelect
        label="Select Your Skills"
        options={skillOptions}
        selected={form.skills}
        onChange={(v) => updateField('skills', v)}
      />
      <ChipSelect
        label="Areas of Interest"
        options={interestOptions}
        selected={form.interests}
        onChange={(v) => updateField('interests', v)}
      />
    </div>
  );

  const renderAvailability = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          When are you available to volunteer?
        </label>
        <div className="space-y-3">
          {availabilityOptions.map((opt) => (
            <label
              key={opt}
              className={`flex items-center p-4 rounded-xl border cursor-pointer transition-colors ${
                form.availability.includes(opt)
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-green-300'
              }`}
            >
              <input
                type="checkbox"
                checked={form.availability.includes(opt)}
                onChange={() => {
                  if (form.availability.includes(opt)) {
                    updateField(
                      'availability',
                      form.availability.filter((a) => a !== opt),
                    );
                  } else {
                    updateField('availability', [...form.availability, opt]);
                  }
                }}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="ml-3 text-gray-700 dark:text-gray-300">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Why do you want to volunteer with us? (Bio)
        </label>
        <div className="relative">
          <HiDocumentText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <textarea
            value={form.bio}
            onChange={(e) => updateField('bio', e.target.value)}
            rows={4}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
            placeholder="Tell us about yourself and why you want to volunteer..."
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Emergency Contact
        </label>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <input
              type="text"
              value={form.emergencyName}
              onChange={(e) => updateField('emergencyName', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              placeholder="Contact name"
            />
          </div>
          <div className="relative">
            <HiPhoneOutgoing className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              value={form.emergencyPhone}
              onChange={(e) => updateField('emergencyPhone', e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              placeholder="Phone"
            />
          </div>
          <div>
            <input
              type="text"
              value={form.emergencyRelation}
              onChange={(e) => updateField('emergencyRelation', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              placeholder="Relation"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-6">
      <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 border border-green-100 dark:border-green-800/30">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <HiUserGroup className="w-5 h-5 mr-2 text-green-600" />
          Personal Information
        </h3>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div><span className="text-gray-400">Name:</span> <span className="text-gray-900 dark:text-white font-medium">{form.name || '-'}</span></div>
          <div><span className="text-gray-400">Email:</span> <span className="text-gray-900 dark:text-white font-medium">{form.email || '-'}</span></div>
          <div><span className="text-gray-400">Phone:</span> <span className="text-gray-900 dark:text-white font-medium">{form.phone || '-'}</span></div>
          <div><span className="text-gray-400">DOB:</span> <span className="text-gray-900 dark:text-white font-medium">{form.dob || '-'}</span></div>
          <div><span className="text-gray-400">Gender:</span> <span className="text-gray-900 dark:text-white font-medium capitalize">{form.gender || '-'}</span></div>
          <div><span className="text-gray-400">Address:</span> <span className="text-gray-900 dark:text-white font-medium">{form.address || '-'}</span></div>
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 border border-green-100 dark:border-green-800/30">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <HiLightningBolt className="w-5 h-5 mr-2 text-green-600" />
          Skills & Interests
        </h3>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-gray-400">Skills:</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {form.skills.length > 0
                ? form.skills.map((s) => (
                    <span key={s} className="px-2 py-0.5 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full text-xs">
                      {s}
                    </span>
                  ))
                : <span className="text-gray-500">None selected</span>}
            </div>
          </div>
          <div>
            <span className="text-gray-400">Interests:</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {form.interests.length > 0
                ? form.interests.map((s) => (
                    <span key={s} className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                      {s}
                    </span>
                  ))
                : <span className="text-gray-500">None selected</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 border border-green-100 dark:border-green-800/30">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <HiClock className="w-5 h-5 mr-2 text-green-600" />
          Availability & Bio
        </h3>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-gray-400">Availability:</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {form.availability.length > 0
                ? form.availability.map((a) => (
                    <span key={a} className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-full text-xs">
                      {a}
                    </span>
                  ))
                : <span className="text-gray-500">Not specified</span>}
            </div>
          </div>
          <div>
            <span className="text-gray-400">Bio:</span>
            <p className="text-gray-900 dark:text-white mt-1">{form.bio || '-'}</p>
          </div>
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 border border-green-100 dark:border-green-800/30">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <HiPhoneOutgoing className="w-5 h-5 mr-2 text-green-600" />
          Emergency Contact
        </h3>
        <div className="grid sm:grid-cols-3 gap-3 text-sm">
          <div><span className="text-gray-400">Name:</span> <span className="text-gray-900 dark:text-white font-medium">{form.emergencyName || '-'}</span></div>
          <div><span className="text-gray-400">Phone:</span> <span className="text-gray-900 dark:text-white font-medium">{form.emergencyPhone || '-'}</span></div>
          <div><span className="text-gray-400">Relation:</span> <span className="text-gray-900 dark:text-white font-medium">{form.emergencyRelation || '-'}</span></div>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return renderPersonalInfo();
      case 2:
        return renderSkills();
      case 3:
        return renderAvailability();
      case 4:
        return renderReview();
      default:
        return null;
    }
  };

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
              <HiUserGroup className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Volunteer <span className="text-green-600">Registration</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Join our community of changemakers. Fill in the details to get started.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 md:p-8">
            {renderStepIndicator()}

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                variants={fadeIn}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 1}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <HiChevronLeft className="w-4 h-4 mr-1" /> Previous
              </button>

              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center px-6 py-2.5 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors"
                >
                  Next <HiChevronRight className="w-4 h-4 ml-1" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center px-6 py-2.5 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
