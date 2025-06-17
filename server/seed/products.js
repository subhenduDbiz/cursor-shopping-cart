const Product = require('../models/Product');

const products = [
    // Women's Products
    {
        name: "Summer Floral Dress",
        description: "Beautiful floral pattern dress perfect for summer days",
        price: 79.99,
        image: "https://picsum.photos/seed/wdress1/800/1000",
        category: "Women",
        subcategory: "Dresses",
        stock: 50,
        featured: true
    },
    {
        name: "Women's Classic Blouse",
        description: "Elegant white blouse for any occasion",
        price: 49.99,
        image: "https://picsum.photos/seed/wblouse1/800/1000",
        category: "Women",
        subcategory: "Tops",
        stock: 100,
        featured: true
    },
    {
        name: "Women's Skinny Jeans",
        description: "Comfortable skinny jeans in dark blue",
        price: 69.99,
        image: "https://picsum.photos/seed/wjeans1/800/1000",
        category: "Women",
        subcategory: "Pants",
        stock: 75,
        featured: false
    },
    {
        name: "Women's Leather Jacket",
        description: "Classic black leather jacket",
        price: 199.99,
        image: "https://picsum.photos/seed/wjacket1/800/1000",
        category: "Women",
        subcategory: "Outerwear",
        stock: 30,
        featured: true
    },
    {
        name: "Women's Casual T-Shirt",
        description: "Comfortable cotton t-shirt",
        price: 29.99,
        image: "https://picsum.photos/seed/wtshirt1/800/1000",
        category: "Women",
        subcategory: "Tops",
        stock: 150,
        featured: false
    },
    {
        name: "Women's Summer Shorts",
        description: "Light and comfortable summer shorts",
        price: 39.99,
        image: "https://picsum.photos/seed/wshorts1/800/1000",
        category: "Women",
        subcategory: "Pants",
        stock: 80,
        featured: false
    },
    {
        name: "Women's Winter Coat",
        description: "Warm winter coat with hood",
        price: 149.99,
        image: "https://picsum.photos/seed/wcoat1/800/1000",
        category: "Women",
        subcategory: "Outerwear",
        stock: 40,
        featured: true
    },
    {
        name: "Evening Gown",
        description: "Elegant evening gown for special occasions",
        price: 299.99,
        image: "https://picsum.photos/seed/wgown1/800/1000",
        category: "Women",
        subcategory: "Dresses",
        stock: 20,
        featured: true
    },
    {
        name: "Women's Summer Hat",
        description: "Stylish summer hat with wide brim",
        price: 34.99,
        image: "https://picsum.photos/seed/what1/800/1000",
        category: "Women",
        subcategory: "Accessories",
        stock: 100,
        featured: false
    },
    {
        name: "Women's Winter Boots",
        description: "Waterproof winter boots",
        price: 129.99,
        image: "https://picsum.photos/seed/wboots1/800/1000",
        category: "Women",
        subcategory: "Shoes",
        stock: 45,
        featured: true
    },

    // Men's Products
    {
        name: "Men's Business Suit",
        description: "Professional business suit",
        price: 249.99,
        image: "https://picsum.photos/seed/msuit1/800/1000",
        category: "Men",
        subcategory: "Suits",
        stock: 25,
        featured: false
    },
    {
        name: "Men's Sports Jacket",
        description: "Lightweight sports jacket",
        price: 89.99,
        image: "https://picsum.photos/seed/mjacket1/800/1000",
        category: "Men",
        subcategory: "Outerwear",
        stock: 60,
        featured: false
    },
    {
        name: "Men's Classic Shirt",
        description: "Timeless white dress shirt",
        price: 59.99,
        image: "https://picsum.photos/seed/mshirt1/800/1000",
        category: "Men",
        subcategory: "Tops",
        stock: 100,
        featured: true
    },
    {
        name: "Men's Slim Fit Jeans",
        description: "Modern slim fit jeans",
        price: 79.99,
        image: "https://picsum.photos/seed/mjeans1/800/1000",
        category: "Men",
        subcategory: "Pants",
        stock: 85,
        featured: false
    },
    {
        name: "Men's Winter Coat",
        description: "Warm winter coat with hood",
        price: 159.99,
        image: "https://picsum.photos/seed/mcoat1/800/1000",
        category: "Men",
        subcategory: "Outerwear",
        stock: 35,
        featured: true
    },
    {
        name: "Men's Casual T-Shirt",
        description: "Comfortable cotton t-shirt",
        price: 24.99,
        image: "https://picsum.photos/seed/mtshirt1/800/1000",
        category: "Men",
        subcategory: "Tops",
        stock: 200,
        featured: false
    }
];

const seedProducts = async () => {
    try {
        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Insert new products
        await Product.insertMany(products);
        console.log('Successfully seeded products');
    } catch (error) {
        console.error('Error seeding products:', error);
        throw error;
    }
};

module.exports = seedProducts; 