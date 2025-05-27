const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const reviewController = require('../controllers/reviewController');
const { uploadMultipleImages } = require('../middleware/uploadMiddleware');

// @route   GET /api/reviews
// @desc    Get all reviews
// @access  Public
router.get('/', reviewController.getReviews);

// @route   GET /api/reviews/:id
// @desc    Get a review by ID
// @access  Public
router.get('/:id', reviewController.getReviewById);

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Public
router.post('/', 
  uploadMultipleImages('images', 5),
  [
    check('product', 'Product ID is required').notEmpty(),
    check('rating', 'Rating is required').isInt({ min: 1, max: 5 }),
    check('comment', 'Comment is required').notEmpty()
  ],
  reviewController.createReview
);

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Public
router.put('/:id',
  uploadMultipleImages('images', 5),
  reviewController.updateReview
);

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Public
router.delete('/:id', reviewController.deleteReview);

// @route   GET /api/reviews/product/:productId
// @desc    Get product reviews
// @access  Public
router.get('/product/:productId', reviewController.getProductReviews);

// @route   PUT /api/reviews/:id/approve
// @desc    Approve or reject a review
// @access  Public
router.put('/:id/approve', reviewController.approveReview);

module.exports = router;
