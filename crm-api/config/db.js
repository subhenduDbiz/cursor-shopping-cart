const mongoose = require('mongoose');
const config = require('./config');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`CRM API MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('CRM API Database connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB; 