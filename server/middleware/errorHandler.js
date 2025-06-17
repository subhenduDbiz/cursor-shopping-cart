const { validationResult } = require('express-validator');

const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);

    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Handle multer errors
    if (err.name === 'MulterError') {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
                error: 'File size too large. Maximum size is 5MB.' 
            });
        }
        return res.status(400).json({ error: err.message });
    }

    // Handle mongoose errors
    if (err.name === 'MongoError' || err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message });
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid token' });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
    }

    // Default error
    res.status(500).json({
        error: 'Something went wrong!',
        message: err.message
    });
};

module.exports = errorHandler; 