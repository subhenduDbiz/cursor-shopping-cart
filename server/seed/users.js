const User = require('../models/User');

const seedUsers = async () => {
    const users = [
        {
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'admin123',
            mobileNumber: '1234567890',
            role: 'admin'
        },
        {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            mobileNumber: '9876543210',
            role: 'user'
        },
        {
            name: 'Jane Smith',
            email: 'jane@example.com',
            password: 'password123',
            mobileNumber: '5555555555',
            role: 'user'
        }
    ];

    // Insert users (passwords will be hashed by the User model's pre-save middleware)
    const createdUsers = await User.insertMany(users);
    return createdUsers;
};

module.exports = seedUsers; 