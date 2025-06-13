const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// GET all feedback
router.get('/', feedbackController.getAllFeedback);

// GET single feedback by ID
router.get('/:id', feedbackController.getFeedbackById);

// POST create new feedback
router.post('/', feedbackController.createFeedback);

// PATCH update feedback status
router.patch('/:id/status', feedbackController.updateFeedbackStatus);

// PATCH update feedback priority
router.patch('/:id/priority', feedbackController.updateFeedbackPriority);

// PATCH add response to feedback
router.patch('/:id/respond', feedbackController.addFeedbackResponse);

// DELETE feedback
router.delete('/:id', feedbackController.deleteFeedback);

// GET feedback statistics
router.get('/stats/summary', feedbackController.getFeedbackStats);

module.exports = router;