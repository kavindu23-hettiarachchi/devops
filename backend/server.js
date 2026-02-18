const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const foodRoutes = require('./routes/food');
const cartRoutes = require('./routes/order');
const orderRoutes = require('./routes/orders');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:80'], // Frontend URLs
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Test routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Show instructions for POST endpoints when accessed via GET
app.get('/api/auth/login', (req, res) => {
  res.json({ 
    message: 'This is a POST endpoint. Please send a POST request with email and password in the body.',
    example: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        email: 'user@example.com',
        password: 'yourpassword'
      }
    }
  });
});

app.get('/api/auth/register', (req, res) => {
  res.json({ 
    message: 'This is a POST endpoint. Please send a POST request with the following data.',
    example: {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data' },
      body: {
        username: 'yourname',
        email: 'user@example.com',
        password: 'yourpassword',
        avatar: '(optional) file upload'
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Database connection and server startup
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();