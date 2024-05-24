const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const playerRoute = require('./routes/PlayerRoute');
const coachRoute = require('./routes/CoachRoute');
const academyRoute = require('./routes/AcademyRoute');
const playerPostRoute = require('./routes/PlayerPostRoute');
const coachPostRoute = require('./routes/coachPostRoute');
const AdminRoute = require('./routes/AdminRoute');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// CORS options
const corsOptions = {
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
};

// // CORS options
// const corsOptions = {
//   origin: '*', // Allow all origins
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
//   allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
//   optionsSuccessStatus: 200,
// };

// Enable CORS with options
app.use(cors(corsOptions));

// Logging middleware
app.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.url);
  next();
});

// Routes
app.use('/api/player', playerRoute);
app.use('/api/coach', coachRoute);
app.use('/api/academy', academyRoute);
app.use('/api/playerpost', playerPostRoute);
app.use('/api/coachpost', coachPostRoute);
app.use('/api/admin', AdminRoute);
// Database connection and server start
mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log('Server started on port', process.env.PORT);
      console.log('Connected to database');
    });
  })
  .catch((err) => {
    console.error('Error connecting to database:', err);
  });
