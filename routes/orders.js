const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   POST api/orders
// @desc    Create a new order
// @access  Private
router.post('/', auth, [
    check('items', 'Order items are required').isArray({ min: 1 }),
    check('shippingAddress', 'Shipping address is required').not().isEmpty(),
    check('paymentMethod', 'Payment method is required').isIn(['paypal', 'stripe', 'Cash on Delivery'])
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const {
            items,
            shippingAddress,
            paymentMethod,
            totalAmount
        } = req.body;

        console.log('Received order data:', {
            items,
            shippingAddress,
            paymentMethod,
            totalAmount
        });

        // Create new order
        const order = new Order({
            user: req.user.id,
            items,
            shippingAddress,
            paymentMethod,
            totalAmount,
            status: 'Pending'
        });

        // Update product stock
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock -= item.quantity;
                await product.save();
            }
        }

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (err) {
        console.error('Order creation error:', err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Validation Error',
                errors: Object.values(err.errors).map(e => ({
                    field: e.path,
                    message: e.message
                }))
            });
        }
        res.status(500).json({ 
            message: 'Server Error',
            error: err.message 
        });
    }
});

// @route   GET api/orders
// @desc    Get all orders (admin) or user's orders (user)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        let query = {};
        // If not admin, only show user's orders
        if (req.user.role !== 'admin') {
            query.user = req.user.id;
        }

        const orders = await Order.find(query)
            .populate({
                path: 'items.product',
                select: 'name images price'
            })
            .sort({ orderDate: -1 });

        console.log('Fetched orders:', JSON.stringify(orders, null, 2));
        res.json(orders);
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate({
                path: 'items.product',
                select: 'name images price'
            });

        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        // Check if user owns the order or is admin
        if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        res.json(order);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Order not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/orders/:id/pay
// @desc    Update order to paid
// @access  Private
router.put('/:id/pay', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address
        };

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Order not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/orders/:id/deliver
// @desc    Update order to delivered
// @access  Private/Admin
router.put('/:id/deliver', auth, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        order.isDelivered = true;
        order.deliveredAt = Date.now();
        order.status = 'Delivered';

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Order not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router; 