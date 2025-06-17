const Deal = require('../models/Deal');
const Product = require('../models/Product');
const BaseController = require('./BaseController');
const config = require('../config/config');

class DealController extends BaseController {
    constructor() {
        super(Deal);
    }

    // Get all active deals with pagination
    getAllDeals = async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            // Get total count of active deals
            const totalDeals = await Deal.countDocuments({ isActive: true });
            const totalPages = Math.ceil(totalDeals / limit);

            // Get deals for current page
            const deals = await Deal.find({ isActive: true })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            res.json({
                success: true,
                data: {
                    deals,
                    currentPage: page,
                    totalPages,
                    totalDeals
                }
            });
        } catch (err) {
            console.error('Error in getAllDeals:', err);
            res.status(500).json({
                success: false,
                msg: 'Server Error',
                error: err.message
            });
        }
    };

    // Get deal by ID
    getDealById = async (req, res) => {
        try {
            const deal = await Deal.findById(req.params.id)
                .populate('product', 'name price image');

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
    };

    // Create a new deal
    createDeal = async (req, res) => {
        try {
            const deal = new Deal(req.body);
            await deal.save();
            res.status(201).json({
                success: true,
                data: deal
            });
        } catch (err) {
            console.error('Error in createDeal:', err);
            res.status(400).json({
                success: false,
                msg: 'Error creating deal',
                error: err.message
            });
        }
    };

    // Update a deal
    updateDeal = async (req, res) => {
        try {
            const deal = await Deal.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
            if (!deal) {
                return res.status(404).json({
                    success: false,
                    msg: 'Deal not found'
                });
            }
            res.json({
                success: true,
                data: deal
            });
        } catch (err) {
            console.error('Error in updateDeal:', err);
            res.status(400).json({
                success: false,
                msg: 'Error updating deal',
                error: err.message
            });
        }
    };

    // Delete a deal
    deleteDeal = async (req, res) => {
        try {
            const deal = await Deal.findByIdAndDelete(req.params.id);
            if (!deal) {
                return res.status(404).json({
                    success: false,
                    msg: 'Deal not found'
                });
            }
            res.json({
                success: true,
                msg: 'Deal deleted successfully'
            });
        } catch (err) {
            console.error('Error in deleteDeal:', err);
            res.status(400).json({
                success: false,
                msg: 'Error deleting deal',
                error: err.message
            });
        }
    };
}

// Create a new instance and export it
const dealController = new DealController();
module.exports = dealController; 