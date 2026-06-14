const Volunteer = require('../models/Volunteer');
const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

const getVolunteers = async (req, res) => {
  try {
    const { search, skills, status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (search) {
      const users = await User.find({
        name: { $regex: search, $options: 'i' }
      }).select('_id');
      query.user = { $in: users.map(u => u._id) };
    }

    if (skills) {
      query.skills = { $in: skills.split(',').map(s => s.trim()) };
    }

    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Volunteer.countDocuments(query);

    const volunteers = await Volunteer.find(query)
      .populate('user', 'name email phone isActive lastLogin')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: volunteers,
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

const getVolunteerById = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id)
      .populate('user', 'name email phone isActive lastLogin');

    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer not found' });
    }

    res.json({ success: true, data: volunteer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    let volunteer = await Volunteer.findOne({ user: req.user._id });
    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer profile not found' });
    }

    const allowedFields = [
      'dateOfBirth', 'gender', 'address', 'skills', 'interests',
      'availability', 'emergencyContact', 'bio', 'profilePicture'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        volunteer[field] = req.body[field];
      }
    });

    volunteer.activityLog.push({
      action: 'profile_updated',
      description: 'Profile updated by volunteer'
    });

    await volunteer.save();

    res.json({ success: true, message: 'Profile updated', data: volunteer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const approveVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer not found' });
    }

    volunteer.status = 'approved';
    volunteer.approvedBy = req.user._id;
    volunteer.approvedAt = new Date();
    volunteer.activityLog.push({
      action: 'approved',
      description: `Approved by ${req.user.name}`
    });
    await volunteer.save();

    await User.findByIdAndUpdate(volunteer.user, { isApproved: true });

    res.json({ success: true, message: 'Volunteer approved', data: volunteer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const rejectVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer not found' });
    }

    volunteer.status = 'rejected';
    volunteer.activityLog.push({
      action: 'rejected',
      description: `Rejected by ${req.user.name}`
    });
    await volunteer.save();

    await User.findByIdAndUpdate(volunteer.user, { isApproved: false });

    res.json({ success: true, message: 'Volunteer rejected', data: volunteer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getVolunteerDashboard = async (req, res) => {
  try {
    const volunteer = await Volunteer.findOne({ user: req.user._id })
      .populate('user', 'name email');

    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer profile not found' });
    }

    const registrations = await Registration.find({
      user: req.user._id,
      status: { $ne: 'cancelled' }
    }).populate('event', 'title date category');

    const upcomingEvents = registrations.filter(r =>
      r.event && new Date(r.event.date) > new Date()
    );

    const completedEvents = await Registration.find({
      user: req.user._id,
      status: 'attended'
    }).countDocuments();

    res.json({
      success: true,
      data: {
        volunteer,
        profileCompletion: volunteer.profileCompletion,
        totalEvents: registrations.length,
        upcomingEvents: upcomingEvents.length,
        completedEvents,
        completedHours: volunteer.completedHours || 0,
        events: registrations.map(r => r.event)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const exportVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find({ status: 'approved' })
      .populate('user', 'name email phone')
      .lean();

    const fields = ['Name', 'Email', 'Phone', 'Skills', 'Status', 'Completed Hours', 'Joined Date'];
    const csvRows = [fields.join(',')];

    volunteers.forEach(v => {
      const row = [
        `"${v.user?.name || ''}"`,
        `"${v.user?.email || ''}"`,
        `"${v.user?.phone || ''}"`,
        `"${(v.skills || []).join('; ')}"`,
        v.status,
        v.completedHours || 0,
        v.createdAt ? new Date(v.createdAt).toISOString().split('T')[0] : ''
      ];
      csvRows.push(row.join(','));
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=volunteers.csv');
    res.send(csvRows.join('\n'));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getVolunteers,
  getVolunteerById,
  updateProfile,
  approveVolunteer,
  rejectVolunteer,
  getVolunteerDashboard,
  exportVolunteers
};
