const Feedback = require('../models/Feedback');

// Get all feedback
exports.getAllFeedback = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sort = '-createdAt',
      status,
      type,
      priority
    } = req.query;

    // Build query
    const query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by type
    if (type) {
      query.type = type;
    }

    // Filter by priority
    if (priority) {
      query.priority = priority;
    }

    // Execute query with pagination
    const feedback = await Feedback.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total documents
    const count = await Feedback.countDocuments(query);

    res.status(200).json({
      feedback,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalFeedback: count
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching feedback',
      error: error.message
    });
  }
};

// Get single feedback
exports.getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching feedback',
      error: error.message
    });
  }
};

// Create new feedback
exports.createFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.create(req.body);

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error submitting feedback',
      error: error.message
    });
  }
};

// Update feedback status
exports.updateFeedbackStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['new', 'in_progress', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Valid status is required' });
    }
    
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.status(200).json({
      message: 'Feedback status updated successfully',
      feedback
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error updating feedback status',
      error: error.message
    });
  }
};

// Update feedback priority
exports.updateFeedbackPriority = async (req, res) => {
  try {
    const { priority } = req.body;
    
    if (!priority || !['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({ message: 'Valid priority is required' });
    }
    
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { priority },
      { new: true, runValidators: true }
    );

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.status(200).json({
      message: 'Feedback priority updated successfully',
      feedback
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error updating feedback priority',
      error: error.message
    });
  }
};

// Add response to feedback
exports.addFeedbackResponse = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Response message is required' });
    }
    
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { 
        response: {
          message,
          respondedAt: new Date()
        },
        status: 'resolved' // Automatically mark as resolved when response is added
      },
      { new: true, runValidators: true }
    );

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.status(200).json({
      message: 'Response added successfully',
      feedback
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error adding response',
      error: error.message
    });
  }
};

// Delete feedback
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.status(200).json({
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting feedback',
      error: error.message
    });
  }
};

// Get feedback statistics
exports.getFeedbackStats = async (req, res) => {
  try {
    const statusCounts = await Feedback.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const typeCounts = await Feedback.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const priorityCounts = await Feedback.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.status(200).json({
      statusCounts: statusCounts.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      typeCounts: typeCounts.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      priorityCounts: priorityCounts.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {})
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching feedback statistics',
      error: error.message
    });
  }
};