const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedUsers = async () => {
    const users = [
        {
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'admin123',
            mobileNumber: '1234567890',
            isAdmin: true
        },
        {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            mobileNumber: '9876543210',
            isAdmin: false
        },
        {
            name: 'Jane Smith',
            email: 'jane@example.com',
            password: 'password123',
            mobileNumber: '5555555555',
            isAdmin: false
        }
    ];

    // Hash passwords and create users
    const hashedUsers = await Promise.all(
        users.map(async (user) => {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(user.password, salt);
            return {
                ...user,
                password: hashedPassword
            };
        })
    );

    // Insert users
    const createdUsers = await User.insertMany(hashedUsers);
    return createdUsers;
};

module.exports = seedUsers; 