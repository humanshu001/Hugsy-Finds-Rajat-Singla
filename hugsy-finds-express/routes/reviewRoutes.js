const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// GET all reviews
router.get('/', reviewController.getAllReviews);

// GET single review by ID
router.get('/:id', reviewController.getReviewById);

// GET reviews for a product
router.get('/product/:productId', reviewController.getProductReviews);

// POST create new review
router.post('/', reviewController.createReview);

// PUT update review
router.put('/:id', reviewController.updateReview);

// DELETE review
router.delete('/:id', reviewController.deleteReview);

// PATCH approve review
router.patch('/:id/approve', reviewController.approveReview);

module.exports = router;