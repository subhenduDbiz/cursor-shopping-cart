export const appConfig = {
  port: process.env.CRM_PORT || 5002,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiresIn: '24h',
  clientUrl: process.env.ADMIN_CLIENT_URL || 'http://localhost:3001',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  maxFileSize: process.env.MAX_FILE_SIZE || 5 * 1024 * 1024, // 5MB
  allowedFileTypes: ['image/jpeg', 'image/jpg', 'image/png'],
  bcryptRounds: 10,
  loginAttempts: 5,
  lockTime: 2 * 60 * 60 * 1000, // 2 hours
  pagination: {
    defaultLimit: 10,
    maxLimit: 100
  }
};
