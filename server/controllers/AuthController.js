const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');
const fs = require('fs');
const path = require('path');

class AuthController {
    constructor() {
        // Bind all methods to this instance
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.getCurrentUser = this.getCurrentUser.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.changePassword = this.changePassword.bind(this);
    }

    // Register user
    register = async (req, res) => {
        try {
            const { name, email, password, mobileNumber } = req.body;

            // Check if user exists
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Log file upload information
            console.log('File upload info:', req.file);

            // Create new user
            user = new User({
                name,
                email,
                password,
                mobileNumber,
                profileImage: req.file ? `/uploads/profile-images/${req.file.filename}` : undefined
            });

            // Save user
            await user.save();

            // Create JWT token
            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                config.jwtSecret,
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
                            profileImage: user.profileImage
                        }
                    });
                }
            );
        } catch (err) {
            console.error('Registration error:', err.message);
            res.status(500).json({ 
                success: false,
                message: 'Server error',
                error: err.message 
            });
        }
    };

    // Login user
    login = async (req, res) => {
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
                    message: 'User does not exist' 
                });
            }

            // Check password
            const isMatch = await bcrypt.compare(password, user.password);
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

            // Sign token
            jwt.sign(
                payload,
                config.jwtSecret,
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
                            mobileNumber: user.mobileNumber,
                            role: user.role,
                            profileImage: user.profileImage
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
    };

    // Get current user
    getCurrentUser = async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-password');
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
    };

    // Update profile
    updateProfile = async (req, res) => {
        try {
            const { name, email, mobileNumber } = req.body;
            const updateData = { name, email, mobileNumber };

            // Handle profile image update
            if (req.file) {
                // Delete old profile image if exists
                const user = await User.findById(req.user.id);
                if (user.profileImage) {
                    const oldImagePath = path.join(__dirname, '../../', user.profileImage);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
                updateData.profileImage = `/uploads/profile-images/${req.file.filename}`;
            }

            const user = await User.findByIdAndUpdate(
                req.user.id,
                { $set: updateData },
                { new: true }
            ).select('-password');

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(user);
        } catch (err) {
            console.error('Profile update error:', err);
            res.status(500).json({ message: 'Server error' });
        }
    };

    // Change password
    changePassword = async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body;
            const user = await User.findById(req.user.id);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Verify current password
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }

            // Update password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
            await user.save();

            res.json({ message: 'Password updated successfully' });
        } catch (err) {
            console.error('Password change error:', err);
            res.status(500).json({ message: 'Server error' });
        }
    };
}

// Create a new instance and export it
const authController = new AuthController();
module.exports = authController; 