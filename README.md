# 🍔 Swadify

Swadify is a full-featured, real-time food delivery and restaurant management system. The platform bridges the gap between **Users**, **Restaurant Owners**, and **Delivery Partners** in real time, featuring interactive map tracking, secure payments, and a modern, responsive user interface.

---

## 🚀 Key Features

### 👤 User Features
- **Interactive Ordering**: Search and filter delicious food items by query and current city.
- **Cart System**: Easily manage items, adjust quantities, and view real-time totals.
- **Secure Payment Gateway**: Integration with Razorpay checkout for secure, seamless online payments.
- **Real-Time Order Tracking**: Live tracking of the delivery partner's location on an interactive map.
- **Secure Deliveries**: OTP-based order verification sent directly via email.

### 🏪 Restaurant Owner Features
- **Shop Management**: Create and configure restaurant profiles including name, category, and address.
- **Menu Management**: Full CRUD operations on food items with image uploads (via Cloudinary), custom tags, and availability status.
- **Order Pipeline**: Accept and manage order status (e.g., preparing, ready, out for delivery) through a central dashboard.

### 🚴 Delivery Partner Features
- **Interactive Tracking**: Share live location updates with the user via WebSockets.
- **OTP Verification**: Enter the delivery confirmation OTP provided by the user to securely complete the delivery.

---

## 🛠️ Tech Stack

- **Frontend**:
  - React 19 (Vite)
  - Redux Toolkit (State Management)
  - Tailwind CSS (Styling)
  - React Leaflet (Map Integration)
  - Socket.io-client (Real-time tracking)
- **Backend**:
  - Node.js & Express.js
  - MongoDB & Mongoose (Database & ORM)
  - Socket.io (WebSocket server)
  - Nodemailer (Email verification & OTP delivery)
  - Razorpay SDK (Payments)
  - Cloudinary (Image storage)

---

## 📁 Folder Structure

```
Swadify/
├── backend/                  # Express.js Server
│   ├── config/               # Database and server config
│   ├── controllers/          # Business logic handlers
│   ├── middlewares/          # Auth & file upload middlewares
│   ├── models/               # MongoDB models (User, Item, Order, Shop)
│   ├── routes/               # API endpoints
│   ├── utils/                # Helper utilities (Nodemailer, Cloudinary)
│   ├── index.js              # Server entry point
│   └── socket.js             # WebSocket connection handler
│
└── frontend/                 # React + Vite Frontend
    ├── public/               # Static assets
    ├── src/
    │   ├── assets/           # Dynamic images & styles
    │   ├── components/       # Reusable React components (Nav, Dashboards, Cards)
    │   ├── hooks/            # Custom hooks
    │   ├── pages/            # View pages (Checkout, Shop, Cart, TrackOrder)
    │   ├── redux/            # Redux store and slices
    │   ├── App.jsx           # Main router config
    │   └── main.jsx          # Frontend entry point
```

---

## ⚙️ Environment Variables

To run the application locally, you will need to set up `.env` files in both the `backend/` and `frontend/` directories.

### Backend Environment Setup (`backend/.env`)
Create a `.env` file inside the `backend/` directory with the following variables:
```env
PORT=8000
MONGODB_URL=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-signing-key>
EMAIL=<your-sender-gmail-address>
PASS=<your-gmail-app-password>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
RAZORPAY_KEY_ID=<your-razorpay-key-id>
RAZORPAY_KEY_SECRET=<your-razorpay-key-secret>
```

### Frontend Environment Setup (`frontend/.env`)
Create a `.env` file inside the `frontend/` directory with the following variables:
```env
VITE_FIREBASE_API_KEY=<your-firebase-api-key>
VITE_GEOAPIKEY=<your-geoapify-key>
```

---

## 🏃 Getting Started

Follow these steps to run Swadify locally:

### 1. Clone the repository
```bash
git clone <repository-url>
cd Swadify
```

### 2. Run the Backend Server
```bash
cd backend
npm install
npm run dev
```
The server will start listening at `http://localhost:8000`.

### 3. Run the Frontend App
Open a new terminal session, then run:
```bash
cd frontend
npm install
npm run dev
```
The React development server will start at `http://localhost:5173`.

---

## 📡 API Reference

### Auth Endpoints (`/api/auth`)
- `POST /signup` - Register a new user (`user`, `owner`, or `deliveryBoy`)
- `POST /signin` - Authenticate user & receive cookie-based JWT
- `GET /signout` - Clear session cookie
- `POST /forgot-password` - Request OTP for password reset
- `POST /reset-password` - Set new password using OTP

### Shop Endpoints (`/api/shop`)
- `POST /create-edit` - Create or edit shop details (Owners only)
- `GET /get-my` - Retrieve own shop details (Owners only)
- `GET /city/:city` - Retrieve all shops in a specific city

### Item Endpoints (`/api/item`)
- `POST /add-item` - Add a new food item (Owners only)
- `PUT /edit-item/:itemId` - Update item details (Owners only)
- `DELETE /delete-item/:itemId` - Remove item (Owners only)
- `GET /search-items` - Search/filter items by query and city

### Order Endpoints (`/api/order`)
- `POST /place-order` - Create order and obtain Razorpay configuration
- `POST /verify-payment` - Verify payment signature
- `GET /my-orders` - Fetch all orders related to the logged-in user
- `PUT /update-status/:orderId` - Update delivery state
