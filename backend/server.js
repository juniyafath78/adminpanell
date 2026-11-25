require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const feedbackRoutes = require('./routes/feedbackRoutes');
const Feedback = require('./models/Feedback');
const sampleFeedback = require('./data/sampleFeedback');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  const readyState = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.status(200).json({
    success: true,
    service: 'feedback-admin-backend',
    database: states[readyState] || 'unknown',
    timestamp: new Date().toISOString(),
  });
});

// Feedback CRUD routes
app.use('/api/feedback', feedbackRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: messages.join(', '),
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid resource identifier',
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const seedInitialDataOnce = async () => {
  const seedMetaCollection = mongoose.connection.collection('app_metadata');
  const marker = await seedMetaCollection.findOne({ key: 'initial_feedback_seeded' });
  const existingCount = await Feedback.countDocuments();

  if (!marker && existingCount === 0) {
    await Feedback.insertMany(sampleFeedback);
    await seedMetaCollection.insertOne({
      key: 'initial_feedback_seeded',
      seededAt: new Date(),
    });
    console.log(`Initialized MongoDB Atlas with ${sampleFeedback.length} sample feedback entries.`);
  }
};

const startServer = async () => {
  try {
    await connectDB();
    await seedInitialDataOnce();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
