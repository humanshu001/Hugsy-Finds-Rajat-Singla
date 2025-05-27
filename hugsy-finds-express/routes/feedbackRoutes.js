const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const feedbackController = require('../controllers/feedbackController');

// @route   GET /api/feedbacks
// @desc    Get all feedbacks
// @access  Public
router.get('/', feedbackController.getFeedbacks);

// @route   GET /api/feedbacks/recent
// @desc    Get recent feedbacks
// @access  Public
router.get('/recent', feedbackController.getRecentFeedbacks);

// @route   GET /api/feedbacks/:id
// @desc    Get a feedback by ID
// @access  Public
router.get('/:id', feedbackController.getFeedbackById);

// @route   POST /api/feedbacks
// @desc    Create a new feedback
// @access  Public
router.post('/',
  [
    check('name', 'Name is required').notEmpty(),
    check('feedback', 'Feedback is required').notEmpty()
  ],
  feedbackController.createFeedback
);

// @route   PUT /api/feedbacks/:id
// @desc    Update a feedback
// @access  Public
router.put('/:id', feedbackController.updateFeedback);

// @route   DELETE /api/feedbacks/:id
// @desc    Delete a feedback
// @access  Public
router.delete('/:id', feedbackController.deleteFeedback);

// @route   POST /api/feedbacks/:id/respond
// @desc    Respond to a feedback
// @access  Public
router.post('/:id/respond', feedbackController.respondToFeedback);

module.exports = router;