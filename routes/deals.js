const express = require('express');
const router = express.Router();
const Deal = require('../models/Deal');

// @route   GET api/deals
// @desc    Get all deals with pagination
// @access  Public
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const category = req.query.category;

        const query = category ? { category, isActive: true } : { isActive: true };
        
        const totalDeals = await Deal.countDocuments(query);
        const totalPages = Math.ceil(totalDeals / limit);
        
        const deals = await Deal.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            deals,
            currentPage: page,
            totalPages,
            totalDeals
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/deals/:id
// @desc    Get deal by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const deal = await Deal.findById(req.params.id);
        if (!deal) {
            return res.status(404).json({ msg: 'Deal not found' });
        }
        res.json(deal);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Deal not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router; 