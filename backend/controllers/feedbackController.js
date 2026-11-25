const mongoose = require('mongoose');
const Feedback = require('../models/Feedback');
const sampleFeedback = require('../data/sampleFeedback');

const COURSE_DURATION_DEFAULTS = {
  'full-stack mern development': '12 Weeks',
  'ui/ux design fundamentals': '8 Weeks',
  'cloud architecture with mongodb atlas': '6 Weeks',
  'modern javascript & typescript': '10 Weeks',
  'restful api engineering & testing': '6 Weeks',
  'devops & ci/cd pipelines': '8 Weeks',
};

const generateNextCourseId = async () => {
  const existing = await Feedback.find({}, 'courseId').lean();
  let maxNumber = 100;

  for (const item of existing) {
    const match = String(item.courseId || '').match(/(\d+)$/);
    if (match) {
      const parsed = parseInt(match[1], 10);
      if (parsed > maxNumber) {
        maxNumber = parsed;
      }
    }
  }

  return `CRS-${maxNumber + 1}`;
};

const inferDuration = (courseName, providedDuration) => {
  if (providedDuration && String(providedDuration).trim()) {
    return String(providedDuration).trim();
  }
  const key = String(courseName || '').trim().toLowerCase();
  return COURSE_DURATION_DEFAULTS[key] || '8 Weeks';
};

const computeStats = (items) => {
  const totalCount = items.length;
  if (totalCount === 0) {
    return {
      totalCount: 0,
      averageRating: 0,
      topRatedCount: 0,
      needsAttentionCount: 0,
    };
  }

  const ratingSum = items.reduce((sum, item) => sum + Number(item.feedbackRating || 0), 0);
  const averageRating = Number((ratingSum / totalCount).toFixed(2));
  const topRatedCount = items.filter((item) => Number(item.feedbackRating) >= 4).length;
  const needsAttentionCount = items.filter((item) => Number(item.feedbackRating) <= 2).length;

  return {
    totalCount,
    averageRating,
    topRatedCount,
    needsAttentionCount,
  };
};

// @desc    Get all feedback entries with optional search and rating filter
// @route   GET /api/feedback
const getAllFeedback = async (req, res, next) => {
  try {
    const { search, rating } = req.query;
    const allItems = await Feedback.find().sort({ createdAt: -1 }).lean();
    const stats = computeStats(allItems);

    let filtered = allItems;

    if (search && String(search).trim()) {
      const term = String(search).trim().toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.courseId.toLowerCase().includes(term) ||
          item.courseName.toLowerCase().includes(term) ||
          item.courseDuration.toLowerCase().includes(term) ||
          item.feedbackComments.toLowerCase().includes(term)
      );
    }

    if (rating && rating !== 'all') {
      const targetRating = Number(rating);
      if (!Number.isNaN(targetRating)) {
        filtered = filtered.filter((item) => Math.round(item.feedbackRating) === targetRating);
      }
    }

    res.status(200).json({
      success: true,
      count: filtered.length,
      stats,
      data: filtered,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single feedback entry by ID
// @route   GET /api/feedback/:id
const getFeedbackById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid feedback ID format' });
    }

    const feedback = await Feedback.findById(id).lean();
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback entry not found' });
    }

    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new feedback entry
// @route   POST /api/feedback
const createFeedback = async (req, res, next) => {
  try {
    const { courseId, courseName, courseDuration, feedbackComments, feedbackRating } = req.body;

    if (!courseName || !String(courseName).trim()) {
      return res.status(400).json({ success: false, message: 'Course Name is required' });
    }
    if (!feedbackComments || !String(feedbackComments).trim()) {
      return res.status(400).json({ success: false, message: 'Feedback Comments are required' });
    }

    const numericRating = Number(feedbackRating);
    if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res
        .status(400)
        .json({ success: false, message: 'Feedback Rating must be a number between 1 and 5' });
    }

    const resolvedCourseId =
      courseId && String(courseId).trim()
        ? String(courseId).trim().toUpperCase()
        : await generateNextCourseId();

    const resolvedDuration = inferDuration(courseName, courseDuration);

    const created = await Feedback.create({
      courseId: resolvedCourseId,
      courseName: String(courseName).trim(),
      courseDuration: resolvedDuration,
      feedbackComments: String(feedbackComments).trim(),
      feedbackRating: numericRating,
    });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: created,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing feedback entry
// @route   PUT /api/feedback/:id
const updateFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid feedback ID format' });
    }

    const existing = await Feedback.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Feedback entry not found' });
    }

    const { courseId, courseName, courseDuration, feedbackComments, feedbackRating } = req.body;

    if (courseName !== undefined) {
      if (!String(courseName).trim()) {
        return res.status(400).json({ success: false, message: 'Course Name cannot be empty' });
      }
      existing.courseName = String(courseName).trim();
    }

    if (courseId !== undefined && String(courseId).trim()) {
      existing.courseId = String(courseId).trim().toUpperCase();
    }

    if (courseDuration !== undefined && String(courseDuration).trim()) {
      existing.courseDuration = String(courseDuration).trim();
    }

    if (feedbackComments !== undefined) {
      if (!String(feedbackComments).trim()) {
        return res
          .status(400)
          .json({ success: false, message: 'Feedback Comments cannot be empty' });
      }
      existing.feedbackComments = String(feedbackComments).trim();
    }

    if (feedbackRating !== undefined) {
      const numericRating = Number(feedbackRating);
      if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
        return res
          .status(400)
          .json({ success: false, message: 'Feedback Rating must be between 1 and 5' });
      }
      existing.feedbackRating = numericRating;
    }

    const updated = await existing.save();

    res.status(200).json({
      success: true,
      message: 'Feedback updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a feedback entry
// @route   DELETE /api/feedback/:id
const deleteFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid feedback ID format' });
    }

    const deleted = await Feedback.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Feedback entry not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully',
      data: { id: deleted._id },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Seed sample course feedback if collection is empty
// @route   POST /api/feedback/seed
const seedSampleFeedback = async (req, res, next) => {
  try {
    const count = await Feedback.countDocuments();
    if (count > 0) {
      return res.status(200).json({
        success: true,
        message: 'Database already contains feedback entries',
        insertedCount: 0,
      });
    }

    const inserted = await Feedback.insertMany(sampleFeedback);
    res.status(201).json({
      success: true,
      message: 'Sample feedback entries loaded successfully',
      insertedCount: inserted.length,
      data: inserted,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllFeedback,
  getFeedbackById,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  seedSampleFeedback,
};
