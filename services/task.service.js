const Task = require('../models/Task');

exports.createTask = async (data) => {
  const task = new Task({ ...data });
  return await task.save();
};

exports.getTasks = async (queryParams = {}) => {
  try {
    console.log('Service received params:', queryParams);

    const {
      page = 1,
      limit = 10,
      status,
      assignedUser,
      project,
      searchQuery,
      dueDateFrom,
      dueDateTo,
      userId
    } = queryParams;

    // Base query conditions
    const query = {};

    // Filter logic
    if (assignedUser) {
      query.assignedUser = assignedUser;
    }

    if (status) query.status = status;
    if (project) query.project = project;

    if (dueDateFrom || dueDateTo) {
      query.dueDate = {};
      if (dueDateFrom) query.dueDate.$gte = new Date(dueDateFrom);
      if (dueDateTo) query.dueDate.$lte = new Date(dueDateTo);
    }

    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } }
      ];
    }

    console.log('Final MongoDB query:', JSON.stringify(query, null, 2));

    const [tasks, totalCount] = await Promise.all([
      Task.find(query)
        .sort({ dueDate: 1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate('assignedUser', 'name email avatar')
        .populate('project', 'title')
        .populate('files.uploadedBy', 'name email'),
      Task.countDocuments(query)
    ]);

    console.log(`Found ${tasks.length} tasks matching query`);

    return {
      tasks,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: parseInt(page),
      limit: parseInt(limit)
    };

  } catch (error) {
    console.error('Service error:', {
      message: error.message,
      stack: error.stack,
      queryParams
    });
    throw error;
  }
};

exports.getTaskById = async (taskId) => {
  const task = await Task.findOne({ _id: taskId })
    .populate('assignedUser')
    .populate('project')
    .populate('files.uploadedBy', 'name email');
  if (!task) throw new Error('Task not found');
  return task;
};

exports.updateTask = async (taskId, data, userId) => {
  const task = await Task.findOneAndUpdate(
    {
      _id: taskId,
      // $or: [
      //   { assignedUser: userId },  // Either assigned to the user
      //   { createdBy: userId }    // Or created by the user
      // ]
    },
    data,
    { new: true, runValidators: true }
  )
    .populate('assignedUser', 'name email avatar')
    .populate('project', 'title');

  if (!task) throw new Error('Task not found or permission denied');
  return task;
};

exports.deleteTask = async (taskId, userId) => {
  const task = await Task.findOneAndDelete({ _id: taskId, assignedUser: userId });
  if (!task) throw new Error('Task not found or permission denied');
};

exports.getTasksByProject = async (projectId) => {
  return await Task.find({ project: projectId })
    .populate('assignedUser')
    .populate('project')
    .populate('files.uploadedBy', 'name email');
};

exports.updateTaskStatus = async (taskId, userId, status) => {
  const task = await Task.findOneAndUpdate(
    { _id: taskId, assignedUser: userId },
    { status },
    { new: true }
  )
    .populate('assignedUser')
    .populate('project')
    .populate('files.uploadedBy', 'name email');
  if (!task) throw new Error('Task not found or permission denied');
  return task;
};

// File Upload Related Services
exports.addFilesToTask = async (taskId, files, userId) => {
  const task = await Task.findOne({ _id: taskId });
  if (!task) throw new Error('Task not found or permission denied');

  task.files.push(...files);
  await task.save();
  return task;
};

exports.getTaskFiles = async (taskId, userId) => {
  const task = await Task.findOne({ _id: taskId, assignedUser: userId })
    .populate('files.uploadedBy', 'name email');
  if (!task) throw new Error('Task not found or permission denied');
  return task.files;
};

exports.deleteTaskFile = async (taskId, fileId, userId) => {
  const task = await Task.findOne({ _id: taskId });
  if (!task) throw new Error('Task not found');

  // Check if user is the uploader or admin (you might want to add admin check)
  const file = task.files.id(fileId);
  if (!file) throw new Error('File not found');
  if (file.uploadedBy.toString() !== userId.toString()) {
    throw new Error('Permission denied - you can only delete your own files');
  }

  task.files.pull(fileId);
  await task.save();
  return task;
};