require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Feedback = require('./models/Feedback');
const sampleFeedback = require('./data/sampleFeedback');

const seedDatabase = async () => {
  try {
    await connectDB();
    const forceReset = process.argv.includes('--reset');

    if (forceReset) {
      await Feedback.deleteMany({});
      console.log('Cleared existing feedback collection.');
    }

    const existingCount = await Feedback.countDocuments();
    if (existingCount > 0) {
      console.log(`Collection already has ${existingCount} entries. Pass --reset to overwrite.`);
    } else {
      await Feedback.insertMany(sampleFeedback);
      console.log(`Seeded ${sampleFeedback.length} sample course feedback entries.`);
    }
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seedDatabase();
