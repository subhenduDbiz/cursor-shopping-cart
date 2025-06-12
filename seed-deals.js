const mongoose = require('mongoose');
const Deal = require('./models/Deal');
require('dotenv').config();

const deals = [
    {
        title: "Summer Collection Sale",
        description: "Get up to 50% off on our summer collection. Limited time offer!",
        originalPrice: 199.99,
        discountedPrice: 99.99,
        discountPercentage: 50,
        category: "men",
        image: "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=500",
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        isActive: true
    },
    {
        title: "Winter Wear Discount",
        description: "Stay warm with our winter collection at 40% off",
        originalPrice: 299.99,
        discountedPrice: 179.99,
        discountPercentage: 40,
        category: "women",
        image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500",
        startDate: new Date(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        isActive: true
    },
    // Add more deals here...
];

// Generate 28 more deals with variations
for (let i = 0; i < 28; i++) {
    const baseDeal = deals[i % 2]; // Cycle through the first 2 deals
    const newDeal = {
        ...baseDeal,
        title: `${baseDeal.title} ${i + 1}`,
        originalPrice: baseDeal.originalPrice + (i * 10),
        discountedPrice: baseDeal.discountedPrice + (i * 5),
        discountPercentage: Math.floor(Math.random() * 30) + 20, // Random discount between 20-50%
        category: i % 2 === 0 ? 'men' : 'women',
        startDate: new Date(),
        endDate: new Date(Date.now() + (7 + i) * 24 * 60 * 60 * 1000) // Varying end dates
    };
    deals.push(newDeal);
}

const seedDeals = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dress-shop', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Clear existing deals
        await Deal.deleteMany({});
        console.log('Cleared existing deals');

        // Create new deals
        const createdDeals = await Deal.insertMany(deals);
        console.log('Created deals:', createdDeals.map(d => d.title));

        console.log('Database seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDeals(); 