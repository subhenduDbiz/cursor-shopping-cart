const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { protect } = require('../../../middleware/auth');
const { admin } = require('../../../middleware/admin');
const dealController = require('../../../controllers/DealController');
const upload = require('../../../middleware/upload');

/**
 * @swagger
 * components:
 *   schemas:
 *     Deal:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - discountPercentage
 *         - startDate
 *         - endDate
 *         - image
 *       properties:
 *         title:
 *           type: string
 *           description: Deal title
 *         description:
 *           type: string
 *           description: Deal description
 *         discountPercentage:
 *           type: number
 *           description: Discount percentage (0-100)
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Deal start date
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: Deal end date
 *         image:
 *           type: string
 *           description: URL to deal image
 *         isActive:
 *           type: boolean
 *           description: Whether the deal is currently active
 */

// Protect all routes
router.use(protect);

// Admin routes
router.post('/', protect, admin, upload.single('image'),
    [
        check('productId', 'Product ID is required').not().isEmpty(),
        check('discountPercentage', 'Discount percentage is required and must be between 0 and 100').isFloat({ min: 0, max: 100 }),
        check('startDate', 'Start date is required').not().isEmpty(),
        check('endDate', 'End date is required').not().isEmpty()
    ],
    dealController.createDeal
);

router.put('/:id', protect, admin, upload.single('image'),
    [
        check('discountPercentage', 'Discount percentage must be between 0 and 100').optional().isFloat({ min: 0, max: 100 }),
        check('startDate', 'Start date is required').optional().not().isEmpty(),
        check('endDate', 'End date is required').optional().not().isEmpty()
    ],
    dealController.updateDeal
);

router.delete('/:id', admin, dealController.deleteDeal);

/**
 * @swagger
 * /api/v1/deals:
 *   get:
 *     summary: Get all active deals
 *     tags: [Deals]
 *     responses:
 *       200:
 *         description: List of active deals
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Deal'
 */
router.get('/', dealController.getAllDeals);

/**
 * @swagger
 * /api/v1/deals/{id}:
 *   get:
 *     summary: Get deal by ID
 *     tags: [Deals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Deal ID
 *     responses:
 *       200:
 *         description: Deal details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Deal'
 *       404:
 *         description: Deal not found
 */
router.get('/:id', dealController.getDealById);

module.exports = router; 