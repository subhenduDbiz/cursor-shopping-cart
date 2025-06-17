const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { check } = require('express-validator');
const { protect } = require('../../../middleware/auth');
const authController = require('../../../controllers/AuthController');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../../../uploads/profile-images');
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: fileFilter
});

// @route   POST api/v1/auth/register
// @desc    Register user
// @access  Public
router.post('/register', 
    upload.single('profileImage'),
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
        check('mobileNumber', 'Please enter a valid 10-digit mobile number').matches(/^[0-9]{10}$/)
    ],
    authController.register
);

// @route   POST api/v1/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', authController.login);

// @route   GET api/v1/auth/me
// @desc    Get current user data
// @access  Private
router.get('/me', protect, authController.getCurrentUser);

// @route   PUT api/v1/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', 
    protect,
    upload.single('profileImage'),
    authController.updateProfile
);

// @route   PUT api/v1/auth/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password',
    protect,
    [
        check('currentPassword', 'Current password is required').not().isEmpty(),
        check('newPassword', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
    ],
    authController.changePassword
);

module.exports = router; 