const Task = require('../models/Task');

exports.createTask = async (userId, data) => {
  const task = new Task({ ...data, createdBy: userId });
  return await task.save();
};

exports.getTasks = async (userId) => {
  return await Task.find({ createdBy: userId }).populate('assignedTo').populate('projectId');
};

exports.getTaskById = async (taskId, userId) => {
  const task = await Task.findOne({ _id: taskId, createdBy: userId });
  if (!task) throw new Error('Task not found');
  return task;
};

exports.updateTask = async (taskId, userId, data) => {
  const task = await Task.findOneAndUpdate(
    { _id: taskId, createdBy: userId },
    data,
    { new: true }
  );
  if (!task) throw new Error('Task not found or permission denied');
  return task;
};

exports.deleteTask = async (taskId, userId) => {
  const task = await Task.findOneAndDelete({ _id: taskId, createdBy: userId });
  if (!task) throw new Error('Task not found or permission denied');
};

exports.getTasksByProject = async (projectId, userId) => {
  return await Task.find({ projectId, createdBy: userId });
};

exports.updateTaskStatus = async (taskId, userId, status) => {
  const task = await Task.findOneAndUpdate(
    { _id: taskId, createdBy: userId },
    { status },
    { new: true }
  );
  if (!task) throw new Error('Task not found or permission denied');
  return task;
};
