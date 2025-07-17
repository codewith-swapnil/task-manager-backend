const Task = require('../models/Task');

exports.createTask = async (data) => {
  const task = new Task({ ...data });
  return await task.save();
};

exports.getTasks = async (userId) => {
  return await Task.find({ assignedTo: userId })
    .populate('assignedTo')
    .populate('project')
    .populate('files.uploadedBy', 'name email');
};

exports.getTaskById = async (taskId, userId) => {
  const task = await Task.findOne({ _id: taskId, assignedTo: userId })
    .populate('assignedTo')
    .populate('project')
    .populate('files.uploadedBy', 'name email');
  if (!task) throw new Error('Task not found');
  return task;
};

exports.updateTask = async (taskId, userId, data) => {
  const task = await Task.findOneAndUpdate(
    { _id: taskId, assignedTo: userId },
    data,
    { new: true }
  )
    .populate('assignedTo')
    .populate('project')
    .populate('files.uploadedBy', 'name email');
  if (!task) throw new Error('Task not found or permission denied');
  return task;
};

exports.deleteTask = async (taskId, userId) => {
  const task = await Task.findOneAndDelete({ _id: taskId, assignedTo: userId });
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
    { _id: taskId, assignedTo: userId },
    { status },
    { new: true }
  )
    .populate('assignedTo')
    .populate('project')
    .populate('files.uploadedBy', 'name email');
  if (!task) throw new Error('Task not found or permission denied');
  return task;
};

// File Upload Related Services
exports.addFilesToTask = async (taskId, files, userId) => {
  const task = await Task.findOne({ _id: taskId, assignedTo: userId });
  if (!task) throw new Error('Task not found or permission denied');

  task.files.push(...files);
  await task.save();
  return task;
};

exports.getTaskFiles = async (taskId, userId) => {
  const task = await Task.findOne({ _id: taskId, assignedTo: userId })
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