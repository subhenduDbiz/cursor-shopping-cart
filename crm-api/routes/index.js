const express = require('express');
const router = express.Router();

// CRM routes
router.use('/crm/auth', require('./crm/auth'));
router.use('/crm/customers', require('./crm/customers'));
router.use('/crm/products', require('./crm/products'));
router.use('/crm/orders', require('./crm/orders'));

module.exports = router; 