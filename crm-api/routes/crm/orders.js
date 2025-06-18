const express = require('express');
const router = express.Router();
const { superAdmin } = require('../../middleware/superAdmin');
const Order = require('../../models/Order');

/**
 * @swagger
 * /crm/orders:
 *   get:
 *     summary: Get All Orders
 *     description: Retrieve all orders with advanced filtering, pagination, and sorting (Super Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of orders per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search orders by order number, customer name, or email
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, processing, shipped, out_for_delivery, delivered, cancelled, returned]
 *         description: Filter by order status
 *       - in: query
 *         name: paymentStatus
 *         schema:
 *           type: string
 *           enum: [pending, paid, failed, refunded, partially_refunded]
 *         description: Filter by payment status
 *       - in: query
 *         name: paymentMethod
 *         schema:
 *           type: string
 *           enum: [credit_card, debit_card, paypal, bank_transfer, cash_on_delivery]
 *         description: Filter by payment method
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, normal, high, urgent]
 *         description: Filter by order priority
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter orders from this date (YYYY-MM-DD)
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter orders to this date (YYYY-MM-DD)
 *       - in: query
 *         name: minAmount
 *         schema:
 *           type: number
 *         description: Filter by minimum order amount
 *       - in: query
 *         name: maxAmount
 *         schema:
 *           type: number
 *         description: Filter by maximum order amount
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by shipping city
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, totalAmount, orderNumber, status]
 *           default: createdAt
 *         description: Sort field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 25
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalOrders:
 *                       type: integer
 *                     totalRevenue:
 *                       type: number
 *                     averageOrderValue:
 *                       type: number
 *                     statusBreakdown:
 *                       type: object
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       403:
 *         description: Forbidden - Super Admin privileges required
 *       500:
 *         description: Internal server error
 */
router.get('/', superAdmin, async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            status,
            paymentStatus,
            paymentMethod,
            priority,
            dateFrom,
            dateTo,
            minAmount,
            maxAmount,
            city,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;
        
        // Build query
        const query = {};
        
        if (search) {
            query.$or = [
                { orderNumber: { $regex: search, $options: 'i' } },
                { 'shippingAddress.firstName': { $regex: search, $options: 'i' } },
                { 'shippingAddress.lastName': { $regex: search, $options: 'i' } },
                { 'shippingAddress.email': { $regex: search, $options: 'i' } }
            ];
        }
        
        if (status) {
            query.status = status;
        }
        
        if (paymentStatus) {
            query.paymentStatus = paymentStatus;
        }
        
        if (paymentMethod) {
            query.paymentMethod = paymentMethod;
        }
        
        if (priority) {
            query.priority = priority;
        }
        
        if (dateFrom || dateTo) {
            query.createdAt = {};
            if (dateFrom) {
                query.createdAt.$gte = new Date(dateFrom);
            }
            if (dateTo) {
                query.createdAt.$lte = new Date(dateTo + 'T23:59:59.999Z');
            }
        }
        
        if (minAmount || maxAmount) {
            query.totalAmount = {};
            if (minAmount) {
                query.totalAmount.$gte = parseFloat(minAmount);
            }
            if (maxAmount) {
                query.totalAmount.$lte = parseFloat(maxAmount);
            }
        }
        
        if (city) {
            query['shippingAddress.city'] = { $regex: city, $options: 'i' };
        }

        // Calculate pagination
        const skip = (page - 1) * limit;
        const total = await Order.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Get orders with populated references
        const orders = await Order.find(query)
            .populate('user', 'name email mobileNumber')
            .populate('items.product', 'name image price')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        // Convert to objects with virtuals included
        const ordersWithVirtuals = orders.map(order => order.toObject({ virtuals: true }));

        // Calculate summary statistics
        const summary = await Order.aggregate([
            { $match: query },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: '$totalAmount' },
                    averageOrderValue: { $avg: '$totalAmount' }
                }
            }
        ]);

        const statusBreakdown = await Order.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            success: true,
            data: ordersWithVirtuals,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages
            },
            summary: {
                totalOrders: summary[0]?.totalOrders || 0,
                totalRevenue: summary[0]?.totalRevenue || 0,
                averageOrderValue: summary[0]?.averageOrderValue || 0,
                statusBreakdown: statusBreakdown.reduce((acc, item) => {
                    acc[item._id] = item.count;
                    return acc;
                }, {})
            }
        });
    } catch (error) {
        console.error('Orders List Error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

/**
 * @swagger
 * /crm/orders/{id}:
 *   get:
 *     summary: Get Order by ID
 *     description: Retrieve a specific order by its ID with full details (Super Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Super Admin privileges required
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', superAdmin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email mobileNumber profileImage')
            .populate('items.product', 'name image price description category')
            .populate('statusHistory.updatedBy', 'name email');
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Convert to object with virtuals included
        const orderWithVirtuals = order.toObject({ virtuals: true });

        res.json({
            success: true,
            data: orderWithVirtuals
        });
    } catch (error) {
        console.error('Get Order Error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

/**
 * @swagger
 * /crm/orders:
 *   post:
 *     summary: Create New Order
 *     description: Create a new order (Super Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - items
 *               - shippingAddress
 *               - paymentMethod
 *             properties:
 *               user:
 *                 type: string
 *                 description: User ID
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                       description: Product ID
 *                     quantity:
 *                       type: number
 *                       minimum: 1
 *                     price:
 *                       type: number
 *                       minimum: 0
 *                     discount:
 *                       type: number
 *                       minimum: 0
 *               shippingAddress:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   zipCode:
 *                     type: string
 *                   country:
 *                     type: string
 *                   phone:
 *                     type: string
 *               billingAddress:
 *                 type: object
 *               paymentMethod:
 *                 type: string
 *                 enum: [credit_card, debit_card, paypal, bank_transfer, cash_on_delivery]
 *               priority:
 *                 type: string
 *                 enum: [low, normal, high, urgent]
 *               notes:
 *                 type: object
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Order created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Super Admin privileges required
 *       500:
 *         description: Internal server error
 */
router.post('/', superAdmin, async (req, res) => {
    try {
        const {
            user,
            items,
            shippingAddress,
            billingAddress,
            paymentMethod,
            priority = 'normal',
            notes = {}
        } = req.body;

        // Validate required fields
        if (!user || !items || !shippingAddress || !paymentMethod) {
            return res.status(400).json({
                success: false,
                message: 'Required fields missing'
            });
        }

        // Calculate totals
        let subtotal = 0;
        const processedItems = items.map(item => {
            const itemTotal = (item.price * item.quantity) - (item.discount || 0);
            subtotal += itemTotal;
            return {
                ...item,
                totalPrice: itemTotal
            };
        });

        const totalAmount = subtotal + (req.body.tax || 0) + (req.body.shippingCost || 0) - (req.body.discount || 0);

        // Create order
        const order = new Order({
            user,
            items: processedItems,
            subtotal,
            tax: req.body.tax || 0,
            shippingCost: req.body.shippingCost || 0,
            discount: req.body.discount || 0,
            totalAmount,
            shippingAddress,
            billingAddress: billingAddress || shippingAddress,
            paymentMethod,
            priority,
            notes,
            createdBy: req.user._id
        });

        await order.save();

        // Populate references for response
        await order.populate([
            { path: 'user', select: 'name email mobileNumber' },
            { path: 'items.product', select: 'name image price' }
        ]);

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: order
        });
    } catch (error) {
        console.error('Create Order Error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

/**
 * @swagger
 * /crm/orders/{id}:
 *   put:
 *     summary: Update Order
 *     description: Update an existing order (Super Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, processing, shipped, out_for_delivery, delivered, cancelled, returned]
 *               paymentStatus:
 *                 type: string
 *                 enum: [pending, paid, failed, refunded, partially_refunded]
 *               shippingDetails:
 *                 type: object
 *               notes:
 *                 type: object
 *               priority:
 *                 type: string
 *                 enum: [low, normal, high, urgent]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Order updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Super Admin privileges required
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', superAdmin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Update fields
        const updateFields = ['status', 'paymentStatus', 'shippingDetails', 'notes', 'priority', 'tags'];
        updateFields.forEach(field => {
            if (req.body[field] !== undefined) {
                order[field] = req.body[field];
            }
        });

        // Add status change note if status is being updated
        if (req.body.status && req.body.status !== order.status) {
            order.statusHistory.push({
                status: req.body.status,
                timestamp: new Date(),
                updatedBy: req.user._id,
                notes: req.body.statusNote || `Status changed to ${req.body.status}`
            });
        }

        await order.save();

        // Populate references for response
        await order.populate([
            { path: 'user', select: 'name email mobileNumber' },
            { path: 'items.product', select: 'name image price' },
            { path: 'statusHistory.updatedBy', select: 'name email' }
        ]);

        res.json({
            success: true,
            message: 'Order updated successfully',
            data: order
        });
    } catch (error) {
        console.error('Update Order Error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

/**
 * @swagger
 * /crm/orders/{id}:
 *   delete:
 *     summary: Delete Order
 *     description: Delete an order (Super Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Order deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Super Admin privileges required
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', superAdmin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        await Order.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Order deleted successfully'
        });
    } catch (error) {
        console.error('Delete Order Error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

/**
 * @swagger
 * /crm/orders/stats/overview:
 *   get:
 *     summary: Get Order Statistics Overview
 *     description: Get comprehensive order statistics and analytics (Super Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [today, week, month, quarter, year]
 *           default: month
 *         description: Time period for statistics
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalOrders:
 *                       type: integer
 *                     totalRevenue:
 *                       type: number
 *                     averageOrderValue:
 *                       type: number
 *                     statusBreakdown:
 *                       type: object
 *                     paymentMethodBreakdown:
 *                       type: object
 *                     topProducts:
 *                       type: array
 *                     revenueTrend:
 *                       type: array
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Super Admin privileges required
 *       500:
 *         description: Internal server error
 */
router.get('/stats/overview', superAdmin, async (req, res) => {
    try {
        const { period = 'month' } = req.query;
        
        // Calculate date range based on period
        const now = new Date();
        let startDate;
        
        switch (period) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'quarter':
                const quarter = Math.floor(now.getMonth() / 3);
                startDate = new Date(now.getFullYear(), quarter * 3, 1);
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }

        const dateFilter = { createdAt: { $gte: startDate, $lte: now } };

        // Get basic statistics
        const basicStats = await Order.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: '$totalAmount' },
                    averageOrderValue: { $avg: '$totalAmount' }
                }
            }
        ]);

        // Get status breakdown
        const statusBreakdown = await Order.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get payment method breakdown
        const paymentMethodBreakdown = await Order.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: '$paymentMethod',
                    count: { $sum: 1 },
                    revenue: { $sum: '$totalAmount' }
                }
            }
        ]);

        // Get top products
        const topProducts = await Order.aggregate([
            { $match: dateFilter },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.product',
                    totalQuantity: { $sum: '$items.quantity' },
                    totalRevenue: { $sum: '$items.totalPrice' }
                }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' }
        ]);

        res.json({
            success: true,
            data: {
                totalOrders: basicStats[0]?.totalOrders || 0,
                totalRevenue: basicStats[0]?.totalRevenue || 0,
                averageOrderValue: basicStats[0]?.averageOrderValue || 0,
                statusBreakdown: statusBreakdown.reduce((acc, item) => {
                    acc[item._id] = item.count;
                    return acc;
                }, {}),
                paymentMethodBreakdown: paymentMethodBreakdown.reduce((acc, item) => {
                    acc[item._id] = { count: item.count, revenue: item.revenue };
                    return acc;
                }, {}),
                topProducts: topProducts.map(item => ({
                    product: item.product,
                    totalQuantity: item.totalQuantity,
                    totalRevenue: item.totalRevenue
                }))
            }
        });
    } catch (error) {
        console.error('Order Stats Error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

module.exports = router; 