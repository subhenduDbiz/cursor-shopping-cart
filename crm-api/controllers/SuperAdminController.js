const User = require('../models/User');
const Role = require('../models/Role');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

class SuperAdminController {
    // Super Admin Login
    login = async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email and password are required'
                });
            }

            // Find user by email
            const user = await User.findOne({ email: email.toLowerCase() });
            
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Check if user is locked
            if (user.isLocked()) {
                return res.status(423).json({
                    success: false,
                    message: 'Account is locked due to too many failed attempts'
                });
            }

            // Check if user is super admin
            if (!user.isSuperAdmin()) {
                await user.incLoginAttempts();
                return res.status(401).json({
                    success: false,
                    message: 'Access denied. Super admin privileges required.'
                });
            }

            // Compare password
            const isMatch = await user.comparePassword(password);
            
            if (!isMatch) {
                await user.incLoginAttempts();
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Reset login attempts on successful login
            await user.resetLoginAttempts();

            // Update last login
            user.lastLogin = Date.now();
            await user.save();

            // Generate JWT token
            const token = jwt.sign(
                { userId: user._id },
                config.jwtSecret,
                { expiresIn: config.jwtExpiresIn }
            );

            res.json({
                success: true,
                message: 'Super admin login successful',
                data: {
                    token,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        permissions: user.permissions,
                        profileImage: user.profileImage
                    }
                }
            });
        } catch (error) {
            console.error('Super Admin Login Error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    };

    // Get Dashboard Statistics
    getDashboardStats = async (req, res) => {
        try {
            const totalCustomers = await User.countDocuments({ role: 'user' });
            const totalAdmins = await User.countDocuments({ role: 'admin' });
            const activeUsers = await User.countDocuments({ isActive: true });
            const totalRoles = await Role.countDocuments({ isActive: true });

            // Get recent activities (last 7 days)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const recentUsers = await User.countDocuments({
                createdAt: { $gte: sevenDaysAgo }
            });

            res.json({
                success: true,
                data: {
                    totalCustomers,
                    totalAdmins,
                    activeUsers,
                    totalRoles,
                    recentUsers,
                    lastUpdated: new Date()
                }
            });
        } catch (error) {
            console.error('Dashboard Stats Error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    };

    // Get Current Super Admin Profile
    getProfile = async (req, res) => {
        try {
            const user = await User.findById(req.user._id).select('-password');
            
            res.json({
                success: true,
                data: user
            });
        } catch (error) {
            console.error('Get Profile Error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    };

    // Update Super Admin Profile
    updateProfile = async (req, res) => {
        try {
            const { name, email, mobileNumber } = req.body;
            const userId = req.user._id;

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Check if email is already taken by another user
            if (email && email !== user.email) {
                const existingUser = await User.findOne({ email: email.toLowerCase() });
                if (existingUser) {
                    return res.status(400).json({
                        success: false,
                        message: 'Email is already taken'
                    });
                }
            }

            // Update fields
            if (name) user.name = name;
            if (email) user.email = email.toLowerCase();
            if (mobileNumber) user.mobileNumber = mobileNumber;

            await user.save();

            res.json({
                success: true,
                message: 'Profile updated successfully',
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    mobileNumber: user.mobileNumber,
                    role: user.role,
                    profileImage: user.profileImage
                }
            });
        } catch (error) {
            console.error('Update Profile Error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    };

    // Change Password
    changePassword = async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body;
            const userId = req.user._id;

            if (!currentPassword || !newPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Current password and new password are required'
                });
            }

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Verify current password
            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
            }

            // Update password
            user.password = newPassword;
            await user.save();

            res.json({
                success: true,
                message: 'Password changed successfully'
            });
        } catch (error) {
            console.error('Change Password Error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    };
}

module.exports = new SuperAdminController(); 