const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        discount: {
            type: Number,
            default: 0,
            min: 0
        },
        totalPrice: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    subtotal: {
        type: Number,
        required: true,
        min: 0
    },
    tax: {
        type: Number,
        default: 0,
        min: 0
    },
    shippingCost: {
        type: Number,
        default: 0,
        min: 0
    },
    discount: {
        type: Number,
        default: 0,
        min: 0
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    shippingAddress: {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        street: {
            type: String,
            required: true,
            trim: true
        },
        city: {
            type: String,
            required: true,
            trim: true
        },
        state: {
            type: String,
            required: true,
            trim: true
        },
        zipCode: {
            type: String,
            required: true,
            trim: true
        },
        country: {
            type: String,
            required: true,
            trim: true
        },
        phone: {
            type: String,
            required: true,
            trim: true
        }
    },
    billingAddress: {
        firstName: {
            type: String,
            trim: true
        },
        lastName: {
            type: String,
            trim: true
        },
        street: {
            type: String,
            trim: true
        },
        city: {
            type: String,
            trim: true
        },
        state: {
            type: String,
            trim: true
        },
        zipCode: {
            type: String,
            trim: true
        },
        country: {
            type: String,
            trim: true
        }
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash_on_delivery']
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
        default: 'pending'
    },
    paymentDetails: {
        transactionId: {
            type: String,
            trim: true
        },
        paymentDate: {
            type: Date
        },
        paymentGateway: {
            type: String,
            trim: true
        }
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
        default: 'pending'
    },
    statusHistory: [{
        status: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        notes: {
            type: String,
            trim: true
        }
    }],
    shippingDetails: {
        trackingNumber: {
            type: String,
            trim: true
        },
        carrier: {
            type: String,
            trim: true
        },
        shippedDate: {
            type: Date
        },
        estimatedDelivery: {
            type: Date
        },
        actualDelivery: {
            type: Date
        }
    },
    notes: {
        customer: {
            type: String,
            trim: true
        },
        admin: {
            type: String,
            trim: true
        }
    },
    tags: [{
        type: String,
        trim: true
    }],
    priority: {
        type: String,
        enum: ['low', 'normal', 'high', 'urgent'],
        default: 'normal'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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
orderSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Generate order number
orderSchema.pre('save', async function(next) {
    if (this.isNew && !this.orderNumber) {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        // Get count of orders for today
        const todayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const todayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
        
        const orderCount = await this.constructor.countDocuments({
            createdAt: { $gte: todayStart, $lt: todayEnd }
        });
        
        this.orderNumber = `ORD-${year}${month}${day}-${String(orderCount + 1).padStart(4, '0')}`;
    }
    next();
});

// Add status to history when status changes
orderSchema.pre('save', function(next) {
    if (this.isModified('status') && !this.isNew) {
        this.statusHistory.push({
            status: this.status,
            timestamp: new Date()
        });
    }
    next();
});

// Virtual for full customer name
orderSchema.virtual('customerName').get(function() {
    // If user is populated and has a name, use that
    if (this.user && this.user.name) {
        return this.user.name;
    }
    
    // Otherwise use shipping address
    if (this.shippingAddress && this.shippingAddress.firstName && this.shippingAddress.lastName) {
        return `${this.shippingAddress.firstName} ${this.shippingAddress.lastName}`;
    }
    
    // Fallback to just first name or last name if one is missing
    if (this.shippingAddress) {
        if (this.shippingAddress.firstName && this.shippingAddress.lastName) {
            return `${this.shippingAddress.firstName} ${this.shippingAddress.lastName}`;
        } else if (this.shippingAddress.firstName) {
            return this.shippingAddress.firstName;
        } else if (this.shippingAddress.lastName) {
            return this.shippingAddress.lastName;
        }
    }
    
    // Final fallback
    return 'Unknown Customer';
});

// Virtual for order age in days
orderSchema.virtual('orderAge').get(function() {
    const now = new Date();
    const created = new Date(this.createdAt);
    const diffTime = Math.abs(now - created);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Ensure virtual fields are serialized
orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

// Indexes for better query performance
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'shippingAddress.city': 1 });
orderSchema.index({ paymentStatus: 1 });

module.exports = mongoose.model('Order', orderSchema); 