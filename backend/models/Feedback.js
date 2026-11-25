const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    courseId: {
      type: String,
      required: [true, 'Course ID is required'],
      trim: true,
      uppercase: true,
      maxlength: [24, 'Course ID cannot exceed 24 characters'],
    },
    courseName: {
      type: String,
      required: [true, 'Course Name is required'],
      trim: true,
      minlength: [2, 'Course Name must be at least 2 characters'],
      maxlength: [120, 'Course Name cannot exceed 120 characters'],
    },
    courseDuration: {
      type: String,
      required: [true, 'Course Duration is required'],
      trim: true,
      default: '8 Weeks',
      maxlength: [50, 'Course Duration cannot exceed 50 characters'],
    },
    feedbackComments: {
      type: String,
      required: [true, 'Feedback Comments are required'],
      trim: true,
      minlength: [3, 'Feedback Comments must be at least 3 characters'],
      maxlength: [1000, 'Feedback Comments cannot exceed 1000 characters'],
    },
    feedbackRating: {
      type: Number,
      required: [true, 'Feedback Rating is required'],
      min: [1, 'Feedback Rating must be at least 1'],
      max: [5, 'Feedback Rating cannot exceed 5'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
