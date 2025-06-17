const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { protect } = require('../../../middleware/auth');
const orderController = require('../../../controllers/OrderController');

// @route   GET api/v1/orders
// @desc    Get user's orders
// @access  Private
router.get('/', protect, orderController.getUserOrders);

// @route   GET api/v1/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', protect, orderController.getOrderById);

// @route   POST api/v1/orders
// @desc    Create new order
// @access  Private
router.post('/',
    protect,
    [
        check('shippingAddress', 'Shipping address is required').not().isEmpty(),
        check('paymentMethod', 'Payment method is required').not().isEmpty()
    ],
    orderController.createOrder
);

// @route   PUT api/v1/orders/:id/status
// @desc    Update order status (admin only)
// @access  Private (Admin only)
router.put('/:id/status',
    protect,
    [
        check('status', 'Status is required').not().isEmpty()
    ],
    orderController.updateOrderStatus
);

// @route   GET api/v1/orders/admin/all
// @desc    Get all orders (admin only)
// @access  Private (Admin only)
router.get('/admin/all', protect, orderController.getAllOrders);

module.exports = router; 