const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offerSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Offer title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Offer description is required']
  },
  discount: {
    type: String,
    required: [true, 'Discount label is required']
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed', 'bundle', 'bogo'],
    required: [true, 'Discount type is required']
  },
  discountValue: {
    type: Number,
    default: 0
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
  bgColor: {
    type: String,
    default: 'bg-1'
  },
  textColor: {
    type: String,
    default: 'text-black'
  },
  buttonColor: {
    type: String,
    default: 'bg-5'
  },
  offerType: {
    type: String,
    enum: ['seasonal', 'flash', 'bundle', 'clearance', 'holiday', 'promotion'],
    default: 'promotion'
  },
  applicableProducts: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
  applicableCategories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }],
  couponCode: {
    type: String
  },
  image: {
    type: String
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  showOnHomepage: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Check if offer is active
offerSchema.methods.checkIfActive = function() {
  const now = new Date();
  
  if (!this.isActive) return false;
  
  if (this.startDate && now < this.startDate) return false;
  
  if (this.endDate && now > this.endDate) return false;
  
  return true;
};

module.exports = mongoose.model('Offer', offerSchema);
