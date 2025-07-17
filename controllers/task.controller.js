const taskService = require('../services/task.service');

exports.createTask = async (req, res) => {
  try {
    const task = await taskService.createTask(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await taskService.getTasks(req.user.id);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTask = async (req, res) => {
  try {
    const task = await taskService.getTaskById(req.params.id, req.user.id);
    res.json(task);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const updatedTask = await taskService.updateTask(req.params.id, req.body, req.user.id);
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await taskService.deleteTask(req.params.id, req.user.id);
    res.status(204).send();
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

exports.getTasksByProject = async (req, res) => {
  try {
    const tasks = await taskService.getTasksByProject(req.params.projectId);
    res.json(tasks);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const task = await taskService.updateTaskStatus(req.params.id, req.body.status, req.user.id);
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// File Upload Related Controllers
exports.uploadTaskFiles = async (req, res) => {
  try {
    const files = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype,
      uploadedBy: req.user.id
    }));

    const task = await taskService.addFilesToTask(req.params.id, files, req.user.id);
    res.status(201).json(task.files);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getTaskFiles = async (req, res) => {
  try {
    const files = await taskService.getTaskFiles(req.params.id, req.user.id);
    res.json(files);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

exports.deleteTaskFile = async (req, res) => {
  try {
    await taskService.deleteTaskFile(req.params.id, req.params.fileId, req.user.id);
    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};