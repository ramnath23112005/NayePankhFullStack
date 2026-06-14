const Event = require('../models/Event');
const Registration = require('../models/Registration');
const User = require('../models/User');

const createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.json({
      success: true,
      message: 'Event updated',
      data: event
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    await Registration.deleteMany({ event: event._id });
    await Event.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getEvents = async (req, res) => {
  try {
    const { category, status, upcoming, search, page = 1, limit = 12 } = req.query;
    const query = {};

    if (category) query.category = category;
    if (status) query.status = status;

    if (upcoming === 'true') {
      query.date = { $gte: new Date() };
      query.status = { $ne: 'cancelled' };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Event.countDocuments(query);

    const events = await Event.find(query)
      .populate('createdBy', 'name')
      .sort({ date: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: events,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    let isRegistered = false;
    if (req.user) {
      const registration = await Registration.findOne({
        user: req.user._id,
        event: event._id,
        status: 'registered'
      });
      isRegistered = !!registration;
    }

    res.json({
      success: true,
      data: { ...event.toJSON(), isRegistered }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Event is cancelled' });
    }

    if (event.isFull) {
      return res.status(400).json({ success: false, message: 'Event is full' });
    }

    const existingRegistration = await Registration.findOne({
      user: req.user._id,
      event: event._id,
      status: { $ne: 'cancelled' }
    });

    if (existingRegistration) {
      return res.status(400).json({ success: false, message: 'Already registered' });
    }

    const registration = await Registration.create({
      user: req.user._id,
      event: event._id,
      status: 'registered'
    });

    event.registeredCount = (event.registeredCount || 0) + 1;
    if (!event.volunteers.includes(req.user._id)) {
      event.volunteers.push(req.user._id);
    }
    await event.save();

    res.status(201).json({
      success: true,
      message: 'Registered for event',
      data: registration
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findOne({
      user: req.user._id,
      event: req.params.id,
      status: 'registered'
    });

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    registration.status = 'cancelled';
    registration.cancelledAt = new Date();
    await registration.save();

    await Event.findByIdAndUpdate(req.params.id, {
      $inc: { registeredCount: -1 },
      $pull: { volunteers: req.user._id }
    });

    res.json({
      success: true,
      message: 'Registration cancelled'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const markAttendance = async (req, res) => {
  try {
    const { userId, status } = req.body;

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const existing = event.attendance.find(
      a => a.user.toString() === userId
    );

    if (existing) {
      existing.status = status || 'present';
      existing.markedAt = new Date();
    } else {
      event.attendance.push({
        user: userId,
        status: status || 'present'
      });
    }

    await event.save();

    if (status === 'present') {
      await Registration.findOneAndUpdate(
        { user: userId, event: event._id },
        { status: 'attended' }
      );
    }

    res.json({
      success: true,
      message: 'Attendance marked',
      data: event
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyEvents = async (req, res) => {
  try {
    const registrations = await Registration.find({
      user: req.user._id
    })
      .populate({
        path: 'event',
        select: 'title description shortDescription banner category date time venue address capacity registeredCount status'
      })
      .sort({ createdAt: -1 });

    const events = registrations
      .filter(r => r.event)
      .map(r => ({
        ...r.event.toJSON(),
        registrationStatus: r.status,
        registeredAt: r.registeredAt
      }));

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvents,
  getEventById,
  registerForEvent,
  cancelRegistration,
  markAttendance,
  getMyEvents
};
