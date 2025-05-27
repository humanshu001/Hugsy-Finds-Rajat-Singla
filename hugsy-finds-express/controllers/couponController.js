const Coupon = require('../models/Coupon');
const { validationResult } = require('express-validator');

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Public
exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    console.error('Get coupons error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a coupon by ID
// @route   GET /api/coupons/:id
// @access  Public
exports.getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    
    res.json(coupon);
  } catch (error) {
    console.error('Get coupon by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new coupon
// @route   POST /api/coupons
// @access  Public
exports.createCoupon = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const {
      code,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      usageLimit,
      validFrom,
      validUntil,
      description
    } = req.body;
    
    // Check if coupon code already exists
    const couponExists = await Coupon.findOne({ code: code.toUpperCase() });
    if (couponExists) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }
    
    const coupon = await Coupon.create({
      code,
      discountType,
      discountValue,
      minOrderAmount: minOrderAmount || 0,
      maxDiscount: maxDiscount || 0,
      usageLimit: usageLimit || 0,
      validFrom: validFrom || new Date(),
      validUntil: validUntil || null,
      description
    });
    
    res.status(201).json(coupon);
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a coupon
// @route   PUT /api/coupons/:id
// @access  Public
exports.updateCoupon = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const coupon = await Coupon.findById(req.params.id);
    
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    
    const {
      code,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      usageLimit,
      validFrom,
      validUntil,
      isActive,
      description
    } = req.body;
    
    // Check if updated code already exists (if code is being changed)
    if (code && code.toUpperCase() !== coupon.code) {
      const codeExists = await Coupon.findOne({ code: code.toUpperCase() });
      if (codeExists) {
        return res.status(400).json({ message: 'Coupon code already exists' });
      }
      coupon.code = code.toUpperCase();
    }
    
    // Update coupon fields
    if (discountType) coupon.discountType = discountType;
    if (discountValue !== undefined) coupon.discountValue = discountValue;
    if (minOrderAmount !== undefined) coupon.minOrderAmount = minOrderAmount;
    if (maxDiscount !== undefined) coupon.maxDiscount = maxDiscount;
    if (usageLimit !== undefined) coupon.usageLimit = usageLimit;
    if (validFrom) coupon.validFrom = validFrom;
    if (validUntil !== undefined) coupon.validUntil = validUntil;
    if (isActive !== undefined) coupon.isActive = isActive;
    if (description !== undefined) coupon.description = description;
    
    const updatedCoupon = await coupon.save();
    
    res.json(updatedCoupon);
  } catch (error) {
    console.error('Update coupon error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Public
exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    
    await coupon.remove();
    
    res.json({ message: 'Coupon removed' });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Validate a coupon
// @route   POST /api/coupons/validate
// @access  Public
exports.validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    
    if (!code || orderAmount === undefined) {
      return res.status(400).json({ message: 'Coupon code and order amount are required' });
    }
    
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    
    if (!coupon) {
      return res.status(404).json({ 
        valid: false,
        message: 'Coupon not found' 
      });
    }
    
    const isValid = coupon.isValid(orderAmount);
    
    if (!isValid) {
      let message = 'Coupon is not valid';
      
      if (!coupon.isActive) {
        message = 'Coupon is inactive';
      } else if (coupon.validFrom > new Date() || (coupon.validUntil && coupon.validUntil < new Date())) {
        message = 'Coupon is expired or not yet active';
      } else if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
        message = 'Coupon usage limit reached';
      } else if (orderAmount < coupon.minOrderAmount) {
        message = `Minimum order amount of ${coupon.minOrderAmount} required`;
      }
      
      return res.status(400).json({
        valid: false,
        message
      });
    }
    
    // Calculate discount
    const discount = coupon.calculateDiscount(orderAmount);
    
    res.json({
      valid: true,
      coupon: {
        id: coupon._id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderAmount: coupon.minOrderAmount,
        maxDiscount: coupon.maxDiscount
      },
      discount,
      message: 'Coupon is valid'
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get active coupons
// @route   GET /api/coupons/active
// @access  Public
exports.getActiveCoupons = async (req, res) => {
  try {
    const now = new Date();
    
    const coupons = await Coupon.find({
      isActive: true,
      validFrom: { $lte: now },
      $or: [
        { validUntil: null },
        { validUntil: { $gte: now } }
      ]
    }).sort({ createdAt: -1 });
    
    res.json(coupons);
  } catch (error) {
    console.error('Get active coupons error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get coupon statistics
// @route   GET /api/coupons/statistics
// @access  Public
exports.getCouponStatistics = async (req, res) => {
  try {
    const now = new Date();
    
    // Count total coupons
    const totalCoupons = await Coupon.countDocuments();
    
    // Count active coupons
    const activeCoupons = await Coupon.countDocuments({
      isActive: true,
      validFrom: { $lte: now },
      $or: [
        { validUntil: null },
        { validUntil: { $gte: now } }
      ]
    });
    
    // Count expired coupons
    const expiredCoupons = await Coupon.countDocuments({
      $or: [
        { isActive: false },
        { validUntil: { $lt: now } }
      ]
    });
    
    // Get most used coupons
    const mostUsedCoupons = await Coupon.find()
      .sort({ usedCount: -1 })
      .limit(5);
    
    // Get coupons by discount type
    const percentageCoupons = await Coupon.countDocuments({ discountType: 'percentage' });
    const fixedCoupons = await Coupon.countDocuments({ discountType: 'fixed' });
    
    res.json({
      totalCoupons,
      activeCoupons,
      expiredCoupons,
      mostUsedCoupons,
      discountTypes: {
        percentage: percentageCoupons,
        fixed: fixedCoupons
      }
    });
  } catch (error) {
    console.error('Get coupon statistics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Reset coupon usage
// @route   PUT /api/coupons/:id/reset
// @access  Public
exports.resetCouponUsage = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    
    coupon.usedCount = 0;
    const updatedCoupon = await coupon.save();
    
    res.json({
      message: 'Coupon usage reset successfully',
      coupon: updatedCoupon
    });
  } catch (error) {
    console.error('Reset coupon usage error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Bulk create coupons
// @route   POST /api/coupons/bulk
// @access  Public
exports.bulkCreateCoupons = async (req, res) => {
  try {
    const { coupons } = req.body;
    
    if (!coupons || !Array.isArray(coupons) || coupons.length === 0) {
      return res.status(400).json({ message: 'No coupons provided' });
    }
    
    const results = {
      success: [],
      failed: []
    };
    
    for (const couponData of coupons) {
      try {
        const {
          code,
          discountType,
          discountValue,
          minOrderAmount,
          maxDiscount,
          usageLimit,
          validFrom,
          validUntil,
          description
        } = couponData;
        
        // Check if required fields are present
        if (!code || !discountType || discountValue === undefined) {
          results.failed.push({
            code: code || 'Unknown',
            reason: 'Missing required fields'
          });
          continue;
        }
        
        // Check if coupon code already exists
        const couponExists = await Coupon.findOne({ code: code.toUpperCase() });
        if (couponExists) {
          results.failed.push({
            code,
            reason: 'Coupon code already exists'
          });
          continue;
        }
        
        const coupon = await Coupon.create({
          code,
          discountType,
          discountValue,
          minOrderAmount: minOrderAmount || 0,
          maxDiscount: maxDiscount || 0,
          usageLimit: usageLimit || 0,
          validFrom: validFrom || new Date(),
          validUntil: validUntil || null,
          description
        });
        
        results.success.push({
          id: coupon._id,
          code: coupon.code
        });
      } catch (error) {
        results.failed.push({
          code: couponData.code || 'Unknown',
          reason: error.message
        });
      }
    }
    
    res.status(201).json({
      message: `Created ${results.success.length} coupons, failed ${results.failed.length}`,
      results
    });
  } catch (error) {
    console.error('Bulk create coupons error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Generate coupon code
// @route   GET /api/coupons/generate-code
// @access  Public
exports.generateCouponCode = async (req, res) => {
  try {
    const length = parseInt(req.query.length) || 8;
    const prefix = req.query.prefix || '';
    
    // Generate random code
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = prefix;
    
    for (let i = 0; i < length; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    // Check if code already exists
    const couponExists = await Coupon.findOne({ code });
    if (couponExists) {
      // Try again with a different code
      return exports.generateCouponCode(req, res);
    }
    
    res.json({ code });
  } catch (error) {
    console.error('Generate coupon code error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
