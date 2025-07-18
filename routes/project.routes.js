const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const { authenticate } = require('../middleware/auth');


router.post('/', authenticate, projectController.createProject);
router.get('/', authenticate, projectController.getProjects);
router.get('/:id', authenticate, projectController.getProject);
router.put('/:id', authenticate, projectController.updateProject);
router.delete('/:id', authenticate, projectController.deleteProject);
router.post('/:id/members', authenticate, projectController.addMember);
router.delete('/:projectId/members/:memberId', authenticate, projectController.deleteMember);

module.exports = router;