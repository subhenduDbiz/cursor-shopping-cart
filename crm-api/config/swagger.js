const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'CRM API Documentation',
            version: '1.0.0',
            description: 'API documentation for the Super Admin CRM system',
            contact: {
                name: 'API Support',
                email: 'support@example.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:5001',
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'User ID'
                        },
                        name: {
                            type: 'string',
                            description: 'User full name'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'User email address'
                        },
                        mobileNumber: {
                            type: 'string',
                            description: 'User mobile number'
                        },
                        profileImage: {
                            type: 'string',
                            description: 'Profile image URL'
                        },
                        role: {
                            type: 'string',
                            enum: ['user', 'admin', 'super_admin'],
                            description: 'User role'
                        },
                        permissions: {
                            type: 'array',
                            items: {
                                type: 'string',
                                enum: [
                                    'manage_customers',
                                    'manage_products',
                                    'manage_orders',
                                    'manage_admins',
                                    'view_analytics',
                                    'manage_settings',
                                    'manage_deals',
                                    'manage_categories'
                                ]
                            },
                            description: 'User permissions'
                        },
                        isActive: {
                            type: 'boolean',
                            description: 'User account status'
                        },
                        lastLogin: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Last login timestamp'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Account creation timestamp'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Last update timestamp'
                        }
                    }
                },
                Product: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Product ID'
                        },
                        name: {
                            type: 'string',
                            description: 'Product name'
                        },
                        description: {
                            type: 'string',
                            description: 'Product description'
                        },
                        price: {
                            type: 'number',
                            description: 'Product price'
                        },
                        discountedPrice: {
                            type: 'number',
                            description: 'Price after discount'
                        },
                        category: {
                            type: 'string',
                            description: 'Product category'
                        },
                        image: {
                            type: 'string',
                            description: 'Product image URL'
                        },
                        stock: {
                            type: 'number',
                            description: 'Available stock'
                        },
                        isActive: {
                            type: 'boolean',
                            description: 'Product active status'
                        },
                        featured: {
                            type: 'boolean',
                            description: 'Featured product status'
                        },
                        discount: {
                            type: 'number',
                            description: 'Discount percentage'
                        },
                        tags: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'Product tags'
                        },
                        createdBy: {
                            type: 'object',
                            properties: {
                                _id: {
                                    type: 'string'
                                },
                                name: {
                                    type: 'string'
                                },
                                email: {
                                    type: 'string'
                                }
                            },
                            description: 'User who created the product'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Product creation timestamp'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Last update timestamp'
                        }
                    }
                },
                Order: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Order ID'
                        },
                        orderNumber: {
                            type: 'string',
                            description: 'Unique order number'
                        },
                        user: {
                            $ref: '#/components/schemas/User',
                            description: 'Customer who placed the order'
                        },
                        items: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    product: {
                                        $ref: '#/components/schemas/Product'
                                    },
                                    quantity: {
                                        type: 'number',
                                        minimum: 1
                                    },
                                    price: {
                                        type: 'number',
                                        minimum: 0
                                    },
                                    discount: {
                                        type: 'number',
                                        minimum: 0
                                    },
                                    totalPrice: {
                                        type: 'number',
                                        minimum: 0
                                    }
                                }
                            },
                            description: 'Order items'
                        },
                        subtotal: {
                            type: 'number',
                            description: 'Subtotal before tax and shipping'
                        },
                        tax: {
                            type: 'number',
                            description: 'Tax amount'
                        },
                        shippingCost: {
                            type: 'number',
                            description: 'Shipping cost'
                        },
                        discount: {
                            type: 'number',
                            description: 'Order discount'
                        },
                        totalAmount: {
                            type: 'number',
                            description: 'Total order amount'
                        },
                        shippingAddress: {
                            type: 'object',
                            properties: {
                                firstName: {
                                    type: 'string'
                                },
                                lastName: {
                                    type: 'string'
                                },
                                street: {
                                    type: 'string'
                                },
                                city: {
                                    type: 'string'
                                },
                                state: {
                                    type: 'string'
                                },
                                zipCode: {
                                    type: 'string'
                                },
                                country: {
                                    type: 'string'
                                },
                                phone: {
                                    type: 'string'
                                }
                            },
                            description: 'Shipping address'
                        },
                        billingAddress: {
                            type: 'object',
                            properties: {
                                firstName: {
                                    type: 'string'
                                },
                                lastName: {
                                    type: 'string'
                                },
                                street: {
                                    type: 'string'
                                },
                                city: {
                                    type: 'string'
                                },
                                state: {
                                    type: 'string'
                                },
                                zipCode: {
                                    type: 'string'
                                },
                                country: {
                                    type: 'string'
                                }
                            },
                            description: 'Billing address'
                        },
                        paymentMethod: {
                            type: 'string',
                            enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'],
                            description: 'Payment method used'
                        },
                        paymentStatus: {
                            type: 'string',
                            enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
                            description: 'Payment status'
                        },
                        paymentDetails: {
                            type: 'object',
                            properties: {
                                transactionId: {
                                    type: 'string'
                                },
                                paymentDate: {
                                    type: 'string',
                                    format: 'date-time'
                                },
                                paymentGateway: {
                                    type: 'string'
                                }
                            },
                            description: 'Payment transaction details'
                        },
                        status: {
                            type: 'string',
                            enum: ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
                            description: 'Order status'
                        },
                        statusHistory: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    status: {
                                        type: 'string'
                                    },
                                    timestamp: {
                                        type: 'string',
                                        format: 'date-time'
                                    },
                                    updatedBy: {
                                        $ref: '#/components/schemas/User'
                                    },
                                    notes: {
                                        type: 'string'
                                    }
                                }
                            },
                            description: 'Order status change history'
                        },
                        shippingDetails: {
                            type: 'object',
                            properties: {
                                trackingNumber: {
                                    type: 'string'
                                },
                                carrier: {
                                    type: 'string'
                                },
                                shippedDate: {
                                    type: 'string',
                                    format: 'date-time'
                                },
                                estimatedDelivery: {
                                    type: 'string',
                                    format: 'date-time'
                                },
                                actualDelivery: {
                                    type: 'string',
                                    format: 'date-time'
                                }
                            },
                            description: 'Shipping and delivery details'
                        },
                        notes: {
                            type: 'object',
                            properties: {
                                customer: {
                                    type: 'string'
                                },
                                admin: {
                                    type: 'string'
                                }
                            },
                            description: 'Order notes'
                        },
                        tags: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'Order tags for categorization'
                        },
                        priority: {
                            type: 'string',
                            enum: ['low', 'normal', 'high', 'urgent'],
                            description: 'Order priority level'
                        },
                        isActive: {
                            type: 'boolean',
                            description: 'Order active status'
                        },
                        customerName: {
                            type: 'string',
                            description: 'Virtual field - full customer name'
                        },
                        orderAge: {
                            type: 'number',
                            description: 'Virtual field - order age in days'
                        },
                        createdBy: {
                            $ref: '#/components/schemas/User',
                            description: 'Admin who created the order'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Order creation timestamp'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Last update timestamp'
                        }
                    }
                },
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'User email address'
                        },
                        password: {
                            type: 'string',
                            description: 'User password'
                        }
                    }
                },
                LoginResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            description: 'Request success status'
                        },
                        message: {
                            type: 'string',
                            description: 'Response message'
                        },
                        data: {
                            type: 'object',
                            properties: {
                                token: {
                                    type: 'string',
                                    description: 'JWT authentication token'
                                },
                                user: {
                                    $ref: '#/components/schemas/User'
                                }
                            }
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        message: {
                            type: 'string',
                            description: 'Error message'
                        }
                    }
                }
            }
        }
    },
    apis: [
        './routes/**/*.js',
        './controllers/**/*.js',
        './models/**/*.js'
    ]
};

const specs = swaggerJsdoc(options);

module.exports = specs; 