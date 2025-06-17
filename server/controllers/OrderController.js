const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const BaseController = require('./BaseController');

class OrderController extends BaseController {
    constructor() {
        super(Order);
    }

    // Get user's orders
    getUserOrders = async (req, res) => {
        try {
            const orders = await Order.find({ user: req.user.id })
                .populate({
                    path: 'items.product',
                    select: 'name price image description'
                })
                .sort({ createdAt: -1 });

            res.json({
                success: true,
                data: orders
            });
        } catch (err) {
            console.error('Error in getUserOrders:', err);
            res.status(500).json({
                success: false,
                msg: 'Server Error',
                error: err.message
            });
        }
    };

    // Get order by ID
    getOrderById = async (req, res) => {
        try {
            const order = await Order.findById(req.params.id)
                .populate('items.product', 'name price image');

            if (!order) {
                return res.status(404).json({ msg: 'Order not found' });
            }

            // Check if user owns the order
            if (order.user.toString() !== req.user.id) {
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
    };

    // Create new order
    createOrder = async (req, res) => {
        try {
            const { items, shippingAddress, totalAmount, paymentMethod } = req.body;

            // Validate required fields
            if (!items || !Array.isArray(items) || items.length === 0) {
                return res.status(400).json({ msg: 'Order must contain at least one item' });
            }

            if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || 
                !shippingAddress.state || !shippingAddress.zipCode || !shippingAddress.country) {
                return res.status(400).json({ msg: 'Complete shipping address is required' });
            }

            if (!totalAmount || totalAmount <= 0) {
                return res.status(400).json({ msg: 'Valid total amount is required' });
            }

            if (!paymentMethod) {
                return res.status(400).json({ msg: 'Payment method is required' });
            }

            // Validate products and check stock
            for (const item of items) {
                const product = await Product.findById(item.product);
                if (!product) {
                    return res.status(400).json({ 
                        msg: `Product with ID ${item.product} not found` 
                    });
                }

                if (product.stock < item.quantity) {
                    return res.status(400).json({ 
                        msg: `Not enough stock for ${product.name}` 
                    });
                }

                // Update product stock
                product.stock -= item.quantity;
                await product.save();
            }

            // Create order
            const order = new Order({
                user: req.user.id,
                items,
                totalAmount,
                shippingAddress,
                paymentMethod
            });

            await order.save();
            await order.populate('items.product', 'name price image');

            // Clear user's cart
            await Cart.findOneAndUpdate(
                { user: req.user.id },
                { items: [] }
            );

            res.status(201).json({
                success: true,
                data: order
            });
        } catch (err) {
            console.error('Error in createOrder:', err);
            if (err.name === 'ValidationError') {
                return res.status(400).json({ 
                    success: false,
                    msg: err.message 
                });
            }
            res.status(500).json({ 
                success: false,
                msg: 'Server Error',
                error: err.message 
            });
        }
    };

    // Update order status (admin only)
    updateOrderStatus = async (req, res) => {
        try {
            const { status } = req.body;

            const order = await Order.findById(req.params.id);
            if (!order) {
                return res.status(404).json({ msg: 'Order not found' });
            }

            order.status = status;
            await order.save();

            await order.populate('items.product', 'name price image');
            res.json(order);
        } catch (err) {
            console.error(err.message);
            if (err.kind === 'ObjectId') {
                return res.status(404).json({ msg: 'Order not found' });
            }
            res.status(500).send('Server Error');
        }
    };

    // Get all orders (admin only)
    getAllOrders = async (req, res) => {
        try {
            const orders = await Order.find()
                .populate('user', 'name email')
                .populate('items.product', 'name price image')
                .sort({ createdAt: -1 });

            res.json(orders);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    };
}

module.exports = new OrderController(); 