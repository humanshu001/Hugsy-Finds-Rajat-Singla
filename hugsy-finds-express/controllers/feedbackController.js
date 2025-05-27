const Feedback = require('../models/Feedback');
const { validationResult } = require('express-validator');

// @desc    Get all feedbacks
// @route   GET /api/feedbacks
// @access  Public
exports.getFeedbacks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Feedback.countDocuments();
    
    res.json({
      items: feedbacks,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get feedbacks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a feedback by ID
// @route   GET /api/feedbacks/:id
// @access  Public
exports.getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    res.json(feedback);
  } catch (error) {
    console.error('Get feedback by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new feedback
// @route   POST /api/feedbacks
// @access  Public
exports.createFeedback = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, email, mobile, feedback } = req.body;
    
    // Validate required fields
    if (!name || !feedback) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const newFeedback = await Feedback.create({
      name,
      email: email || '',
      mobile: mobile || '',
      feedback
    });
    
    res.status(201).json({
      message: 'Feedback submitted successfully',
      id: newFeedback._id
    });
  } catch (error) {
    console.error('Create feedback error:', error);
    res.status(500).json({ message: 'Unable to submit feedback' });
  }
};

// @desc    Update a feedback
// @route   PUT /api/feedbacks/:id
// @access  Public
exports.updateFeedback = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const feedback = await Feedback.findById(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    const { name, email, mobile, feedback: feedbackText, isResolved, adminResponse } = req.body;
    
    // Update feedback fields
    if (name) feedback.name = name;
    if (email !== undefined) feedback.email = email;
    if (mobile !== undefined) feedback.mobile = mobile;
    if (feedbackText) feedback.feedback = feedbackText;
    if (isResolved !== undefined) feedback.isResolved = isResolved;
    if (adminResponse !== undefined) feedback.adminResponse = adminResponse;
    
    const updatedFeedback = await feedback.save();
    
    res.json({
      message: 'Feedback updated successfully',
      feedback: updatedFeedback
    });
  } catch (error) {
    console.error('Update feedback error:', error);
    res.status(500).json({ message: 'Unable to update feedback' });
  }
};

// @desc    Delete a feedback
// @route   DELETE /api/feedbacks/:id
// @access  Public
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    await feedback.remove();
    
    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({ message: 'Unable to delete feedback' });
  }
};

// @desc    Get recent feedbacks
// @route   GET /api/feedbacks/recent
// @access  Public
exports.getRecentFeedbacks = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .limit(limit);
    
    res.json(feedbacks);
  } catch (error) {
    console.error('Get recent feedbacks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Respond to a feedback
// @route   POST /api/feedbacks/:id/respond
// @access  Public
exports.respondToFeedback = async (req, res) => {
  try {
    const { response } = req.body;
    
    if (!response) {
      return res.status(400).json({ message: 'Response is required' });
    }
    
    const feedback = await Feedback.findById(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    feedback.adminResponse = response;
    feedback.isResolved = true;
    
    const updatedFeedback = await feedback.save();
    
    res.json({
      message: 'Response added successfully',
      feedback: updatedFeedback
    });
  } catch (error) {
    console.error('Respond to feedback error:', error);
    res.status(500).json({ message: 'Unable to respond to feedback' });
  }
};