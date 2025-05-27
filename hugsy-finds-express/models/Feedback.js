const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  mobile: {
    type: String,
    trim: true
  },
  feedback: {
    type: String,
    required: true
  },
  isResolved: {
    type: Boolean,
    default: false
  },
  adminResponse: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;