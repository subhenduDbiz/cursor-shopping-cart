const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const products = [
    // Electronics Products
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
    // ... (other electronics products remain the same)

    // Men's Clothing Products
    {
        name: "Classic Fit Dress Shirt",
        description: "Premium cotton dress shirt with a comfortable classic fit.",
        price: 49.99,
        categories: ["Men", "Clothing", "Formal Wear"],
        subCategories: ["Shirts", "Business Casual"],
        images: ["https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500"],
        brand: "Fashion Brand",
        specifications: {
            "Material": "100% Cotton",
            "Fit": "Classic",
            "Collar": "Button-down",
            "Cuffs": "Single",
            "Care": "Machine washable"
        },
        stock: 100,
        ratings: {
            average: 4.5,
            count: 85
        }
    },
    {
        name: "Slim Fit Chino Pants",
        description: "Modern slim fit chinos perfect for casual and semi-formal occasions.",
        price: 59.99,
        categories: ["Men", "Clothing", "Casual Wear"],
        subCategories: ["Pants", "Casual"],
        images: ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500"],
        brand: "Urban Style",
        specifications: {
            "Material": "Cotton Blend",
            "Fit": "Slim",
            "Closure": "Button and Zip",
            "Pockets": "4",
            "Care": "Machine wash cold"
        },
        stock: 75,
        ratings: {
            average: 4.6,
            count: 92
        }
    },
    {
        name: "Wool Blend Blazer",
        description: "Sophisticated wool blend blazer for a polished look.",
        price: 129.99,
        categories: ["Men", "Clothing", "Formal Wear"],
        subCategories: ["Blazers", "Business"],
        images: ["https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=500"],
        brand: "Elegance",
        specifications: {
            "Material": "Wool Blend",
            "Fit": "Regular",
            "Lining": "Full",
            "Buttons": "2",
            "Care": "Dry clean only"
        },
        stock: 40,
        ratings: {
            average: 4.7,
            count: 65
        }
    },
    {
        name: "Casual Denim Jacket",
        description: "Versatile denim jacket for everyday style.",
        price: 79.99,
        categories: ["Men", "Clothing", "Casual Wear"],
        subCategories: ["Jackets", "Denim"],
        images: ["https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500"],
        brand: "Denim Co",
        specifications: {
            "Material": "Denim",
            "Fit": "Regular",
            "Closure": "Button",
            "Pockets": "4",
            "Care": "Machine wash cold"
        },
        stock: 60,
        ratings: {
            average: 4.4,
            count: 78
        }
    },
    {
        name: "Premium Cotton T-Shirt",
        description: "Soft and comfortable premium cotton t-shirt.",
        price: 29.99,
        categories: ["Men", "Clothing", "Casual Wear"],
        subCategories: ["T-Shirts", "Basics"],
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"],
        brand: "Basic Wear",
        specifications: {
            "Material": "100% Cotton",
            "Fit": "Regular",
            "Neck": "Crew",
            "Sleeves": "Short",
            "Care": "Machine wash cold"
        },
        stock: 150,
        ratings: {
            average: 4.5,
            count: 120
        }
    },

    // Women's Clothing Products
    {
        name: "Floral Summer Dress",
        description: "Beautiful floral print dress perfect for summer days.",
        price: 69.99,
        categories: ["Women", "Clothing", "Casual Wear"],
        subCategories: ["Dresses", "Summer"],
        images: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&auto=format&fit=crop"],
        brand: "Summer Style",
        specifications: {
            "Material": "Cotton Blend",
            "Fit": "Regular",
            "Length": "Knee Length",
            "Pattern": "Floral",
            "Care": "Machine wash cold"
        },
        stock: 80,
        ratings: {
            average: 4.6,
            count: 95
        }
    },
    {
        name: "Elegant Evening Gown",
        description: "Stunning evening gown for special occasions.",
        price: 199.99,
        categories: ["Women", "Clothing", "Formal Wear"],
        subCategories: ["Dresses", "Evening Wear"],
        images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format&fit=crop"],
        brand: "Elegance",
        specifications: {
            "Material": "Silk Blend",
            "Fit": "A-line",
            "Length": "Floor Length",
            "Style": "Strapless",
            "Care": "Dry clean only"
        },
        stock: 30,
        ratings: {
            average: 4.8,
            count: 45
        }
    },
    {
        name: "Casual Blouse",
        description: "Light and airy blouse for everyday wear.",
        price: 39.99,
        categories: ["Women", "Clothing", "Casual Wear"],
        subCategories: ["Tops", "Blouses"],
        images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop"],
        brand: "Casual Chic",
        specifications: {
            "Material": "Polyester Blend",
            "Fit": "Regular",
            "Neck": "V-neck",
            "Sleeves": "Short",
            "Care": "Machine wash cold"
        },
        stock: 100,
        ratings: {
            average: 4.4,
            count: 88
        }
    },
    {
        name: "High-Waisted Jeans",
        description: "Stylish high-waisted jeans with a comfortable fit.",
        price: 59.99,
        categories: ["Women", "Clothing", "Casual Wear"],
        subCategories: ["Pants", "Denim"],
        images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop"],
        brand: "Denim Co",
        specifications: {
            "Material": "Denim",
            "Fit": "High Waisted",
            "Closure": "Button and Zip",
            "Pockets": "4",
            "Care": "Machine wash cold"
        },
        stock: 90,
        ratings: {
            average: 4.7,
            count: 110
        }
    },
    {
        name: "Knit Cardigan",
        description: "Soft and cozy knit cardigan for layering.",
        price: 49.99,
        categories: ["Women", "Clothing", "Casual Wear"],
        subCategories: ["Sweaters", "Cardigans"],
        images: ["https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&auto=format&fit=crop"],
        brand: "Cozy Wear",
        specifications: {
            "Material": "Cotton Blend",
            "Fit": "Regular",
            "Closure": "Button",
            "Length": "Hip Length",
            "Care": "Machine wash cold"
        },
        stock: 70,
        ratings: {
            average: 4.5,
            count: 82
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