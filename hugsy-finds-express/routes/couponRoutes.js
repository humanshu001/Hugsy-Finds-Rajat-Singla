const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');

// GET all coupons
router.get('/', couponController.getAllCoupons);

// GET single coupon by ID
router.get('/:id', couponController.getCouponById);

// POST create new coupon
router.post('/', couponController.createCoupon);

// PUT update coupon
router.put('/:id', couponController.updateCoupon);

// DELETE coupon
router.delete('/:id', couponController.deleteCoupon);

// POST validate coupon
router.post('/validate', couponController.validateCoupon);

// POST apply coupon to order
router.post('/apply', couponController.applyCoupon);

module.exports = router;