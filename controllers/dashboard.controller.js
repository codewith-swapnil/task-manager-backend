// controllers/dashboard.controller.js
const Project = require('../models/Project');
const Task = require('../models/Task');

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Fetching dashboard stats for user:', userId);
    // Get projects count (where user is creator or member)
    console.log('Fetching project count for user:', userId);
    // Get projects count (where user is creator or member)
    const projectCount = await Project.countDocuments({
      $or: [
        { createdBy: userId },
        { members: userId }
      ]
    });
    console.log('Project count:', projectCount);

    // Get tasks assigned to user
    console.log('Fetching task count for user:', userId);
    // Get tasks assigned to user
    const taskCount = await Task.countDocuments({ assignedTo: userId });

    // Get tasks grouped by status
    const tasksByStatus = await Task.aggregate([
      { $match: { assignedTo: userId } },
      { $group: { 
        _id: '$status',
        count: { $sum: 1 }
      }}
    ]);

    // Format status counts
    const statusCounts = {
      Todo: 0,
      'In Progress': 0,
      Completed: 0
    };

    tasksByStatus.forEach(status => {
      statusCounts[status._id] = status.count;
    });
    console.log('Status counts:', statusCounts);
    res.json({
      success: true,
      data: {
        projectCount,
        taskCount,
        statusCounts
      }
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard data'
    });
  }
};