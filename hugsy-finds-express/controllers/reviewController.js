const Review = require('../models/Review');
const Product = require('../models/Product');
const { validationResult } = require('express-validator');

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
exports.getReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Filter by product if provided
    const filter = {};
    if (req.query.product) {
      filter.product = req.query.product;
    }
    
    // Filter by approval status if provided
    if (req.query.approved) {
      filter.isApproved = req.query.approved === 'true';
    }
    
    const reviews = await Review.find(filter)
      .populate('product', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Review.countDocuments(filter);
    
    res.json({
      items: reviews,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a review by ID
// @route   GET /api/reviews/:id
// @access  Public
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('product', 'name images');
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    res.json(review);
  } catch (error) {
    console.error('Get review by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Public
exports.createReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { 
      product, 
      user, 
      guestName, 
      rating, 
      title, 
      comment, 
      isVerifiedPurchase 
    } = req.body;
    
    // Check if product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Handle image uploads
    const images = req.files ? req.files.map(file => file.path) : [];
    
    // Create review
    const review = await Review.create({
      product,
      user,
      guestName: !user ? guestName : undefined,
      rating,
      title,
      comment,
      images,
      isVerifiedPurchase: isVerifiedPurchase || false
    });
    
    // Update product with new rating
    const { averageRating, numReviews } = await Review.getAverageRating(product);
    productExists.rating = averageRating;
    productExists.numReviews = numReviews;
    await productExists.save();
    
    res.status(201).json({
      message: 'Review created successfully',
      id: review._id
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Unable to create review' });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Public
exports.updateReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    const { 
      rating, 
      title, 
      comment, 
      isApproved 
    } = req.body;
    
    // Update review fields
    if (rating) review.rating = rating;
    if (title !== undefined) review.title = title;
    if (comment) review.comment = comment;
    if (isApproved !== undefined) review.isApproved = isApproved;
    
    // Handle image uploads
    if (req.files && req.files.length > 0) {
      review.images = req.files.map(file => file.path);
    }
    
    const updatedReview = await review.save();
    
    // Update product with new rating
    const product = await Product.findById(review.product);
    if (product) {
      const { averageRating, numReviews } = await Review.getAverageRating(review.product);
      product.rating = averageRating;
      product.numReviews = numReviews;
      await product.save();
    }
    
    res.json({
      message: 'Review updated successfully',
      review: updatedReview
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Unable to update review' });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Public
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    const productId = review.product;
    
    await review.remove();
    
    // Update product with new rating
    const product = await Product.findById(productId);
    if (product) {
      const { averageRating, numReviews } = await Review.getAverageRating(productId);
      product.rating = averageRating;
      product.numReviews = numReviews;
      await product.save();
    }
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Unable to delete review' });
  }
};

// @desc    Get product reviews
// @route   GET /api/reviews/product/:productId
// @access  Public
exports.getProductReviews = async (req, res) => {
  try {
    const productId = req.params.productId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const reviews = await Review.find({ 
      product: productId,
      isApproved: true
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Review.countDocuments({ 
      product: productId,
      isApproved: true
    });
    
    // Get rating summary
    const ratingSummary = await Review.aggregate([
      {
        $match: { 
          product: mongoose.Types.ObjectId(productId),
          isApproved: true
        }
      },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: -1 }
      }
    ]);
    
    // Format rating summary
    const ratings = {
      5: 0, 4: 0, 3: 0, 2: 0, 1: 0
    };
    
    ratingSummary.forEach(item => {
      ratings[item._id] = item.count;
    });
    
    res.json({
      items: reviews,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      ratings,
      averageRating: product.rating || 0,
      numReviews: product.numReviews || 0
    });
  } catch (error) {
    console.error('Get product reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Approve or reject a review
// @route   PUT /api/reviews/:id/approve
// @access  Public
exports.approveReview = async (req, res) => {
  try {
    const { isApproved } = req.body;
    
    if (isApproved === undefined) {
      return res.status(400).json({ message: 'Approval status is required' });
    }
    
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    review.isApproved = isApproved;
    const updatedReview = await review.save();
    
    // Update product with new rating
    const product = await Product.findById(review.product);
    if (product) {
      const { averageRating, numReviews } = await Review.getAverageRating(review.product);
      product.rating = averageRating;
      product.numReviews = numReviews;
      await product.save();
    }

    res.json({
      message: 'Review updated successfully',
      review: updatedReview
    });
  } catch (error) {
    console.error('Approve review error:', error);
    res.status(500).json({ message: 'Unable to update review' });
  }
};