const Deal = require('../models/Deal');

const deals = [
    {
        title: "Summer Collection Sale",
        description: "Get up to 50% off on our latest summer collection. Limited time offer!",
        image: "https://picsum.photos/seed/summer1/800/600",
        originalPrice: 199.99,
        discountedPrice: 99.99,
        discountPercentage: 50,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true
    },
    {
        title: "Winter Essentials",
        description: "Stay warm with our winter collection at amazing prices.",
        image: "https://picsum.photos/seed/winter1/800/600",
        originalPrice: 299.99,
        discountedPrice: 199.99,
        discountPercentage: 33,
        startDate: new Date(),
        endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        isActive: true
    },
    {
        title: "Weekend Special",
        description: "Weekend special deals on selected items. Don't miss out!",
        image: "https://picsum.photos/seed/weekend1/800/600",
        originalPrice: 149.99,
        discountedPrice: 89.99,
        discountPercentage: 40,
        startDate: new Date(),
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        isActive: true
    },
    {
        title: "Flash Sale",
        description: "Flash sale on trending items. Limited stock available!",
        image: "https://picsum.photos/seed/flash1/800/600",
        originalPrice: 249.99,
        discountedPrice: 149.99,
        discountPercentage: 40,
        startDate: new Date(),
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        isActive: true
    },
    {
        title: "Clearance Sale",
        description: "Clearance sale on last season's items. Up to 70% off!",
        image: "https://picsum.photos/seed/clearance1/800/600",
        originalPrice: 399.99,
        discountedPrice: 119.99,
        discountPercentage: 70,
        startDate: new Date(),
        endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        isActive: true
    },
    {
        title: "New Arrivals Discount",
        description: "Special discount on our new arrivals. Be the first to grab them!",
        image: "https://picsum.photos/seed/new1/800/600",
        originalPrice: 179.99,
        discountedPrice: 143.99,
        discountPercentage: 20,
        startDate: new Date(),
        endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        isActive: true
    },
    {
        title: "Holiday Special",
        description: "Holiday special deals on premium items.",
        image: "https://picsum.photos/seed/holiday1/800/600",
        originalPrice: 499.99,
        discountedPrice: 349.99,
        discountPercentage: 30,
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        isActive: true
    },
    {
        title: "Student Discount",
        description: "Special discount for students. Valid student ID required.",
        image: "https://picsum.photos/seed/student1/800/600",
        originalPrice: 199.99,
        discountedPrice: 159.99,
        discountPercentage: 20,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        isActive: true
    },
    {
        title: "Early Bird Offer",
        description: "Early bird gets the worm! Special morning deals.",
        image: "https://picsum.photos/seed/early1/800/600",
        originalPrice: 299.99,
        discountedPrice: 239.99,
        discountPercentage: 20,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        isActive: true
    },
    {
        title: "Bundle Deal",
        description: "Buy more, save more! Bundle deals on selected items.",
        image: "https://picsum.photos/seed/bundle1/800/600",
        originalPrice: 599.99,
        discountedPrice: 449.99,
        discountPercentage: 25,
        startDate: new Date(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        isActive: true
    },
    {
        title: "Premium Collection Sale",
        description: "Exclusive deals on our premium collection.",
        image: "https://picsum.photos/seed/premium1/800/600",
        originalPrice: 799.99,
        discountedPrice: 559.99,
        discountPercentage: 30,
        startDate: new Date(),
        endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        isActive: true
    },
    {
        title: "Fashion Week Special",
        description: "Special deals during fashion week. Limited time only!",
        image: "https://picsum.photos/seed/fashion1/800/600",
        originalPrice: 349.99,
        discountedPrice: 244.99,
        discountPercentage: 30,
        startDate: new Date(),
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        isActive: true
    },
    {
        title: "Back to School",
        description: "Get ready for school with our special deals.",
        image: "https://picsum.photos/seed/school1/800/600",
        originalPrice: 249.99,
        discountedPrice: 174.99,
        discountPercentage: 30,
        startDate: new Date(),
        endDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        isActive: true
    },
    {
        title: "Black Friday Preview",
        description: "Early access to Black Friday deals.",
        image: "https://picsum.photos/seed/blackfriday1/800/600",
        originalPrice: 599.99,
        discountedPrice: 299.99,
        discountPercentage: 50,
        startDate: new Date(),
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        isActive: true
    },
    {
        title: "Cyber Monday Special",
        description: "Exclusive online deals for Cyber Monday.",
        image: "https://picsum.photos/seed/cyber1/800/600",
        originalPrice: 449.99,
        discountedPrice: 269.99,
        discountPercentage: 40,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        isActive: true
    }
];

const seedDeals = async () => {
    try {
        // Clear existing deals
        await Deal.deleteMany({});
        console.log('Cleared existing deals');

        // Insert new deals
        await Deal.insertMany(deals);
        console.log('Successfully seeded deals');
    } catch (error) {
        console.error('Error seeding deals:', error);
        throw error;
    }
};

module.exports = seedDeals; 