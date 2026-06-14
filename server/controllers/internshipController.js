const Internship = require('../models/Internship');
const User = require('../models/User');

const applyForInternship = async (req, res) => {
  try {
    const existing = await Internship.findOne({ user: req.user._id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already applied' });
    }

    const internshipData = {
      user: req.user._id,
      ...req.body
    };

    const internship = await Internship.create(internshipData);

    await User.findByIdAndUpdate(req.user._id, { role: 'intern' });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: internship
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getApplications = async (req, res) => {
  try {
    const { status, department, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (department) query.department = department;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Internship.countDocuments(query);

    const applications = await Internship.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: applications,
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

const getMyApplication = async (req, res) => {
  try {
    const application = await Internship.findOne({ user: req.user._id });

    if (!application) {
      return res.status(404).json({ success: false, message: 'No application found' });
    }

    res.json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status, reviewerComments } = req.body;

    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    internship.status = status;
    internship.reviewerComments = reviewerComments || internship.reviewerComments;
    internship.reviewedBy = req.user._id;
    internship.reviewedAt = new Date();

    internship.activityLog.push({
      action: `status_${status}`,
      description: `Status changed to ${status} by ${req.user.name}`
    });

    await internship.save();

    res.json({
      success: true,
      message: `Application ${status}`,
      data: internship
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addTask = async (req, res) => {
  try {
    const { title, description, deadline } = req.body;

    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }

    internship.tasks.push({ title, description, deadline, status: 'pending' });

    const completedTasks = internship.tasks.filter(t => t.status === 'completed').length;
    internship.progress = Math.round((completedTasks / internship.tasks.length) * 100);

    internship.activityLog.push({
      action: 'task_added',
      description: `Task "${title}" added`
    });

    await internship.save();

    res.status(201).json({
      success: true,
      message: 'Task added',
      data: internship
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { taskId, status } = req.body;

    const internship = await Internship.findOne({ user: req.user._id });
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }

    const task = internship.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task.status = status;

    const completedTasks = internship.tasks.filter(t => t.status === 'completed').length;
    internship.progress = Math.round((completedTasks / internship.tasks.length) * 100);

    internship.activityLog.push({
      action: 'task_updated',
      description: `Task "${task.title}" marked as ${status}`
    });

    await internship.save();

    res.json({
      success: true,
      message: 'Task status updated',
      data: internship
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getInternDashboard = async (req, res) => {
  try {
    const internship = await Internship.findOne({ user: req.user._id });

    if (!internship) {
      return res.status(404).json({ success: false, message: 'No internship found' });
    }

    const pendingTasks = internship.tasks.filter(t => t.status === 'pending').length;
    const inProgressTasks = internship.tasks.filter(t => t.status === 'in-progress').length;
    const completedTasks = internship.tasks.filter(t => t.status === 'completed').length;

    res.json({
      success: true,
      data: {
        internship,
        stats: {
          totalTasks: internship.tasks.length,
          pendingTasks,
          inProgressTasks,
          completedTasks,
          progress: internship.progress
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  applyForInternship,
  getApplications,
  getMyApplication,
  updateApplicationStatus,
  addTask,
  updateTaskStatus,
  getInternDashboard
};
