# Car Rental System - Backend

The backend of the Car Rental System is a RESTful API built with **Node.js**, **Express.js**, and **MongoDB**. It provides secure authentication, role-based authorization, car management, booking, payment integration, reviews, notifications, and administrative features for the car rental platform.

## Features

- User authentication (JWT & OAuth)
- Role-based access control (Customer, Owner, Admin)
- Car listing and management
- Booking and reservation system
- Payment integration
- Reviews and ratings
- Notifications
- Image upload with Cloudinary
- Email services
- Admin dashboard APIs
- Secure REST API
- Error handling and request validation

## Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- Passport.js (Google OAuth)
- Cloudinary
- Multer
- Nodemailer
- Stripe
- Socket.IO
- Docker

## Project Structure

```text
BackEnd/
├── src/
│   ├── modules/
│   ├── middleware/
│   ├── database/
│   ├── services/
│   ├── utils/
│   ├── routes/
│   └── app.js
├── uploads/
├── .env
├── package.json
└── index.js
```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Cars-Rental/CarRental1.git
```

### 2. Navigate to the backend

```bash
cd CarRental1/BackEnd
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file and add the required environment variables.

Example:

```env
PORT=3000
DB_URI=your_mongodb_connection
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
STRIPE_SECRET_KEY=
EMAIL=
EMAIL_PASSWORD=
```

### 5. Run the development server

```bash
npm run dev
```

Or start the production server:

```bash
npm start
```

## API

The backend exposes RESTful APIs for:

- Authentication
- Users
- Cars
- Bookings
- Payments
- Reviews
- Notifications
- Admin operations

## Security

- JWT Authentication
- Password hashing with bcrypt
- Role-based authorization
- Request validation
- Secure environment variables
- CORS protection

