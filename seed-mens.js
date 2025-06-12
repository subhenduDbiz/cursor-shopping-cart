const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const menProducts = [
    {
        name: "Classic Black Suit",
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
        name: "Casual Denim Jacket",
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
        name: "Navy Blue Blazer",
        description: "Elegant navy blue blazer for semi-formal occasions.",
        price: 199.99,
        category: "men",
        subCategory: "formal",
        images: ["https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=500"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Navy"],
        stock: 25
    },
    {
        name: "Leather Bomber Jacket",
        description: "Classic leather bomber jacket with modern styling.",
        price: 249.99,
        category: "men",
        subCategory: "casual",
        images: ["https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500"],
        sizes: ["M", "L", "XL"],
        colors: ["Brown", "Black"],
        stock: 20
    },
    {
        name: "Wool Overcoat",
        description: "Warm and stylish wool overcoat for winter.",
        price: 349.99,
        category: "men",
        subCategory: "formal",
        images: ["https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=500"],
        sizes: ["M", "L", "XL"],
        colors: ["Gray", "Black"],
        stock: 15
    },
    {
        name: "Casual Chino Pants",
        description: "Comfortable chino pants for everyday wear.",
        price: 59.99,
        category: "men",
        subCategory: "casual",
        images: ["https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=500"],
        sizes: ["30", "32", "34", "36"],
        colors: ["Khaki", "Navy", "Black"],
        stock: 40
    },
    {
        name: "Formal Dress Shirt",
        description: "Crisp white dress shirt for formal occasions.",
        price: 79.99,
        category: "men",
        subCategory: "formal",
        images: ["https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=500"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["White", "Blue"],
        stock: 35
    },
    {
        name: "Slim Fit Jeans",
        description: "Modern slim fit jeans for a contemporary look.",
        price: 69.99,
        category: "men",
        subCategory: "casual",
        images: ["https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=500"],
        sizes: ["30", "32", "34", "36"],
        colors: ["Blue", "Black"],
        stock: 45
    },
    {
        name: "Tweed Sport Coat",
        description: "Classic tweed sport coat for a sophisticated look.",
        price: 229.99,
        category: "men",
        subCategory: "formal",
        images: ["https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=500"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Brown", "Gray"],
        stock: 20
    },
    {
        name: "Casual Hoodie",
        description: "Comfortable cotton hoodie for casual wear.",
        price: 49.99,
        category: "men",
        subCategory: "casual",
        images: ["https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=500"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Gray", "Black", "Navy"],
        stock: 50
    },
    // Add more products here...
];

// Generate 20 more products with variations
for (let i = 0; i < 20; i++) {
    const baseProduct = menProducts[i % 10]; // Cycle through the first 10 products
    const newProduct = {
        ...baseProduct,
        name: `${baseProduct.name} ${i + 1}`,
        price: baseProduct.price + (i * 5), // Slightly different price
        stock: Math.floor(Math.random() * 30) + 10 // Random stock between 10 and 40
    };
    menProducts.push(newProduct);
}

const seedMensProducts = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dress-shop', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Clear existing men's products
        await Product.deleteMany({ category: 'men' });
        console.log('Cleared existing men\'s products');

        // Create new men's products
        const createdProducts = await Product.insertMany(menProducts);
        console.log('Created men\'s products:', createdProducts.map(p => p.name));

        console.log('Database seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedMensProducts(); 