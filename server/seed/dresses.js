const Product = require('../models/Product');

const seedDresses = async () => {
    const dresses = [
        // Women's Dresses
        {
            name: 'Floral Summer Dress',
            description: 'A beautiful floral print dress perfect for summer days. Made with lightweight, breathable fabric.',
            price: 49.99,
            category: 'women',
            image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&auto=format',
            stock: 50
        },
        {
            name: 'Elegant Evening Gown',
            description: 'A stunning black evening gown with a flattering silhouette. Perfect for formal occasions.',
            price: 129.99,
            category: 'women',
            image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format',
            stock: 30
        },
        {
            name: 'Casual Maxi Dress',
            description: 'Comfortable and stylish maxi dress for everyday wear. Features a relaxed fit and soft fabric.',
            price: 39.99,
            category: 'women',
            image: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=500&auto=format',
            stock: 45
        },
        {
            name: 'Vintage Style Dress',
            description: 'A charming vintage-inspired dress with a fitted waist and full skirt.',
            price: 59.99,
            category: 'women',
            image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format',
            stock: 35
        },
        {
            name: 'Office Professional Dress',
            description: 'A sophisticated dress suitable for the workplace. Features a tailored fit and professional style.',
            price: 79.99,
            category: 'women',
            image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format',
            stock: 40
        },
        // Men's Dresses (Traditional/Formal Wear)
        {
            name: 'Classic Tuxedo',
            description: 'A timeless black tuxedo perfect for formal events. Includes matching pants and jacket.',
            price: 299.99,
            category: 'men',
            image: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=500&auto=format',
            stock: 25
        },
        {
            name: 'Formal Suit',
            description: 'A well-tailored suit suitable for business and formal occasions. Available in classic colors.',
            price: 249.99,
            category: 'men',
            image: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=500&auto=format',
            stock: 30
        },
        {
            name: 'Traditional Kurta',
            description: 'Elegant traditional kurta perfect for special occasions. Features intricate embroidery.',
            price: 89.99,
            category: 'men',
            image: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=500&auto=format',
            stock: 40
        },
        {
            name: 'Wedding Sherwani',
            description: 'Luxurious sherwani for wedding ceremonies. Features premium fabric and detailed work.',
            price: 399.99,
            category: 'men',
            image: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=500&auto=format',
            stock: 20
        },
        {
            name: 'Formal Blazer',
            description: 'A sophisticated blazer that can be paired with various outfits for a polished look.',
            price: 159.99,
            category: 'men',
            image: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=500&auto=format',
            stock: 35
        }
    ];

    try {
        // Clear existing dresses
        await Product.deleteMany({ category: { $in: ['men', 'women'] } });
        
        // Insert new dresses
        const createdDresses = await Product.insertMany(dresses);
        console.log(`Successfully seeded ${createdDresses.length} dresses`);
        return createdDresses;
    } catch (error) {
        console.error('Error seeding dresses:', error);
        throw error;
    }
};

module.exports = seedDresses; 