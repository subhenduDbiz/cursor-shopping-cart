const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get user's cart
router.get('/', auth, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id })
            .populate('items.product');

        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [] });
            await cart.save();
        }

        res.json({ items: cart.items });
    } catch (err) {
        console.error('Error fetching cart:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add item to cart
router.post('/add', auth, async (req, res) => {
    try {
        const { productId } = req.body;

        // Validate product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            // Create new cart if it doesn't exist
            cart = new Cart({
                user: req.user.id,
                items: [{ product: productId, quantity: 1 }]
            });
        } else {
            // Check if product already in cart
            const existingItem = cart.items.find(
                item => item.product.toString() === productId
            );

            if (existingItem) {
                // Increment quantity if product exists
                existingItem.quantity += 1;
            } else {
                // Add new item if product doesn't exist
                cart.items.push({ product: productId, quantity: 1 });
            }
        }

        await cart.save();
        await cart.populate('items.product');

        res.json({ items: cart.items });
    } catch (err) {
        console.error('Error adding to cart:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Remove item from cart
router.delete('/remove/:productId', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Remove item from cart
        cart.items = cart.items.filter(
            item => item.product.toString() !== req.params.productId
        );

        await cart.save();
        await cart.populate('items.product');

        res.json({ items: cart.items });
    } catch (err) {
        console.error('Error removing from cart:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update item quantity
router.put('/update', auth, async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({ message: 'Quantity must be at least 1' });
        }

        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find and update item quantity
        const item = cart.items.find(
            item => item.product.toString() === productId
        );

        if (!item) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        item.quantity = quantity;
        await cart.save();
        await cart.populate('items.product');

        res.json({ items: cart.items });
    } catch (err) {
        console.error('Error updating cart:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Clear cart
router.delete('/clear', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = [];
        await cart.save();

        res.json({ message: 'Cart cleared' });
    } catch (err) {
        console.error('Error clearing cart:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 