const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User'); // Import User model
const jwt = require('jsonwebtoken');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
          return done(null, false, { message: 'No user found' });
        }

        // Match password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id }, 'yourSecretKey', { expiresIn: '1h' });

        return done(null, { user, token }); // Return user and token
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
