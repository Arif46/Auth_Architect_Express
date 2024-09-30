const express = require('express');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const connectDB = require('./db'); // MongoDB connection
const authRoutes = require('./routes/authRoutes'); // Authentication routes
const studentRoutes = require('./routes/studentRoutes');

const app = express();
const port = 3000;

// Connect to MongoDB
connectDB();

// Passport config
require('./config/Passport')(passport);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Express session middleware
app.use(
  session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes); // Use student routes

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
