const Review = require('../models/Review');
const Product = require('../models/Product');

// Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sort = '-createdAt',
      product,
      status,
      rating
    } = req.query;

    // Build query
    const query = {};

    // Filter by product
    if (product) {
      query.product = product;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by rating
    if (rating) {
      query.rating = Number(rating);
    }

    // Execute query with pagination
    const reviews = await Review.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('product', 'name images');

    // Get total documents
    const count = await Review.countDocuments(query);

    res.status(200).json({
      reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalReviews: count
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};

// Get reviews for a product
exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

    // Check if product exists
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get approved reviews only for public API
    const reviews = await Review.find({ 
      product: productId,
      status: 'approved'
    })
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total documents
    const count = await Review.countDocuments({ 
      product: productId,
      status: 'approved'
    });

    // Calculate average rating
    const ratingStats = await Review.aggregate([
      { $match: { product: productExists._id, status: 'approved' } },
      { 
        $group: { 
          _id: null, 
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratings: {
            $push: '$rating'
          }
        } 
      }
    ]);

    // Calculate rating distribution
    let ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    if (ratingStats.length > 0 && ratingStats[0].ratings) {
      ratingStats[0].ratings.forEach(rating => {
        ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
      });
    }

    res.status(200).json({
      reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalReviews: count,
      avgRating: ratingStats.length > 0 ? ratingStats[0].avgRating : 0,
      ratingDistribution
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching product reviews',
      error: error.message
    });
  }
};

// Create new review
exports.createReview = async (req, res) => {
  try {
    const { product } = req.body;
    
    // Check if product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Create review with pending status
    const review = await Review.create({
      ...req.body,
      status: 'pending'
    });

    res.status(201).json({
      message: 'Review submitted successfully and pending approval',
      review
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error creating review',
      error: error.message
    });
  }
};

// Update review status (admin only)
exports.updateReviewStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Valid status is required' });
    }
    
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({
      message: 'Review status updated successfully',
      review
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error updating review status',
      error: error.message
    });
  }
};

// Delete review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting review',
      error: error.message
    });
  }
};

// Mark review as helpful
exports.markReviewHelpful = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { 'helpful.count': 1 } },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({
      message: 'Review marked as helpful',
      helpfulCount: review.helpful.count
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error marking review as helpful',
      error: error.message
    });
  }
};

// Get review by ID
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('product', 'name images')
      .populate('user', 'name');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching review',
      error: error.message
    });
  }
};

// Update review
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error updating review',
      error: error.message
    });
  }
};

// Approve review
exports.approveReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({
      message: 'Review approved successfully',
      review
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error approving review',
      error: error.message
    });
  }
};
