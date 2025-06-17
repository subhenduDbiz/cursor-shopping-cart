const mongoose = require('mongoose');
require('dotenv').config();
const seedUsers = require('./users');
const seedProducts = require('./products');
const seedDeals = require('./deals');

// Import models for cleanup
const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Deal = require('../models/Deal');
const Order = require('../models/Order');

const seedAll = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clean all collections
        await Promise.all([
            User.deleteMany({}),
            Product.deleteMany({}),
            Cart.deleteMany({}),
            Deal.deleteMany({}),
            Order.deleteMany({})
        ]);
        console.log('All collections cleaned');

        // Seed users first
        await seedUsers();
        console.log('Users seeded successfully');

        // Seed products
        await seedProducts();
        console.log('Products seeded successfully');

        // Seed deals
        await seedDeals();
        console.log('Deals seeded successfully');

        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

// Run the seeder
seedAll(); 