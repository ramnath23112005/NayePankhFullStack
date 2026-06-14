const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  shortDescription: { type: String, maxlength: 200 },
  banner: { type: String, default: '' },
  category: {
    type: String,
    enum: ['workshop', 'outreach', 'fundraiser', 'awareness', 'training', 'cultural', 'other'],
    default: 'other'
  },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  endDate: Date,
  venue: { type: String, required: true },
  address: {
    street: String,
    city: String,
    state: String
  },
  capacity: { type: Number, required: true },
  registeredCount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  attendance: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['present', 'absent'], default: 'absent' },
    markedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

eventSchema.virtual('isFull').get(function() {
  return this.registeredCount >= this.capacity;
});

eventSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
