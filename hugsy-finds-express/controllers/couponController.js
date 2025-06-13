const Coupon = require('../models/Coupon');

// Get all coupons
exports.getAllCoupons = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sort = '-createdAt',
      isActive
    } = req.query;

    // Build query
    const query = {};

    // Filter by active status
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    // Execute query with pagination
    const coupons = await Coupon.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('applicableProducts', 'name')
      .populate('applicableCategories', 'name');

    // Get total documents
    const count = await Coupon.countDocuments(query);

    res.status(200).json({
      coupons,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalCoupons: count
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching coupons',
      error: error.message
    });
  }
};

// Get single coupon
exports.getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
      .populate('applicableProducts', 'name images')
      .populate('applicableCategories', 'name');

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    res.status(200).json(coupon);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching coupon',
      error: error.message
    });
  }
};

// Create new coupon
exports.createCoupon = async (req, res) => {
  try {
    // Check if code is unique
    const codeExists = await Coupon.findOne({ code: req.body.code.toUpperCase() });
    if (codeExists) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    // Create coupon with uppercase code
    const couponData = {
      ...req.body,
      code: req.body.code.toUpperCase()
    };

    const coupon = await Coupon.create(couponData);

    res.status(201).json({
      message: 'Coupon created successfully',
      coupon
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error creating coupon',
      error: error.message
    });
  }
};

// Update coupon
exports.updateCoupon = async (req, res) => {
  try {
    // Check if code is unique if it's being updated
    if (req.body.code) {
      const codeExists = await Coupon.findOne({ 
        code: req.body.code.toUpperCase(),
        _id: { $ne: req.params.id }
      });
      if (codeExists) {
        return res.status(400).json({ message: 'Coupon code already exists' });
      }
      
      // Ensure code is uppercase
      req.body.code = req.body.code.toUpperCase();
    }

    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    res.status(200).json({
      message: 'Coupon updated successfully',
      coupon
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error updating coupon',
      error: error.message
    });
  }
};

// Delete coupon
exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    res.status(200).json({
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting coupon',
      error: error.message
    });
  }
};

// Validate coupon
exports.validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    
    if (!code) {
      return res.status(400).json({ message: 'Coupon code is required' });
    }
    
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    
    // Check if coupon is valid
    if (!coupon.isValid()) {
      return res.status(400).json({ message: 'Coupon is not valid or has expired' });
    }
    
    // Check minimum purchase requirement
    if (cartTotal && coupon.minimumPurchase > cartTotal) {
      return res.status(400).json({ 
        message: `Minimum purchase of $${coupon.minimumPurchase} required to use this coupon` 
      });
    }
    
    res.status(200).json({
      message: 'Coupon is valid',
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minimumPurchase: coupon.minimumPurchase
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error validating coupon',
      error: error.message
    });
  }
};

// Apply coupon to order
exports.applyCoupon = async (req, res) => {
  try {
    const { code, cartItems, cartTotal } = req.body;
    
    if (!code) {
      return res.status(400).json({ message: 'Coupon code is required' });
    }
    
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    
    // Check if coupon is valid
    if (!coupon.isValid()) {
      return res.status(400).json({ message: 'Coupon is not valid or has expired' });
    }
    
    // Check minimum purchase requirement
    if (coupon.minimumPurchase > cartTotal) {
      return res.status(400).json({ 
        message: `Minimum purchase of $${coupon.minimumPurchase} required to use this coupon` 
      });
    }
    
    // Calculate discount
    let discountAmount = 0;
    
    switch (coupon.discountType) {
      case 'percentage':
        discountAmount = (cartTotal * coupon.discountValue) / 100;
        break;
      case 'fixed':
        discountAmount = coupon.discountValue;
        break;
      case 'free_shipping':
        discountAmount = 0; // Shipping fee will be handled separately
        break;
    }
    
    // Ensure discount doesn't exceed cart total
    discountAmount = Math.min(discountAmount, cartTotal);
    
    res.status(200).json({
      message: 'Coupon applied successfully',
      discount: {
        code: coupon.code,
        type: coupon.discountType,
        value: coupon.discountValue,
        amount: discountAmount,
        freeShipping: coupon.discountType === 'free_shipping'
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error applying coupon',
      error: error.message
    });
  }
};
