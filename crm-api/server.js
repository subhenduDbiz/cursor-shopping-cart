const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const config = require('./config/config');
const connectDB = require('./config/db');
const swaggerSpecs = require('./config/swagger');

const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(cors({
    origin: config.clientUrl,
    credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'CRM API Documentation',
    customfavIcon: '/favicon.ico',
    swaggerOptions: {
        docExpansion: 'list',
        filter: true,
        showRequestHeaders: true,
        tryItOutEnabled: true
    }
}));

// Routes
app.use('/', require('./routes'));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'CRM API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'API endpoint not found',
        availableEndpoints: {
            documentation: '/api-docs',
            health: '/health',
            auth: '/crm/auth',
            customers: '/crm/customers'
        }
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ 
        success: false, 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(config.port, () => {
    console.log(`🚀 CRM API running on http://localhost:${config.port}`);
    console.log(`📚 API Documentation available at http://localhost:${config.port}/api-docs`);
    console.log(`🏥 Health check available at http://localhost:${config.port}/health`);
}); 