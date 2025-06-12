const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
require('dotenv').config();

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'user123',
        role: 'user'
    }
];

const products = [
    {
        name: "Men's Classic Black Suit",
        description: "A timeless black suit perfect for formal occasions. Made with premium wool blend fabric.",
        price: 299.99,
        category: "men",
        subCategory: "formal",
        images: ["https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=500"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black"],
        stock: 50
    },
    {
        name: "Men's Casual Denim Jacket",
        description: "Stylish denim jacket for casual outings. Comfortable and durable.",
        price: 89.99,
        category: "men",
        subCategory: "casual",
        images: ["https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500"],
        sizes: ["M", "L", "XL"],
        colors: ["Blue", "Black"],
        stock: 30
    },
    {
        name: "Women's Evening Gown",
        description: "Elegant evening gown perfect for special occasions. Features a flattering silhouette.",
        price: 399.99,
        category: "women",
        subCategory: "formal",
        images: ["https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=500"],
        sizes: ["XS", "S", "M", "L"],
        colors: ["Red", "Black", "Blue"],
        stock: 25
    },
    {
        name: "Women's Summer Dress",
        description: "Light and comfortable summer dress with floral pattern. Perfect for casual outings.",
        price: 79.99,
        category: "women",
        subCategory: "casual",
        images: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500"],
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Floral", "White", "Pink"],
        stock: 40
    }
];

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dress-shop', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Product.deleteMany({});
        console.log('Cleared existing data');

        // Create users - let the User model handle password hashing
        const createdUsers = await Promise.all(
            users.map(user => User.create(user))
        );
        console.log('Created users:', createdUsers.map(u => u.email));

        // Create products
        const createdProducts = await Product.insertMany(products);
        console.log('Created products:', createdProducts.map(p => p.name));

        console.log('Database seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase(); 