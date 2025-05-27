const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  discountType: {
    type: String,
    required: true,
    enum: ['percentage', 'fixed'],
    default: 'percentage'
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  minOrderAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  maxDiscount: {
    type: Number,
    default: 0,
    min: 0
  },
  usageLimit: {
    type: Number,
    default: 0, // 0 means unlimited
    min: 0
  },
  usedCount: {
    type: Number,
    default: 0,
    min: 0
  },
  validFrom: {
    type: Date,
    default: Date.now
  },
  validUntil: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Method to check if coupon is valid
couponSchema.methods.isValid = function(orderAmount) {
  const now = new Date();
  
  // Check if coupon is active
  if (!this.isActive) {
    return false;
  }
  
  // Check if coupon is within valid date range
  if (this.validFrom > now || (this.validUntil && this.validUntil < now)) {
    return false;
  }
  
  // Check if usage limit is reached
  if (this.usageLimit > 0 && this.usedCount >= this.usageLimit) {
    return false;
  }
  
  // Check if order meets minimum amount
  if (orderAmount < this.minOrderAmount) {
    return false;
  }
  
  return true;
};

// Method to calculate discount amount
couponSchema.methods.calculateDiscount = function(orderAmount) {
  let discount = 0;
  
  if (this.discountType === 'percentage') {
    discount = (orderAmount * this.discountValue) / 100;
    
    // Apply max discount if set
    if (this.maxDiscount > 0 && discount > this.maxDiscount) {
      discount = this.maxDiscount;
    }
  } else {
    // Fixed discount
    discount = this.discountValue;
    
    // Discount cannot be more than order amount
    if (discount > orderAmount) {
      discount = orderAmount;
    }
  }
  
  return parseFloat(discount.toFixed(2));
};

// Method to apply coupon (increment usage count)
couponSchema.methods.apply = async function() {
  this.usedCount += 1;
  await this.save();
  return this;
};

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
