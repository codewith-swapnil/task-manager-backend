const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const { authenticate } = require('../middleware/auth');
const upload = require('../utils/fileUpload');

// Existing routes
router.post('/', authenticate, taskController.createTask);
router.get('/', authenticate, taskController.getTasks);
router.get('/:id', authenticate, taskController.getTask);
router.put('/:id', authenticate, taskController.updateTask);
router.delete('/:id', authenticate, taskController.deleteTask);
router.get('/project/:projectId', authenticate, taskController.getTasksByProject);
router.patch('/:id/status', authenticate, taskController.updateTaskStatus);

// New file upload routes
router.post('/:id/files', authenticate, upload.array('files'), taskController.uploadTaskFiles);
router.get('/:id/files', authenticate, taskController.getTaskFiles);
router.delete('/:id/files/:fileId', authenticate, taskController.deleteTaskFile);

module.exports = router;