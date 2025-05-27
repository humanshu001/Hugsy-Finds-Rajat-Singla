const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const couponController = require('../controllers/couponController');

// @route   GET /api/coupons
// @desc    Get all coupons
// @access  Public
router.get('/', couponController.getCoupons);

// @route   GET /api/coupons/active
// @desc    Get active coupons
// @access  Public
router.get('/active', couponController.getActiveCoupons);

// @route   GET /api/coupons/statistics
// @desc    Get coupon statistics
// @access  Public
router.get('/statistics', couponController.getCouponStatistics);

// @route   GET /api/coupons/generate-code
// @desc    Generate coupon code
// @access  Public
router.get('/generate-code', couponController.generateCouponCode);

// @route   GET /api/coupons/:id
// @desc    Get a coupon by ID
// @access  Public
router.get('/:id', couponController.getCouponById);

// @route   POST /api/coupons
// @desc    Create a new coupon
// @access  Public
router.post('/',
  [
    check('code', 'Coupon code is required').notEmpty(),
    check('discountType', 'Discount type must be either percentage or fixed').isIn(['percentage', 'fixed']),
    check('discountValue', 'Discount value is required').isNumeric()
  ],
  couponController.createCoupon
);

// @route   POST /api/coupons/validate
// @desc    Validate a coupon
// @access  Public
router.post('/validate', couponController.validateCoupon);

// @route   POST /api/coupons/bulk
// @desc    Bulk create coupons
// @access  Public
router.post('/bulk', couponController.bulkCreateCoupons);

// @route   PUT /api/coupons/:id
// @desc    Update a coupon
// @access  Public
router.put('/:id', couponController.updateCoupon);

// @route   PUT /api/coupons/:id/reset
// @desc    Reset coupon usage
// @access  Public
router.put('/:id/reset', couponController.resetCouponUsage);

// @route   DELETE /api/coupons/:id
// @desc    Delete a coupon
// @access  Public
router.delete('/:id', couponController.deleteCoupon);

module.exports = router;