const Cart = require('../models/Cart');
const Product = require('../models/Product');
const BaseController = require('./BaseController');

class CartController extends BaseController {
    constructor() {
        super(Cart);
    }

    // Get user's cart
    getUserCart = async (req, res) => {
        try {
            let cart = await Cart.findOne({ user: req.user.id })
                .populate('items.product', 'name price image');

            if (!cart) {
                cart = new Cart({ user: req.user.id, items: [] });
                await cart.save();
            }

            res.json(cart);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    };

    // Add item to cart
    addToCart = async (req, res) => {
        try {
            const { productId, quantity = 1 } = req.body;

            if (!productId) {
                return res.status(400).json({ msg: 'Product ID is required' });
            }

            if (quantity < 1) {
                return res.status(400).json({ msg: 'Quantity must be at least 1' });
            }

            // Validate product exists
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ msg: 'Product not found' });
            }

            // Check if product is in stock
            if (product.stock < quantity) {
                return res.status(400).json({ msg: 'Not enough stock available' });
            }

            let cart = await Cart.findOne({ user: req.user.id });

            if (!cart) {
                // Create new cart if it doesn't exist
                cart = new Cart({
                    user: req.user.id,
                    items: [{ product: productId, quantity }]
                });
            } else {
                // Check if product already exists in cart
                const itemIndex = cart.items.findIndex(
                    item => item.product.toString() === productId
                );

                if (itemIndex > -1) {
                    // Update quantity if product exists
                    const newQuantity = cart.items[itemIndex].quantity + quantity;
                    if (product.stock < newQuantity) {
                        return res.status(400).json({ msg: 'Not enough stock available' });
                    }
                    cart.items[itemIndex].quantity = newQuantity;
                } else {
                    // Add new item if product doesn't exist
                    cart.items.push({ product: productId, quantity });
                }
            }

            await cart.save();
            await cart.populate('items.product', 'name price image');
            res.json(cart);
        } catch (err) {
            console.error('Error in addToCart:', err);
            if (err.name === 'ValidationError') {
                return res.status(400).json({ msg: err.message });
            }
            if (err.name === 'CastError') {
                return res.status(400).json({ msg: 'Invalid product ID' });
            }
            res.status(500).json({ msg: 'Server Error', error: err.message });
        }
    };

    // Update cart item quantity
    updateCartItem = async (req, res) => {
        try {
            const { productId } = req.params;
            const { quantity } = req.body;

            if (!productId) {
                return res.status(400).json({ msg: 'Product ID is required' });
            }

            if (quantity < 0) {
                return res.status(400).json({ msg: 'Quantity must be a non-negative number' });
            }

            // Validate product exists
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ msg: 'Product not found' });
            }

            // Check if product is in stock
            if (product.stock < quantity) {
                return res.status(400).json({ msg: 'Not enough stock available' });
            }

            const cart = await Cart.findOne({ user: req.user.id });
            if (!cart) {
                return res.status(404).json({ msg: 'Cart not found' });
            }

            const itemIndex = cart.items.findIndex(
                item => item.product.toString() === productId
            );

            if (itemIndex === -1) {
                return res.status(404).json({ msg: 'Item not found in cart' });
            }

            if (quantity === 0) {
                // Remove item if quantity is 0
                cart.items.splice(itemIndex, 1);
            } else {
                // Update quantity
                cart.items[itemIndex].quantity = quantity;
            }

            await cart.save();
            await cart.populate('items.product', 'name price image');
            res.json(cart);
        } catch (err) {
            console.error('Error in updateCartItem:', err);
            if (err.name === 'ValidationError') {
                return res.status(400).json({ msg: err.message });
            }
            if (err.name === 'CastError') {
                return res.status(400).json({ msg: 'Invalid product ID' });
            }
            res.status(500).json({ msg: 'Server Error', error: err.message });
        }
    };

    // Remove item from cart
    removeFromCart = async (req, res) => {
        try {
            const { productId } = req.params;

            const cart = await Cart.findOne({ user: req.user.id });
            if (!cart) {
                return res.status(404).json({ msg: 'Cart not found' });
            }

            cart.items = cart.items.filter(
                item => item.product.toString() !== productId
            );

            await cart.save();
            await cart.populate('items.product', 'name price image');
            res.json(cart);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    };

    // Clear cart
    clearCart = async (req, res) => {
        try {
            const cart = await Cart.findOne({ user: req.user.id });
            if (!cart) {
                return res.status(404).json({ msg: 'Cart not found' });
            }

            cart.items = [];
            await cart.save();
            res.json(cart);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    };
}

module.exports = new CartController(); 