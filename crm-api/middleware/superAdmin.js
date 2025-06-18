const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

const superAdmin = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, config.jwtSecret);
        
        // Find user
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. User not found.'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated.'
            });
        }

        // Check if user is super admin
        if (!user.isSuperAdmin()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Super admin privileges required.'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Super Admin Middleware Error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid token.'
        });
    }
};

module.exports = { superAdmin }; 