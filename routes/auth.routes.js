const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const dashboardController = require('../controllers/dashboard.controller');
const { authenticate } = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticate, authController.getMe);

// Dashboard route (protected)
router.get('/dashboard', authenticate, dashboardController.getDashboardStats);

module.exports = router;