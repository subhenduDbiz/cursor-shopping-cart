const Product = require('../models/Product');
const BaseController = require('./BaseController');

class ProductController extends BaseController {
    constructor() {
        super(Product);
    }

    // Get all products with optional filtering
    getAllProducts = async (req, res) => {
        try {
            const { category, minPrice, maxPrice, search, page = 1, limit = 10 } = req.query;
            let query = {};

            // Apply filters if provided
            if (category) {
                query.category = { $regex: new RegExp(category, 'i') };
            }

            if (minPrice || maxPrice) {
                query.price = {};
                if (minPrice) query.price.$gte = Number(minPrice);
                if (maxPrice) query.price.$lte = Number(maxPrice);
            }

            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }

            // Calculate skip value for pagination
            const skip = (parseInt(page) - 1) * parseInt(limit);

            // Get total count for pagination
            const total = await Product.countDocuments(query);

            // Get products with pagination
            const products = await Product.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit));

            // Calculate total pages
            const totalPages = Math.ceil(total / parseInt(limit));

            // Return response in the format expected by frontend
            res.json({
                data: {
                    products,
                    totalPages,
                    currentPage: parseInt(page),
                    total
                }
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    };

    // Get product by ID
    getProductById = async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) {
                return res.status(404).json({ msg: 'Product not found' });
            }
            res.json(product);
        } catch (err) {
            console.error(err.message);
            if (err.kind === 'ObjectId') {
                return res.status(404).json({ msg: 'Product not found' });
            }
            res.status(500).send('Server Error');
        }
    };

    // Create new product
    createProduct = async (req, res) => {
        try {
            const { name, description, price, category, image, stock } = req.body;

            const newProduct = new Product({
                name,
                description,
                price,
                category: category.toLowerCase(),
                image,
                stock
            });

            const product = await newProduct.save();
            res.json(product);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    };

    // Update product
    updateProduct = async (req, res) => {
        try {
            const { name, description, price, category, image, stock } = req.body;

            let product = await Product.findById(req.params.id);
            if (!product) {
                return res.status(404).json({ msg: 'Product not found' });
            }

            // Update fields
            if (name) product.name = name;
            if (description) product.description = description;
            if (price) product.price = price;
            if (category) product.category = category.toLowerCase();
            if (image) product.image = image;
            if (stock !== undefined) product.stock = stock;

            await product.save();
            res.json(product);
        } catch (err) {
            console.error(err.message);
            if (err.kind === 'ObjectId') {
                return res.status(404).json({ msg: 'Product not found' });
            }
            res.status(500).send('Server Error');
        }
    };

    // Delete product
    deleteProduct = async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) {
                return res.status(404).json({ msg: 'Product not found' });
            }

            await product.remove();
            res.json({ msg: 'Product removed' });
        } catch (err) {
            console.error(err.message);
            if (err.kind === 'ObjectId') {
                return res.status(404).json({ msg: 'Product not found' });
            }
            res.status(500).send('Server Error');
        }
    };
}

module.exports = new ProductController(); 