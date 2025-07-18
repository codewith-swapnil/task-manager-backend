const projectService = require('../services/project.service');

exports.createProject = async (req, res) => {
  try {
    const project = await projectService.createProject(req.user.id, req.body);
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await projectService.getProjects(req.user.id);
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProject = async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.id, req.user.id);
    res.json(project);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const updated = await projectService.updateProject(req.params.id, req.user.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    await projectService.deleteProject(req.params.id, req.user.id);
    res.status(204).send();
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const project = await projectService.addMember(req.params.id, req.body.userId, req.user.id);
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const project = await projectService.deleteMember(req.params.projectId, req.body.userId, req.params.memberId);
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
