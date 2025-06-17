const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { protect } = require('../../../middleware/auth');
const { admin } = require('../../../middleware/admin');
const productController = require('../../../controllers/ProductController');

// @route   GET api/v1/products
// @desc    Get all products with optional filtering
// @access  Public
router.get('/', productController.getAllProducts);

// @route   GET api/v1/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', productController.getProductById);

// @route   POST api/v1/products
// @desc    Create a product
// @access  Private (Admin only)
router.post('/',
    protect,
    admin,
    [
        check('name', 'Name is required').not().isEmpty(),
        check('description', 'Description is required').not().isEmpty(),
        check('price', 'Price is required and must be a positive number').isFloat({ min: 0 }),
        check('category', 'Category is required').not().isEmpty(),
        check('stock', 'Stock is required and must be a non-negative number').isInt({ min: 0 })
    ],
    productController.createProduct
);

// @route   PUT api/v1/products/:id
// @desc    Update a product
// @access  Private (Admin only)
router.put('/:id',
    protect,
    admin,
    [
        check('name', 'Name is required').not().isEmpty(),
        check('description', 'Description is required').not().isEmpty(),
        check('price', 'Price is required and must be a positive number').isFloat({ min: 0 }),
        check('category', 'Category is required').not().isEmpty(),
        check('stock', 'Stock is required and must be a non-negative number').isInt({ min: 0 })
    ],
    productController.updateProduct
);

// @route   DELETE api/v1/products/:id
// @desc    Delete a product
// @access  Private (Admin only)
router.delete('/:id', protect, admin, productController.deleteProduct);

module.exports = router; 