const mongoose = require('mongoose');
const User = require('./models/User');
const config = require('./config/config');

const seedSuperAdmin = async () => {
    try {
        // Connect to database
        await mongoose.connect(config.mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB for seeding...');

        // Check if super admin already exists
        const existingSuperAdmin = await User.findOne({ role: 'super_admin' });
        
        if (existingSuperAdmin) {
            console.log('Super admin already exists:', existingSuperAdmin.email);
            process.exit(0);
        }

        // Create super admin user
        const superAdmin = new User({
            name: 'Super Admin',
            email: 'superadmin@example.com',
            password: 'superadmin123',
            mobileNumber: '+1234567890',
            role: 'super_admin',
            permissions: [
                'manage_customers',
                'manage_products',
                'manage_orders',
                'manage_admins',
                'view_analytics',
                'manage_settings',
                'manage_deals',
                'manage_categories'
            ],
            isActive: true
        });

        await superAdmin.save();

        console.log('Super admin created successfully!');
        console.log('Email: superadmin@example.com');
        console.log('Password: superadmin123');
        console.log('Database: dress-shop');

        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedSuperAdmin(); 