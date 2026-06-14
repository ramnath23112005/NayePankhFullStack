const User = require('../models/User');
const Volunteer = require('../models/Volunteer');
const Internship = require('../models/Internship');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Certificate = require('../models/Certificate');

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalVolunteers,
      activeVolunteers,
      totalInterns,
      pendingInterns,
      totalEvents,
      upcomingEvents,
      totalRegistrations,
      totalCertificates
    ] = await Promise.all([
      Volunteer.countDocuments(),
      Volunteer.countDocuments({ status: 'approved' }),
      Internship.countDocuments(),
      Internship.countDocuments({ status: 'pending' }),
      Event.countDocuments(),
      Event.countDocuments({ date: { $gte: new Date() }, status: { $ne: 'cancelled' } }),
      Registration.countDocuments({ status: { $ne: 'cancelled' } }),
      Certificate.countDocuments()
    ]);

    res.json({
      success: true,
      data: {
        totalVolunteers,
        activeVolunteers,
        totalInterns,
        pendingInterns,
        totalEvents,
        upcomingEvents,
        totalRegistrations,
        totalCertificates
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMonthlyVolunteerGrowth = async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    const startYear = parseInt(year);

    const growth = await Volunteer.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${startYear}-01-01`),
            $lte: new Date(`${startYear}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const found = growth.find(g => g._id === month);
      return {
        month: new Date(startYear, month - 1).toLocaleString('default', { month: 'short' }),
        count: found ? found.count : 0
      };
    });

    res.json({ success: true, data: monthlyData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getEventParticipationTrends = async (req, res) => {
  try {
    const { months = 6 } = req.query;
    const sinceDate = new Date();
    sinceDate.setMonth(sinceDate.getMonth() - parseInt(months));

    const trends = await Registration.aggregate([
      {
        $match: {
          createdAt: { $gte: sinceDate },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          registrations: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const formattedTrends = trends.map(t => ({
      month: new Date(t._id.year, t._id.month - 1).toLocaleString('default', { month: 'short', year: 'numeric' }),
      registrations: t.registrations
    }));

    res.json({ success: true, data: formattedTrends });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getInternshipStatistics = async (req, res) => {
  try {
    const stats = await Internship.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const departmentStats = await Internship.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const total = stats.reduce((acc, s) => acc + s.count, 0);
    const statusMap = {};
    stats.forEach(s => { statusMap[s._id] = s.count; });

    res.json({
      success: true,
      data: {
        total,
        statusBreakdown: statusMap,
        departmentDistribution: departmentStats.map(d => ({
          department: d._id,
          count: d.count
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPopularEvents = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const popularEvents = await Event.aggregate([
      {
        $lookup: {
          from: 'registrations',
          localField: '_id',
          foreignField: 'event',
          as: 'registrations'
        }
      },
      {
        $addFields: {
          registrationCount: {
            $size: {
              $filter: {
                input: '$registrations',
                as: 'reg',
                cond: { $ne: ['$$reg.status', 'cancelled'] }
              }
            }
          }
        }
      },
      { $sort: { registrationCount: -1 } },
      { $limit: parseInt(limit) },
      {
        $project: {
          title: 1,
          category: 1,
          date: 1,
          venue: 1,
          capacity: 1,
          registeredCount: 1,
          registrationCount: 1,
          status: 1
        }
      }
    ]);

    res.json({ success: true, data: popularEvents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getMonthlyVolunteerGrowth,
  getEventParticipationTrends,
  getInternshipStatistics,
  getPopularEvents
};
