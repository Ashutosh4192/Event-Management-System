# Event Management System

A full-stack event management application built with React and Node.js/Express.

## Features

### Admin
- User management (view all registered users)
- Vendor management (view all registered vendors)
- Membership management (add/update memberships)

### Vendor
- Product management (add, update, delete products)
- Order management (view and update order status)
- View requested items from users

### User
- Browse vendors by category
- Browse and add products to cart
- Manage shopping cart
- Checkout and place orders
- Manage guest lists
- View order status

## Tech Stack

**Frontend:**
- React
- React Router
- Axios

**Backend:**
- Node.js
- Express
- MongoDB
- JWT Authentication
- Bcrypt for password hashing
- Multer for file uploads

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
BCRYPT_SALT_ROUNDS=10
ADMIN_USER_ID=admin
ADMIN_PASSWORD=admin123
CORS_ORIGIN=http://localhost:3000
```

4. Start the backend server:
```bash
npm start
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Default Admin Credentials

- **User ID:** admin
- **Password:** admin123

## Project Structure

```
event-management-system/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Authentication & authorization
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── uploads/         # Uploaded product images
│   ├── utils/           # Utility functions
│   └── server.js        # Entry point
├── frontend/
│   ├── public/          # Static files
│   └── src/
│       ├── pages/       # React components/pages
│       ├── services/    # API service functions
│       └── utils/       # Utility functions
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/vendor/login` - Vendor login
- `POST /api/auth/vendor/signup` - Vendor registration
- `POST /api/auth/user/login` - User login
- `POST /api/auth/user/signup` - User registration

### Admin
- `GET /api/admin/users/all` - Get all users
- `GET /api/admin/vendors/all` - Get all vendors
- `POST /api/admin/memberships` - Add membership
- `GET /api/admin/memberships/:number` - Get membership
- `PUT /api/admin/memberships/:number` - Update membership

### Vendor
- `GET /api/vendor/products` - Get vendor products
- `POST /api/vendor/products` - Add product
- `PUT /api/vendor/products/:id` - Update product
- `DELETE /api/vendor/products/:id` - Delete product
- `GET /api/vendor/orders` - Get vendor orders
- `PUT /api/vendor/orders/:id/status` - Update order status

### User
- `GET /api/user/vendors` - Get all vendors
- `GET /api/user/vendors/:id/products` - Get vendor products
- `POST /api/user/cart` - Add to cart
- `GET /api/user/cart` - Get cart
- `PUT /api/user/cart/:id` - Update cart item
- `DELETE /api/user/cart/:id` - Remove from cart
- `POST /api/user/checkout` - Checkout
- `GET /api/user/orders` - Get user orders
- `GET /api/user/guests` - Get guest list
- `POST /api/user/guests` - Add guest

## License

This project is open source and available under the MIT License.
