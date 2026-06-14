const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  dateOfBirth: Date,
  gender: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'India' }
  },
  education: {
    degree: String,
    institution: String,
    fieldOfStudy: String,
    graduationYear: Number
  },
  skills: [{ type: String }],
  department: {
    type: String,
    enum: ['community-outreach', 'fundraising', 'marketing', 'it', 'research', 'administration', 'others']
  },
  duration: {
    type: String,
    enum: ['1-month', '2-months', '3-months', '6-months']
  },
  startDate: Date,
  resume: { type: String },
  coverLetter: { type: String },
  status: {
    type: String,
    enum: ['pending', 'under-review', 'approved', 'rejected'],
    default: 'pending'
  },
  reviewerComments: { type: String },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: Date,
  tasks: [{
    title: String,
    description: String,
    deadline: Date,
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' }
  }],
  progress: { type: Number, default: 0 },
  activityLog: [{
    action: String,
    description: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Internship', internshipSchema);
