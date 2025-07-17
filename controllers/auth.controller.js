const authService = require('../services/auth.service');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.allUsers = async (req, res, next) => {
  try {
    const users = await authService.getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};