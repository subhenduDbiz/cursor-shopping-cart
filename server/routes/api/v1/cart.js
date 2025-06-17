const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { protect } = require('../../../middleware/auth');
const cartController = require('../../../controllers/CartController');

// @route   GET api/v1/cart
// @desc    Get user's cart
// @access  Private
router.get('/', protect, cartController.getUserCart);

// @route   POST api/v1/cart
// @desc    Add item to cart
// @access  Private
router.post('/',
    protect,
    [
        check('productId', 'Product ID is required').not().isEmpty(),
        check('quantity', 'Quantity is required and must be a positive number').isInt({ min: 1 })
    ],
    cartController.addToCart
);

// @route   PUT api/v1/cart/:productId
// @desc    Update cart item quantity
// @access  Private
router.put('/:productId',
    protect,
    [
        check('quantity', 'Quantity is required and must be a non-negative number').isInt({ min: 0 })
    ],
    cartController.updateCartItem
);

// @route   DELETE api/v1/cart/:productId
// @desc    Remove item from cart
// @access  Private
router.delete('/:productId', protect, cartController.removeFromCart);

// @route   DELETE api/v1/cart
// @desc    Clear cart
// @access  Private
router.delete('/', protect, cartController.clearCart);

module.exports = router; 