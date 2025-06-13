const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const couponSchema = new Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Coupon description is required']
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed', 'free_shipping'],
    required: [true, 'Discount type is required']
  },
  discountValue: {
    type: Number,
    required: function() {
      return this.discountType !== 'free_shipping';
    },
    min: [0, 'Discount value cannot be negative']
  },
  minimumPurchase: {
    type: Number,
    default: 0,
    min: [0, 'Minimum purchase cannot be negative']
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  usageLimit: {
    type: Number,
    default: null
  },
  usageCount: {
    type: Number,
    default: 0
  },
  perUserLimit: {
    type: Number,
    default: null
  },
  applicableProducts: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
  applicableCategories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }],
  excludedProducts: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
  usedBy: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    usageCount: {
      type: Number,
      default: 1
    },
    lastUsed: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Check if coupon is valid
couponSchema.methods.isValid = function() {
  const now = new Date();
  
  // Check if coupon is active
  if (!this.isActive) return false;
  
  // Check if coupon has expired
  if (this.endDate && now > this.endDate) return false;
  
  // Check if coupon has reached usage limit
  if (this.usageLimit !== null && this.usageCount >= this.usageLimit) return false;
  
  return true;
};

module.exports = mongoose.model('Coupon', couponSchema);