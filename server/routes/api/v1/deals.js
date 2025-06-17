const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { protect } = require('../../../middleware/auth');
const { admin } = require('../../../middleware/admin');
const dealController = require('../../../controllers/DealController');

// Protect all routes
router.use(protect);

// Admin routes
router.post('/', admin,
    [
        check('productId', 'Product ID is required').not().isEmpty(),
        check('discountPercentage', 'Discount percentage is required and must be between 0 and 100').isFloat({ min: 0, max: 100 }),
        check('startDate', 'Start date is required').not().isEmpty(),
        check('endDate', 'End date is required').not().isEmpty()
    ],
    dealController.createDeal
);

router.put('/:id', admin,
    [
        check('discountPercentage', 'Discount percentage must be between 0 and 100').optional().isFloat({ min: 0, max: 100 }),
        check('startDate', 'Start date is required').optional().not().isEmpty(),
        check('endDate', 'End date is required').optional().not().isEmpty()
    ],
    dealController.updateDeal
);

router.delete('/:id', admin, dealController.deleteDeal);

// Public routes
router.get('/', dealController.getAllDeals);
router.get('/:id', dealController.getDealById);

module.exports = router; 