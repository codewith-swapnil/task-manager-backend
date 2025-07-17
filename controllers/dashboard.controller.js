const Project = require('../models/Project');
const Task = require('../models/Task');
const mongoose = require('mongoose');

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // 1. Verify and convert user ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }
    const userIdObj = new mongoose.Types.ObjectId(userId);
    console.log('Searching for projects with user ID:', userIdObj.toString());

    // 2. Debug queries
    const createdCount = await Project.countDocuments({ createdBy: userIdObj });
    const memberCount = await Project.countDocuments({ members: userIdObj });
    console.log(`Debug counts - Created: ${createdCount}, Member: ${memberCount}`);

    // 3. Main query with proper ObjectId comparison
    const userProjects = await Project.find({
      $or: [
        { createdBy: { $eq: userIdObj } },
        { members: { $in: [userIdObj] } }
      ]
    }).lean();

    console.log('Found projects:', userProjects.map(p => ({
      id: p._id,
      title: p.title,
      // createdBy: p.createdBy,                   
      members: p.members
    })));

    // 4. Rest of your logic...
    const projectCount = userProjects.length;
    const taskCount = await Task.countDocuments({ assignedUser: userIdObj });

    const tasksByStatus = await Task.aggregate([
      { $match: { assignedUser: userIdObj } },
      { $group: { 
        _id: '$status',
        count: { $sum: 1 }
      }}
    ]);

    const statusCounts = {
      Todo: 0,
      'In Progress': 0,
      Completed: 0
    };

    tasksByStatus.forEach(status => {
      statusCounts[status._id] = status.count;
    });

    res.json({
      success: true,
      data: {
        projectCount,
        taskCount,
        statusCounts,
        debug: {
          userId: userId,
          userIdObj: userIdObj.toString(),
          foundProjects: projectCount
        }
      }
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard data',
      error: error.message
    });
  }
};