const Project = require('../models/Project');
const User = require('../models/User'); // Only if you need to check valid users

exports.createProject = async (userId, data) => {
  const project = new Project({ ...data, createdBy: userId, members: [userId] });
  return await project.save();
};

exports.getProjects = async (userId) => {
  return await Project.find({ members: userId });
};

exports.getProjectById = async (projectId, userId) => {
  const project = await Project.findOne({ _id: projectId, members: userId });
  if (!project) throw new Error('Project not found or access denied');
  return project;
};

exports.updateProject = async (projectId, userId, data) => {
  const project = await Project.findOneAndUpdate(
    { _id: projectId, createdBy: userId },
    data,
    { new: true }
  );
  if (!project) throw new Error('Project not found or permission denied');
  return project;
};

exports.deleteProject = async (projectId, userId) => {
  const project = await Project.findOneAndDelete({ _id: projectId, createdBy: userId });
  if (!project) throw new Error('Project not found or permission denied');
};

exports.addMember = async (projectId, newMemberId, userId) => {
  const project = await Project.findOne({ _id: projectId, createdBy: userId });
  if (!project) throw new Error('Only project creator can add members');

  if (!project.members.includes(newMemberId)) {
    project.members.push(newMemberId);
    await project.save();
  }

  return project;
};
