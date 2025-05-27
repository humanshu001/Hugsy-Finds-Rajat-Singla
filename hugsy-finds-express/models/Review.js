const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  guestName: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    trim: true
  },
  comment: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Static method to calculate average rating for a product
reviewSchema.statics.getAverageRating = async function(productId) {
  const result = await this.aggregate([
    {
      $match: { 
        product: productId,
        isApproved: true
      }
    },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        numReviews: { $sum: 1 }
      }
    }
  ]);
  
  return result.length > 0 
    ? { 
        averageRating: parseFloat(result[0].averageRating.toFixed(1)), 
        numReviews: result[0].numReviews 
      } 
    : { 
        averageRating: 0, 
        numReviews: 0 
      };
};

// Update product rating after save
reviewSchema.post('save', async function() {
  await this.constructor.getAverageRating(this.product);
});

// Update product rating after remove
reviewSchema.post('remove', async function() {
  await this.constructor.getAverageRating(this.product);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
