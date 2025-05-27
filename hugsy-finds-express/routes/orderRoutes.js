const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const orderController = require('../controllers/orderController');

// @route   GET /api/orders
// @desc    Get all orders
// @access  Public
router.get('/', orderController.getOrders);

// @route   GET /api/orders/status/:status
// @desc    Get orders by status
// @access  Public
router.get('/status/:status', orderController.getOrdersByStatus);

// @route   GET /api/orders/:id
// @desc    Get an order by ID
// @access  Public
router.get('/:id', orderController.getOrderById);

// @route   POST /api/orders
// @desc    Create a new order
// @access  Public
router.post('/',
  [
    check('customerInfo', 'Customer information is required').notEmpty(),
    check('items', 'Order items are required').isArray(),
    check('shippingAddress', 'Shipping address is required').notEmpty()
  ],
  orderController.createOrder
);

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Public
router.put('/:id/status', orderController.updateOrderStatus);

// @route   DELETE /api/orders/:id
// @desc    Delete an order
// @access  Public
router.delete('/:id', orderController.deleteOrder);

module.exports = router;