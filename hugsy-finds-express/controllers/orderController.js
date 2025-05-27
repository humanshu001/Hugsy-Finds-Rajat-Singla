const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const { validationResult } = require('express-validator');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Public
exports.getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const orders = await Order.find()
      .populate('items.product', 'name price images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Order.countDocuments();
    
    res.json({
      orders,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get an order by ID
// @route   GET /api/orders/:id
// @access  Public
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name price images');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new order
// @route   POST /api/orders
// @access  Public
exports.createOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const {
      customerInfo,
      items,
      shippingAddress,
      paymentMethod,
      couponCode,
      notes
    } = req.body;
    
    // Validate items and calculate total
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }
    
    const orderItems = [];
    let subtotal = 0;
    
    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Not enough stock for ${product.name}. Available: ${product.stock}` 
        });
      }
      
      const price = product.discountPrice || product.price;
      const itemTotal = price * item.quantity;
      
      orderItems.push({
        product: item.product,
        quantity: item.quantity,
        price,
        total: itemTotal
      });
      
      subtotal += itemTotal;
      
      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }
    
    // Apply coupon if provided
    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ 
        code: couponCode,
        validFrom: { $lte: new Date() },
        $or: [
          { validUntil: null },
          { validUntil: { $gte: new Date() } }
        ]
      });
      
      if (!coupon) {
        return res.status(400).json({ message: 'Invalid or expired coupon' });
      }
      
      if (coupon.minOrderAmount > subtotal) {
        return res.status(400).json({ 
          message: `Minimum order amount for this coupon is ${coupon.minOrderAmount}` 
        });
      }
      
      if (coupon.usageCount >= coupon.usageLimit && coupon.usageLimit > 0) {
        return res.status(
          400
        ).json({ message: 'This coupon has reached its usage limit' });
      }
      
      discount = coupon.discountType === 'percentage'
        ? (subtotal * coupon.discountValue) / 100
        : coupon.discountValue;
      
      // Update coupon usage
      coupon.usageCount += 1;
      await coupon.save();
    }
    
    const totalAmount = subtotal - discount;
    
    // Create order
    const order = await Order.create({
      customerInfo,
      items: orderItems,
      subtotal,
      discount,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || 'cash_on_delivery',
      couponCode: discount > 0 ? couponCode : null,
      notes
    });
    
    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Public
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Validate order status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }
    
    // If cancelling order, restore product stock
    if (orderStatus === 'cancelled' && order.orderStatus !== 'cancelled') {
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    }
    
    order.orderStatus = orderStatus;
    const updatedOrder = await order.save();
    
    res.json(updatedOrder);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update payment status
// @route   PUT /api/orders/:id/payment
// @access  Public
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, paymentId } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Validate payment status
    const validStatuses = ['pending', 'completed', 'failed', 'refunded'];
    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({ message: 'Invalid payment status' });
    }
    
    order.paymentStatus = paymentStatus;
    if (paymentId) {
      order.paymentId = paymentId;
    }
    
    const updatedOrder = await order.save();
    
    res.json(updatedOrder);
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get orders by status
// @route   GET /api/orders/status/:status
// @access  Public
exports.getOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }
    
    const orders = await Order.find({ orderStatus: status })
      .populate('items.product', 'name price images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Order.countDocuments({ orderStatus: status });
    
    res.json({
      orders,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error('Get orders by status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Public
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    await order.remove();
    
    res.json({ message: 'Order removed' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
