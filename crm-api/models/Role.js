const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    permissions: [{
        type: String,
        enum: [
            'manage_customers',
            'manage_products', 
            'manage_orders',
            'manage_admins',
            'view_analytics',
            'manage_settings',
            'manage_deals',
            'manage_categories',
            'view_reports',
            'manage_inventory',
            'manage_pricing',
            'manage_promotions'
        ]
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp on save
roleSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Check if role has specific permission
roleSchema.methods.hasPermission = function(permission) {
    return this.permissions.includes(permission);
};

// Add permission to role
roleSchema.methods.addPermission = function(permission) {
    if (!this.permissions.includes(permission)) {
        this.permissions.push(permission);
    }
    return this.save();
};

// Remove permission from role
roleSchema.methods.removePermission = function(permission) {
    this.permissions = this.permissions.filter(p => p !== permission);
    return this.save();
};

module.exports = mongoose.model('Role', roleSchema); 