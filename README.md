
# Lost and Found API

A RESTful API for managing lost and found items. This backend service allows users to report lost items, register found items, and search through the database to help reunite people with their belongings.

## 🌐 Live Demo

**Live URL:** [here](https://lost-found-api-o9gy.onrender.com)<br>
**GitHub Repository:** [lost_found_api](https://github.com/shashix07/lost_found_api)<br>
**Download Postman File**[Download](https://github.com/shashiX07/lost_found_api/releases/download/postman/backend.json)<br>
**Full Stack Application Link**[Visit Here](https://lost-found-app07.vercel.app/)<br>

## 📋 Features

- **User Authentication & Authorization**
  - User registration and login
  - Admin authentication
  - JWT-based authentication
  - Role-based access control

- **Item Management**
  - Add new lost/found items
  - View all items with filtering options
  - Get specific item details
  - Update item information (owner/admin only)
  - Delete items (admin only)

- **Search & Filter**
  - Filter by status (Lost/Found)
  - Filter by category
  - Filter by location

- **Security Features**
  - Rate limiting (10 requests per minute per IP)
  - Password hashing with bcrypt
  - JWT token expiration

## 🛠️ Technology Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcrypt
- **Rate Limiting:** express-rate-limit
- **Testing:** Jest, Supertest
- **Development:** Nodemon

## 📁 Project Structure

```
├── controllers/
│   ├── auth.js          # Authentication controllers
│   └── items.js         # Item management controllers
├── database/
│   └── config.js        # Database configuration
├── middlewares/
│   ├── requireAdmin.js  # Admin authorization middleware
│   ├── requireAuth.js   # Authentication middleware
│   └── requireUserOrAdmin.js # User/Admin authorization middleware
├── routes/
│   ├── authRouter.js    # Authentication routes
│   └── itemRouter.js    # Item management routes
├── tests/
│   └── itemApi.test.js  # API tests
├── utils/
│   └── jwt.js           # JWT utilities
├── server.js            # Main server file
├── package.json         # Dependencies and scripts
└── env.example          # Environment variables template
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or higher)
- PostgreSQL database
- Environment variables configured

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shashix07/lost_found_api
   cd lost-and-found-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Configure your `.env` file with:
   ```env
   DATABASE_URL=postgresql://<user>:<pass>@<host>:<port>/<db_name>
   ADMIN_MAIL=admin@example.com
   ADMIN_PASS=your_admin_password
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Set up the database**
   Create the required tables in your PostgreSQL database:
   ```sql
   -- Users table
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     email VARCHAR(255) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   
   -- Items table
   CREATE TABLE items (
     id SERIAL PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     category VARCHAR(100) NOT NULL,
     description TEXT NOT NULL,
     status VARCHAR(50) NOT NULL,
     location VARCHAR(255) NOT NULL,
     date DATE NOT NULL,
     contact_info VARCHAR(255) NOT NULL,
     image_url TEXT,
     user_id INTEGER REFERENCES users(id),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

5. **Start the server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

The server will start on port 3000 (or the port specified in your environment).

## 📚 API Documentation

### Authentication Endpoints

#### Admin Login
```http
POST /auth/admin
Content-Type: application/json

{
  "mail": "admin@example.com",
  "pass": "admin_password"
}
```

#### User Signup
```http
POST /auth/u/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### User Login
```http
POST /auth/u/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Item Management Endpoints

#### Get All Items
```http
GET /items
# Optional query parameters:
GET /items?status=Lost&category=phone&location=Central Park
```

#### Get Item by ID
```http
GET /items/:id
```

#### Add New Item (Authenticated)
```http
POST /items
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Lost Phone",
  "category": "electronics",
  "description": "Black iPhone 12 Pro",
  "status": "Lost",
  "location": "Central Park",
  "date": "2025-01-20",
  "contact_info": "john@example.com"
}
```

#### Update Item (Owner/Admin)
```http
PUT /items/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Found Phone",
  "category": "electronics",
  "description": "Black iPhone 12 Pro - Found!",
  "status": "Found",
  "location": "Central Park",
  "date": "2025-01-21",
  "contact_info": "john@example.com"
}
```

#### Delete Item (Admin Only)
```http
DELETE /items/:id
Authorization: Bearer <jwt_token>
```

## 🧪 Testing

Run the test suite:
```bash
npm test
```

The tests cover:
- Authentication flows
- Item CRUD operations
- Authorization checks
- Error handling

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `ADMIN_MAIL` | Admin email for admin login | Yes |
| `ADMIN_PASS` | Admin password for admin login | Yes |
| `JWT_SECRET` | Secret key for JWT signing | Yes |
| `PORT` | Server port (default: 3000) | No |

### Rate Limiting

The API implements rate limiting:
- **Limit:** 10 requests per minute per IP
- **Window:** 1 minute
- **Response:** 429 status code when exceeded

## 🆘 Support

If you encounter any issues or have questions:

1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Contact the maintainers

## 📊 API Response Examples

### Successful Item Creation
```json
{
  "message": "Item added successfully",
  "item": {
    "id": 1,
    "title": "Lost Phone",
    "category": "electronics",
    "status": "Lost",
    "created_at": "2025-01-20T10:30:00Z"
  }
}
```

### Error Response
```json
{
  "message": "All fields are required"
}
```

---

Made with ❤️ by shashi
