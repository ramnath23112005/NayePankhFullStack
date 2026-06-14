const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  certificateId: { type: String, unique: true, required: true },
  volunteerName: { type: String, required: true },
  eventName: { type: String, required: true },
  eventDate: { type: Date, required: true },
  issueDate: { type: Date, default: Date.now },
  type: {
    type: String,
    enum: ['volunteer', 'internship', 'participation', 'achievement'],
    default: 'volunteer'
  },
  description: { type: String },
  pdfUrl: { type: String },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sentViaEmail: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);
