const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const updateWomensImages = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dress-shop', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Update each women's product with a specific image
        const updates = [
            {
                name: "Floral Summer Dress",
                image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&auto=format&fit=crop"
            },
            {
                name: "Elegant Evening Gown",
                image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format&fit=crop"
            },
            {
                name: "Casual Blouse",
                image: "https://images.unsplash.com/photo-1604575396136-79d175778d1d?w=500&auto=format&fit=crop"
            },
            {
                name: "High-Waisted Jeans",
                image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop"
            },
            {
                name: "Knit Cardigan",
                image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&auto=format&fit=crop"
            }
        ];

        for (const update of updates) {
            const result = await Product.updateOne(
                { name: update.name },
                { $set: { images: [update.image] } }
            );
            console.log(`Updated ${update.name}: ${result.modifiedCount > 0 ? 'Success' : 'No changes'}`);
        }

        console.log('All women\'s product images have been updated');
        process.exit(0);
    } catch (error) {
        console.error('Error updating images:', error);
        process.exit(1);
    }
};

updateWomensImages(); 