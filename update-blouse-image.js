const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const updateBlouseImage = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dress-shop', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Update the Casual Blouse image
        const result = await Product.updateOne(
            { name: "Casual Blouse" },
            { 
                $set: { 
                    images: ["https://images.unsplash.com/photo-1604575396136-79d175778d1d?w=500"] 
                } 
            }
        );

        if (result.modifiedCount > 0) {
            console.log('Successfully updated Casual Blouse image');
        } else {
            console.log('No changes made to Casual Blouse');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error updating image:', error);
        process.exit(1);
    }
};

updateBlouseImage(); 