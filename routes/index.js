const express = require('express');
const router = express.Router();

// Import all route files
const authRoutes = require('./auth.routes');
const projectRoutes = require('./project.routes');
const taskRoutes = require('./task.routes');

// API health check endpoint
router.get('/', (req, res) => {
  res.json({ message: 'Project Management API - Healthy' });
});

// Mount individual route files
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);

module.exports = router;