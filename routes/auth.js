// /routes/auth.js

const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getLoggedInUser } = require('../controllers/authController');
const auth = require('../middleware/auth');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', registerUser);

// @route   POST api/auth/login
// @desc    Auth user & get token
// @access  Public
router.post('/login', loginUser);

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
router.get('/', auth, getLoggedInUser);

module.exports = router;