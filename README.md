# Shopping Cart Application

A full-stack e-commerce application with user authentication, product management, shopping cart, and order processing.

## Features

- User Authentication (Register, Login, Profile Management)
- Product Management (CRUD operations)
- Shopping Cart Functionality
- Order Processing
- Admin Dashboard
- Image Upload for Products and User Profiles
- API Documentation with Swagger

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Multer for File Uploads
- Swagger for API Documentation

### Frontend
- React.js
- Redux for State Management
- Axios for API Calls
- Material-UI for Styling

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd shopping-cart
```

2. Install backend dependencies:
```bash
cd server
npm install
```

3. Install frontend dependencies:
```bash
cd ../client
npm install
```

4. Create a `.env` file in the server directory with the following variables:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shopping-cart
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:3000
```

### Running the Application

1. Start the backend server:
```bash
cd server
npm start
```

2. Start the frontend development server:
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api-docs

## API Documentation

The API documentation is available at http://localhost:5000/api-docs. It provides detailed information about:

- Available endpoints
- Request/response schemas
- Authentication requirements
- Example requests and responses

### API Endpoints

#### Authentication
- POST /api/v1/auth/register - Register a new user
- POST /api/v1/auth/login - Login user
- GET /api/v1/auth/me - Get current user profile
- PUT /api/v1/auth/update-profile - Update user profile
- PUT /api/v1/auth/change-password - Change user password

#### Products
- GET /api/v1/products - Get all products
- GET /api/v1/products/:id - Get product by ID
- POST /api/v1/products - Create new product (Admin only)
- PUT /api/v1/products/:id - Update product (Admin only)
- DELETE /api/v1/products/:id - Delete product (Admin only)

#### Cart
- GET /api/v1/cart - Get user's cart
- POST /api/v1/cart - Add item to cart
- PUT /api/v1/cart/:productId - Update cart item quantity
- DELETE /api/v1/cart/:productId - Remove item from cart
- DELETE /api/v1/cart - Clear cart

#### Orders
- GET /api/v1/orders - Get user's orders
- GET /api/v1/orders/:id - Get order by ID
- POST /api/v1/orders - Create new order
- PUT /api/v1/orders/:id/status - Update order status (Admin only)

## Database Seeding

To seed the database with initial data:

```bash
cd server
node seed/index.js
```

This will create:
- Admin user (email: admin@example.com, password: admin123)
- Sample products
- Sample deals

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 