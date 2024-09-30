const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User'); // Import User model
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/auth'); // Import the middleware

// Register route
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Create a new user
    const newUser = new User({ username, password });
    await newUser.save();

    // Optionally, you can generate a JWT token upon registration as well
    //const token = jwt.sign({ id: newUser.id }, 'yourSecretKey', { expiresIn: '1h' });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
      },
      //token, // Return the token here if you want
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, userWithToken, info) => {
    if (err) return next(err);
    if (!userWithToken) return res.status(400).json({ message: info.message });

    req.logIn(userWithToken.user, (err) => {
      if (err) return next(err);
      
      res.json({
        message: 'Logged in successfully',
        user: userWithToken.user,
        token: userWithToken.token, // Return the token
      });
    });
  })(req, res, next);
});

// Protected route example
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;
