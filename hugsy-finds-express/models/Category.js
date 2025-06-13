const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    unique: true
  },
  slug: {
    type: String,
    required: [true, 'Category slug is required'],
    trim: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create index for faster queries
categorySchema.index({ name: 1 });
categorySchema.index({ slug: 1 });

module.exports = mongoose.model('Category', categorySchema);