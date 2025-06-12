const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const products = [
    {
        name: "MacBook Air M2",
        description: "The new MacBook Air with M2 chip delivers incredible performance and up to 18 hours of battery life.",
        price: 1199.99,
        categories: ["Laptops", "Electronics", "Apple Products", "Best Sellers", "New Arrivals", "Work From Home Essentials"],
        subCategories: ["Ultrabooks", "Business Laptops"],
        images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500"],
        brand: "Apple",
        specifications: {
            "Processor": "Apple M2 chip",
            "Memory": "8GB unified memory",
            "Storage": "256GB SSD",
            "Display": "13.6-inch Liquid Retina display",
            "Battery": "Up to 18 hours"
        },
        stock: 50,
        ratings: {
            average: 4.8,
            count: 120
        },
        isNewArrival: true,
        isBestSeller: true,
        isFeatured: true
    },
    {
        name: "Dell XPS 13",
        description: "Premium ultrabook with InfinityEdge display and powerful performance.",
        price: 999.99,
        categories: ["Laptops", "Electronics", "Best Sellers", "Work From Home Essentials"],
        subCategories: ["Ultrabooks", "Business Laptops"],
        images: ["https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500"],
        brand: "Dell",
        specifications: {
            "Processor": "Intel Core i7",
            "Memory": "16GB RAM",
            "Storage": "512GB SSD",
            "Display": "13.4-inch 4K UHD",
            "Battery": "Up to 12 hours"
        },
        stock: 35,
        ratings: {
            average: 4.7,
            count: 85
        },
        isBestSeller: true
    },
    {
        name: "iPad Pro M2",
        description: "Supercharged by M2, iPad Pro takes your creativity to the next level.",
        price: 799.99,
        categories: ["Tablets", "Electronics", "Apple Products", "New Arrivals"],
        subCategories: ["Professional Tablets"],
        images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500"],
        brand: "Apple",
        specifications: {
            "Processor": "Apple M2 chip",
            "Memory": "8GB RAM",
            "Storage": "128GB",
            "Display": "11-inch Liquid Retina",
            "Battery": "Up to 10 hours"
        },
        stock: 40,
        ratings: {
            average: 4.9,
            count: 95
        },
        isNewArrival: true
    },
    {
        name: "Samsung Galaxy S23 Ultra",
        description: "The ultimate smartphone with revolutionary camera system.",
        price: 1199.99,
        categories: ["Smartphones", "Electronics", "New Arrivals", "Best Sellers"],
        subCategories: ["Android Phones"],
        images: ["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500"],
        brand: "Samsung",
        specifications: {
            "Processor": "Snapdragon 8 Gen 2",
            "Memory": "12GB RAM",
            "Storage": "256GB",
            "Display": "6.8-inch Dynamic AMOLED",
            "Battery": "5000mAh"
        },
        stock: 45,
        ratings: {
            average: 4.8,
            count: 150
        },
        isNewArrival: true,
        isBestSeller: true
    },
    {
        name: "Sony WH-1000XM5",
        description: "Industry-leading noise canceling headphones with exceptional sound quality.",
        price: 399.99,
        categories: ["Audio", "Electronics", "Best Sellers", "Work From Home Essentials"],
        subCategories: ["Headphones", "Wireless Audio"],
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"],
        brand: "Sony",
        specifications: {
            "Noise Cancellation": "Industry-leading",
            "Battery Life": "30 hours",
            "Connectivity": "Bluetooth 5.2",
            "Weight": "250g",
            "Features": "Touch controls, Voice assistant"
        },
        stock: 30,
        ratings: {
            average: 4.9,
            count: 200
        },
        isBestSeller: true
    },
    {
        name: "Apple Watch Series 8",
        description: "Advanced health features and always-on display.",
        price: 399.99,
        categories: ["Wearables", "Electronics", "Apple Products", "New Arrivals"],
        subCategories: ["Smartwatches"],
        images: ["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500"],
        brand: "Apple",
        specifications: {
            "Display": "Always-On Retina",
            "Battery": "Up to 18 hours",
            "Features": "Heart rate, ECG, Fall detection",
            "Water Resistance": "50m",
            "Connectivity": "GPS + Cellular"
        },
        stock: 60,
        ratings: {
            average: 4.7,
            count: 180
        },
        isNewArrival: true
    },
    {
        name: "Microsoft Surface Pro 9",
        description: "Versatile 2-in-1 laptop with powerful performance.",
        price: 1099.99,
        categories: ["Laptops", "Electronics", "Work From Home Essentials"],
        subCategories: ["2-in-1 Laptops"],
        images: ["https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=500"],
        brand: "Microsoft",
        specifications: {
            "Processor": "Intel Core i7",
            "Memory": "16GB RAM",
            "Storage": "512GB SSD",
            "Display": "13-inch PixelSense",
            "Battery": "Up to 15.5 hours"
        },
        stock: 25,
        ratings: {
            average: 4.6,
            count: 75
        }
    },
    {
        name: "AirPods Pro 2",
        description: "Active noise cancellation and spatial audio.",
        price: 249.99,
        categories: ["Audio", "Electronics", "Apple Products", "New Arrivals"],
        subCategories: ["Wireless Earbuds"],
        images: ["https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500"],
        brand: "Apple",
        specifications: {
            "Noise Cancellation": "Active",
            "Battery Life": "6 hours",
            "Features": "Spatial Audio, Transparency mode",
            "Connectivity": "Bluetooth 5.3",
            "Water Resistance": "IPX4"
        },
        stock: 100,
        ratings: {
            average: 4.8,
            count: 250
        },
        isNewArrival: true
    },
    {
        name: "LG OLED C2 TV",
        description: "Stunning 4K OLED display with perfect blacks.",
        price: 1999.99,
        categories: ["TVs", "Electronics", "Best Sellers"],
        subCategories: ["Smart TVs", "OLED TVs"],
        images: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500"],
        brand: "LG",
        specifications: {
            "Display": "55-inch OLED",
            "Resolution": "4K UHD",
            "HDR": "Dolby Vision, HDR10",
            "Smart Features": "webOS",
            "Connectivity": "4 HDMI 2.1"
        },
        stock: 20,
        ratings: {
            average: 4.9,
            count: 120
        },
        isBestSeller: true
    },
    {
        name: "Nintendo Switch OLED",
        description: "Enhanced gaming experience with vibrant OLED screen.",
        price: 349.99,
        categories: ["Gaming", "Electronics", "Best Sellers"],
        subCategories: ["Gaming Consoles", "Portable Gaming"],
        images: ["https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500"],
        brand: "Nintendo",
        specifications: {
            "Display": "7-inch OLED",
            "Storage": "64GB",
            "Battery": "4.5-9 hours",
            "Features": "Dock included",
            "Connectivity": "Wi-Fi, Bluetooth"
        },
        stock: 40,
        ratings: {
            average: 4.8,
            count: 300
        },
        isBestSeller: true
    },
    {
        name: "DJI Mini 3 Pro",
        description: "Ultra-lightweight drone with professional features.",
        price: 699.99,
        categories: ["Drones", "Electronics", "New Arrivals"],
        subCategories: ["Camera Drones"],
        images: ["https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=500"],
        brand: "DJI",
        specifications: {
            "Weight": "249g",
            "Camera": "4K/60fps",
            "Flight Time": "34 minutes",
            "Range": "12km",
            "Features": "Obstacle avoidance"
        },
        stock: 15,
        ratings: {
            average: 4.7,
            count: 85
        },
        isNewArrival: true
    },
    {
        name: "GoPro Hero 11 Black",
        description: "Professional action camera with 5.3K video.",
        price: 499.99,
        categories: ["Cameras", "Electronics", "New Arrivals"],
        subCategories: ["Action Cameras"],
        images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500"],
        brand: "GoPro",
        specifications: {
            "Video": "5.3K/60fps",
            "Photo": "27MP",
            "Stabilization": "HyperSmooth 5.0",
            "Waterproof": "10m",
            "Battery": "Enduro"
        },
        stock: 30,
        ratings: {
            average: 4.8,
            count: 95
        },
        isNewArrival: true
    },
    {
        name: "Amazon Echo Show 10",
        description: "Smart display with Alexa and motion tracking.",
        price: 249.99,
        categories: ["Smart Home", "Electronics", "Best Sellers"],
        subCategories: ["Smart Displays"],
        images: ["https://images.unsplash.com/photo-1589003077984-894e133dabab?w=500"],
        brand: "Amazon",
        specifications: {
            "Display": "10.1-inch HD",
            "Camera": "13MP",
            "Audio": "2.1 speakers",
            "Features": "Motion tracking",
            "Connectivity": "Wi-Fi, Bluetooth"
        },
        stock: 50,
        ratings: {
            average: 4.6,
            count: 180
        },
        isBestSeller: true
    },
    {
        name: "Fitbit Sense 2",
        description: "Advanced health smartwatch with stress management.",
        price: 299.99,
        categories: ["Wearables", "Electronics", "New Arrivals"],
        subCategories: ["Smartwatches", "Fitness Trackers"],
        images: ["https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=500"],
        brand: "Fitbit",
        specifications: {
            "Display": "AMOLED",
            "Battery": "6+ days",
            "Features": "Stress management, ECG",
            "Water Resistance": "50m",
            "Sensors": "Heart rate, SpO2"
        },
        stock: 35,
        ratings: {
            average: 4.5,
            count: 90
        },
        isNewArrival: true
    },
    {
        name: "Logitech MX Master 3S",
        description: "Premium wireless mouse for productivity.",
        price: 99.99,
        categories: ["Accessories", "Electronics", "Work From Home Essentials"],
        subCategories: ["Computer Mice"],
        images: ["https://images.unsplash.com/photo-1527814050087-3793815479db?w=500"],
        brand: "Logitech",
        specifications: {
            "Connectivity": "Bluetooth, USB",
            "Battery": "70 days",
            "DPI": "8000",
            "Features": "MagSpeed scroll",
            "Compatibility": "Multi-device"
        },
        stock: 60,
        ratings: {
            average: 4.9,
            count: 220
        }
    }
];

const seedProducts = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dress-shop', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Create new products
        const createdProducts = await Product.insertMany(products);
        console.log('Created products:', createdProducts.map(p => p.name));

        console.log('Database seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedProducts(); 