const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/profile-images')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
});

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', upload.single('profileImage'), [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    check('mobileNumber', 'Please enter a valid 10-digit mobile number').matches(/^[0-9]{10}$/)
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, mobileNumber } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password,
            mobileNumber,
            profileImage: req.file ? `/uploads/profile-images/${req.file.filename}` : undefined
        });

        // Save user (password will be hashed by the pre-save middleware)
        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ 
                success: false,
                message: 'JWT_SECRET is not configured' 
            });
        }

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Please provide both email and password' 
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Check password using the model's method
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Create JWT payload
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ 
                success: false,
                message: 'JWT_SECRET is not configured' 
            });
        }

        // Sign token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    success: true,
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    }
                });
            }
        );
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
});

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/auth/me
// @desc    Get current user data
// @access  Private
router.get('/me', async (req, res) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user data
        const user = await User.findById(decoded.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error('Error in /me route:', err.message);
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token is not valid' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, upload.single('profileImage'), async (req, res) => {
    try {
        const { name, email, mobileNumber } = req.body;
        const userId = req.user.id;

        // Find user
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (mobileNumber) user.mobileNumber = mobileNumber;
        if (req.file) {
            user.profileImage = `/uploads/profile-images/${req.file.filename}`;
        }

        // Save updated user
        await user.save();

        // Return updated user data (excluding password)
        const updatedUser = await User.findById(userId).select('-password');
        res.json(updatedUser);
    } catch (err) {
        console.error('Profile update error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 