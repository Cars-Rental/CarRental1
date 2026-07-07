# 🚗 Rento - Car Rental & Marketplace Platform

Rento is a full-stack car rental and marketplace platform that connects customers, car traders, and administrators through a modern and secure digital experience.

The platform allows users to rent cars, buy cars, manage bookings, communicate with traders, and manage operations through role-based dashboards.

---

## ✨ Features

### 👤 Customer

- Secure Authentication & Authorization
- Email Verification using OTP
- Browse Rental Cars
- Browse Cars For Sale
- Advanced Search & Filtering
- Car Booking System
- Car Purchase Orders
- Wishlist Management
- Reviews & Ratings
- Profile Management
- Real-time Chat
- Notifications

---

### 🚘 Trader Dashboard

- Dashboard Overview & Analytics
- Rental Cars Management
- Cars For Sale Management
- Booking Management
- Orders Management
- Customers Management
- Reviews
- Earnings Tracking
- Messages

---

### 🛡 Admin Dashboard

- Platform Analytics
- Users Management
- Traders Management
- Cars Management
- Bookings Monitoring
- Orders Monitoring
- Reviews & Reports Management
- Verification Requests
- Payments Overview
- Platform Settings

---

## 🛠 Tech Stack

### Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Query
- Redux Toolkit
- React Hook Form
- Zod
- next-intl
- Framer Motion

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Passport.js
- Joi
- Socket.IO
- Cloudinary
- Multer
- Nodemailer
- Paymob
- Docker

---

## 📂 Project Structure

```text
CarRental1/

├── frontend/
│
│   └── src/
│       ├── app/
│       ├── components/
│       ├── features/
│       ├── services/
│       ├── store/
│       ├── hooks/
│       └── utils/
│
│
├── BackEnd/
│
│   └── src/
│       ├── modules/
│       ├── middleware/
│       ├── DB/
│       ├── services/
│       ├── sockets/
│       └── utils/
│
└── README.md
```

---

# Frontend Architecture

The frontend follows Feature-Based Architecture:

```text
features/

feature-name/
├── api/
├── components/
├── hooks/
├── schemas/
├── store/
├── types/
└── utils/
```

---

## 🚀 Getting Started

Clone repository:

```bash
git clone https://github.com/Cars-Rental/CarRental1.git
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:3001
```

---

## Backend Setup

```bash
cd BackEnd

npm install

npm run dev
```

Backend runs on:

```text
http://localhost:3000
```

---

## Environment Variables

### Frontend

Create:

```text
frontend/.env.local
```

Example:

```env
NEXT_PUBLIC_API_URL=
```

---

### Backend

Create:

```text
BackEnd/.env
```

Example:

```env
PORT=
DB_URI=
JWT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

EMAIL=
EMAIL_PASSWORD=

PAYMOB_API_KEY=
```

---

## 🔐 Security

- JWT Authentication
- Refresh Token Flow
- Password Hashing
- Role-Based Authorization
- API Validation
- Protected Routes
- Rate Limiting
- Secure Headers

---

## 🌍 Internationalization

Supported languages:

- English 🇺🇸
- Arabic 🇪🇬

Features:

- RTL / LTR support
- Localized validation messages

---

## 🎨 UI Features

- Fully Responsive Design
- Dark / Light Mode
- Reusable Components
- Modern Dashboard Layouts
- Loading States
- Error Handling

---

## 👥 Team

- Mohamed Ayman — Frontend Developer
- Bahaa Medhat - Frontend Developer
- Abdelrahman Essam - Backend Developer
- Abdelrahman EL-RAYSE - Backend Developer
- Youssef Yehia - Backend Developer

---

## 📸 Demo

Coming Soon 🚀


## 📄 License

This project was developed as part of the NTI Hire Ready Program.