# Dress Shop E-commerce Application

A full-stack e-commerce application for selling men's and women's dresses, built with Node.js, Express, MongoDB, and React.

## Features

- User authentication and authorization
- Product management (CRUD operations)
- Shopping cart functionality
- Order management
- Payment integration (PayPal and Stripe)
- Responsive design
- Admin dashboard

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- PayPal Developer Account
- Stripe Account

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dress-shop
JWT_SECRET=your_jwt_secret_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dress-shop
```

2. Install server dependencies:
```bash
npm install
```

3. Install client dependencies:
```bash
cd client
npm install
```

4. Start the development server:
```bash
# Run backend only
npm run dev

# Run frontend only
npm run client

# Run both frontend and backend
npm run dev:full
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Products
- GET /api/products - Get all products
- GET /api/products/:id - Get product by ID
- POST /api/products - Create a product (Admin only)
- PUT /api/products/:id - Update a product (Admin only)
- DELETE /api/products/:id - Delete a product (Admin only)

### Orders
- POST /api/orders - Create a new order
- GET /api/orders/:id - Get order by ID
- GET /api/orders/myorders - Get logged in user orders
- PUT /api/orders/:id/pay - Update order to paid
- PUT /api/orders/:id/deliver - Update order to delivered (Admin only)

### Payment
- POST /api/payment/stripe/create-payment-intent - Create Stripe payment intent
- POST /api/payment/paypal/create-order - Create PayPal order
- POST /api/payment/paypal/capture-order - Capture PayPal order

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- PayPal SDK
- Stripe API

### Frontend
- React
- Redux
- React Router
- Axios
- Material-UI
- Styled Components

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 