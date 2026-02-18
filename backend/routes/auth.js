const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Register route
router.post('/register', upload.single('avatar'), register);

// Login route
router.post('/login', login);

// Get profile route
router.get('/profile', auth, getProfile);

module.exports = router;