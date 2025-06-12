const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paypal = require('@paypal/checkout-server-sdk');
const auth = require('../middleware/auth');

// PayPal configuration
let environment = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
);
let paypalClient = new paypal.core.PayPalHttpClient(environment);

// @route   POST api/payment/stripe/create-payment-intent
// @desc    Create Stripe payment intent
// @access  Private
router.post('/stripe/create-payment-intent', auth, async (req, res) => {
    try {
        const { amount } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert to cents
            currency: 'usd',
            payment_method_types: ['card']
        });

        res.json({
            clientSecret: paymentIntent.client_secret
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/payment/paypal/create-order
// @desc    Create PayPal order
// @access  Private
router.post('/paypal/create-order', auth, async (req, res) => {
    try {
        const { amount } = req.body;

        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: amount
                }
            }]
        });

        const order = await paypalClient.execute(request);
        res.json({
            orderID: order.result.id
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/payment/paypal/capture-order
// @desc    Capture PayPal order
// @access  Private
router.post('/paypal/capture-order', auth, async (req, res) => {
    try {
        const { orderID } = req.body;

        const request = new paypal.orders.OrdersCaptureRequest(orderID);
        const capture = await paypalClient.execute(request);

        res.json({
            captureID: capture.result.id,
            status: capture.result.status
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router; 