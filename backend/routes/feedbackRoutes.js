const express = require('express');
const {
  getAllFeedback,
  getFeedbackById,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  seedSampleFeedback,
} = require('../controllers/feedbackController');

const router = express.Router();

router.route('/').get(getAllFeedback).post(createFeedback);
router.post('/seed', seedSampleFeedback);
router.route('/:id').get(getFeedbackById).put(updateFeedback).delete(deleteFeedback);

module.exports = router;
