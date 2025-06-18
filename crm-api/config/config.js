require('dotenv').config();

const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.CRM_PORT || 5001,
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/dress-shop',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    clientUrl: process.env.ADMIN_CLIENT_URL || 'http://localhost:3001',
    uploadDir: process.env.UPLOAD_DIR || 'uploads',
    maxFileSize: process.env.MAX_FILE_SIZE || 5 * 1024 * 1024, // 5MB
    allowedFileTypes: ['image/jpeg', 'image/jpg', 'image/png'],
    bcryptRounds: 10,
    jwtExpiresIn: '24h',
    loginAttempts: 5,
    lockTime: 2 * 60 * 60 * 1000, // 2 hours
    pagination: {
        defaultLimit: 10,
        maxLimit: 100
    }
};

module.exports = config; 