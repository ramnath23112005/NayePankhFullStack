const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: {
    type: String,
    enum: ['volunteer_approved', 'event_reminder', 'certificate_ready', 'internship_update', 'general'],
    default: 'general'
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  link: { type: String },
  forRole: { type: String, enum: ['volunteer', 'intern', 'admin', 'all'], default: 'all' }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
