require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db.js');
const errorHandler = require('./utils/errorHandler');

// Import the centralized routes
const apiRoutes = require('./routes');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Database connection
connectDB();

// Routes
app.use('/api', apiRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});