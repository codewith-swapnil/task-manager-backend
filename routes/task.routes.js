const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, taskController.createTask);
router.get('/', authenticate, taskController.getTasks);
router.get('/:id', authenticate, taskController.getTask);
router.put('/:id', authenticate, taskController.updateTask);
router.delete('/:id', authenticate, taskController.deleteTask);
router.get('/project/:projectId', authenticate, taskController.getTasksByProject);
router.patch('/:id/status', authenticate, taskController.updateTaskStatus);

module.exports = router;