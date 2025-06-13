const Order = require('../models/Order');
const Product = require('../models/Product');

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sort = '-createdAt',
      status,
      minTotal,
      maxTotal,
      startDate,
      endDate
    } = req.query;

    // Build query
    const query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by total amount
    if (minTotal || maxTotal) {
      query.totalAmount = {};
      if (minTotal) query.totalAmount.$gte = Number(minTotal);
      if (maxTotal) query.totalAmount.$lte = Number(maxTotal);
    }

    // Filter by date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const endDateObj = new Date(endDate);
        endDateObj.setHours(23, 59, 59, 999);
        query.createdAt.$lte = endDateObj;
      }
    }

    // Execute query with pagination
    const orders = await Order.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('items.product', 'name price images');

    // Get total documents
    const count = await Order.countDocuments(query);

    res.status(200).json({
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalOrders: count
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// Get single order
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name price images');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, couponApplied } = req.body;

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    // Calculate order total and validate product availability
    let subtotal = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(400).json({ message: `Product with ID ${item.product} not found` });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Not enough stock for ${product.name}. Available: ${product.stock}` 
        });
      }
      
      // Update product stock
      product.stock -= item.quantity;
      await product.save();
      
      // Calculate item total
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
    }

    // Apply discount if coupon is provided
    let discount = 0;
    if (couponApplied) {
      // Coupon validation logic would go here
      // For now, we'll just use the provided discount amount
      discount = couponApplied.discountAmount || 0;
    }

    // Calculate shipping cost (simplified)
    const shippingCost = 5.99;

    // Calculate tax (simplified)
    const taxRate = 0.07; // 7%
    const tax = (subtotal - discount) * taxRate;

    // Calculate total
    const totalAmount = subtotal - discount + shippingCost + tax;

    // Create order
    const order = await Order.create({
      items,
      shippingAddress,
      paymentMethod,
      couponApplied,
      subtotal,
      discount,
      shippingCost,
      tax,
      totalAmount,
      status: 'pending'
    });

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error creating order',
      error: error.message
    });
  }
};

// Update order
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      message: 'Order updated successfully',
      order
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error updating order',
      error: error.message
    });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    // Validate status value
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // If cancelling an order, restore product stock
    if (status === 'cancelled' && order.status !== 'cancelled') {
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    }
    
    order.status = status;
    await order.save();
    
    res.status(200).json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error updating order status',
      error: error.message
    });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      message: 'Order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting order',
      error: error.message
    });
  }
};

// Get order statistics
exports.getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const processingOrders = await Order.countDocuments({ status: 'processing' });
    const shippedOrders = await Order.countDocuments({ status: 'shipped' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });
    
    // Get total revenue
    const revenueResult = await Order.aggregate([
      {
        $match: { status: { $ne: 'cancelled' } }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);
    
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
    
    // Get revenue by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const revenueByMonth = await Order.aggregate([
      {
        $match: {
          status: { $ne: 'cancelled' },
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: { 
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);
    
    res.status(200).json({
      totalOrders,
      ordersByStatus: {
        pending: pendingOrders,
        processing: processingOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders
      },
      totalRevenue,
      revenueByMonth: revenueByMonth.map(item => ({
        year: item._id.year,
        month: item._id.month,
        revenue: item.revenue,
        count: item.count
      }))
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching order statistics',
      error: error.message
    });
  }
};
