const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// GET all orders
router.get('/', orderController.getAllOrders);

// GET single order by ID
router.get('/:id', orderController.getOrderById);

// POST create new order
router.post('/', orderController.createOrder);

// PUT update order
router.put('/:id', orderController.updateOrder);

// PATCH update order status
router.patch('/:id/status', orderController.updateOrderStatus);

// DELETE order
router.delete('/:id', orderController.deleteOrder);

// GET order statistics
router.get('/stats/summary', orderController.getOrderStats);

module.exports = router;