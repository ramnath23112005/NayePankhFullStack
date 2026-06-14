const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other', ''] },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'India' }
  },
  skills: [{ type: String }],
  interests: [{ type: String }],
  availability: {
    type: String,
    enum: ['available', 'unavailable', 'limited'],
    default: 'available'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  profilePicture: { type: String, default: '' },
  bio: { type: String, maxlength: 500 },
  completedHours: { type: Number, default: 0 },
  eventsAttended: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date },
  activityLog: [{
    action: String,
    description: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

volunteerSchema.virtual('profileCompletion').get(function() {
  let completed = 0;
  const fields = ['dateOfBirth', 'gender', 'address.city', 'skills', 'interests', 'bio'];
  fields.forEach(f => {
    if (this[f]) completed++;
  });
  return Math.round((completed / fields.length) * 100);
});

volunteerSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Volunteer', volunteerSchema);
