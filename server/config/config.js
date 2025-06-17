require('dotenv').config();

module.exports = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/dress-shop',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    uploadDir: 'uploads/profile-images',
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedFileTypes: ['image/jpeg', 'image/jpg', 'image/png']
}; 