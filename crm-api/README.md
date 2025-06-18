# CRM API Documentation

A comprehensive API for Super Admin management system with role-based access control and customer management.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation
```bash
cd crm-api
npm install
```

### Environment Setup
Create a `.env` file in the root directory:
```env
NODE_ENV=development
CRM_PORT=5001
MONGODB_URI=mongodb://localhost:27017/shopping-cart
JWT_SECRET=your-super-secret-jwt-key
ADMIN_CLIENT_URL=http://localhost:3001
```

### Database Seeding
```bash
node seed.js
```
This creates a super admin user:
- **Email:** `superadmin@example.com`
- **Password:** `superadmin123`

### Start Server
```bash
npm start
```

## 📚 API Documentation

### Swagger UI
**Live Documentation:** http://localhost:5001/api-docs

The Swagger UI provides:
- Interactive API documentation
- Request/response schemas
- Authentication examples
- Try-it-out functionality
- Error code explanations

### Health Check
**Endpoint:** http://localhost:5001/health

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Login Flow
1. **POST** `/crm/auth/login` - Get JWT token
2. Include token in subsequent requests
3. Token expires in 24 hours

## 📋 Available Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/crm/auth/login` | Super Admin Login | No |
| GET | `/crm/auth/profile` | Get Profile | Yes |
| PUT | `/crm/auth/profile` | Update Profile | Yes |
| PUT | `/crm/auth/change-password` | Change Password | Yes |

### Customers
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/crm/customers` | List All Customers | Yes (Super Admin) |
| GET | `/crm/customers/:id` | Get Customer by ID | Yes (Super Admin) |

## 🔧 Features

### Role-Based Access Control
- **Super Admin:** Full access to all endpoints
- **Admin:** Limited access (future implementation)
- **Customer:** No access to CRM endpoints

### User Management
- Enhanced User model with permissions
- Account locking after failed attempts
- Last login tracking
- Profile image support

### Customer Management
- Pagination support
- Search functionality
- Filtering by role and status
- Detailed customer information

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Account locking mechanism
- Role-based permissions
- CORS protection
- Input validation

## 🔄 Pagination

Customer list supports pagination:
```
GET /crm/customers?page=1&limit=10&search=john&role=customer&isActive=true
```

### Pagination Parameters
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search by name or email
- `role`: Filter by user role
- `isActive`: Filter by account status

## 🚨 Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 423 | Account Locked |
| 500 | Internal Server Error |

## 🔗 Related Projects

- **Admin Panel Frontend:** http://localhost:3001
- **E-commerce Frontend:** http://localhost:3000
- **E-commerce Backend:** http://localhost:5000

## 📝 Development

### Project Structure
```
crm-api/
├── config/
│   ├── config.js      # Configuration settings
│   ├── db.js          # Database connection
│   └── swagger.js     # Swagger documentation
├── controllers/
│   └── SuperAdminController.js
├── middleware/
│   ├── admin.js       # Admin authentication
│   └── superAdmin.js  # Super admin authentication
├── models/
│   ├── User.js        # Enhanced user model
│   └── Role.js        # Role management
├── routes/
│   └── crm/
│       ├── auth.js    # Authentication routes
│       └── customers.js # Customer management
├── server.js          # Main server file
├── seed.js           # Database seeder
└── package.json
```

### Adding New Endpoints
1. Create controller method
2. Add route with Swagger documentation
3. Update this README
4. Test with Swagger UI

## 🤝 Contributing

1. Follow the existing code structure
2. Add Swagger documentation for new endpoints
3. Include proper error handling
4. Test with the provided credentials

## 📞 Support

For API support or questions:
- Check the Swagger documentation first
- Review error messages in responses
- Ensure proper authentication headers
- Verify database connection

---

**API Documentation URL:** http://localhost:5001/api-docs 