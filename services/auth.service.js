const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class AuthService {
  async registerUser(userData) {
    const { name, email, password, role } = userData;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = new User({ name, email, password, role });
    await user.save();
    return user;
  }

  async loginUser(email, password) {
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    };
  }

  async getCurrentUser(userId) {
    return await User.findById(userId).select('-password');
  }

  async getAllUsers() {
    return await User.find();
  }
}

module.exports = new AuthService();