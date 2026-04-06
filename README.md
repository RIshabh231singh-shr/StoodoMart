# StoodoMart - The Campus-Exclusive Marketplace

StoodoMart is a professional, community-focused platform designed for university students to buy, sell, and exchange items within their campus easily and securely. By providing a niche marketplace, StoodoMart eliminates the need for shipping and waiting, fostering a peer-to-peer sharing economy.

---

## 🚀 Core Features

- 🔐 **Secure Authentication**: Robust user registration and login system with JWT and cookie-based authentication.
- 📦 **Campus Listings**: Effortlessly list products for sale, including detailed descriptions, images, and category tagging.
- 📸 **Cloud-Powered Hosting**: High-quality image storage using **Cloudinary** and **Multer** for seamless product uploads.
- 🛠️ **Multi-Role User Control**:
    - **Users**: Browse and purchase from other students.
    - **Admins/Sellers**: Manage listings and track orders.
    - **SuperAdmins**: Comprehensive control over the entire user database and platform health.
- 📂 **Filtering & Search**: Rapidly find items with real-time text-based searching and category filtering (Electronics, Instruments, Stationery, etc.).
- 🛍️ **Order Management**: Integrated checkout system to track purchases and seller requests.
- 🎨 **Modern UI**: Professionally designed with **Tailwind CSS 4.0**, vibrant gradients, and glassmorphic aesthetics.

---

## 🛠️ Technical Stack

### **Frontend**
- **Library**: React 19
- **Build Tool**: Vite 7
- **State Management**: Redux Toolkit
- **Navigation**: React Router (v7)
- **Styling**: Tailwind CSS 4.0
- **Icons**: Lucide Icons
- **Forms**: React Hook Form with Zod validation

### **Backend**
- **Runtime**: Node.js
- **Server**: Express (v5.2)
- **Database**: MongoDB with Mongoose ODM
- **Cache**: Redis
- **Storage**: Cloudinary Cloud-based Hosting
- **Security**: JWT, Bcrypt, Validator

---

## 📂 Project Structure

```text
StoodoMart/
├── Frontend/      # React Vite application with Redux and Tailwind
├── Backened/      # Express Node.js application (API, Database, Middleware)
└── README.md      # Project overview and documentation
```

---

## ⚙️ Setup & Installation

### 1. Prerequisite
- **Node.js** (v18+)
- **MongoDB** instance (Atlas or local)
- **Redis** server
- **Cloudinary Account** (for image hosting)

### 2. Backend Setup
1. Open the `/Backened` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with these keys:
   ```env
   PORT=PORT_NUMBER
   MONGO_URI=YOUR_MONGO_DB_CONNECTION_STRING
   JWT_SECRET=YOUR_SECRET_KEY
   CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME
   CLOUDINARY_API_KEY=YOUR_API_KEY
   CLOUDINARY_API_SECRET=YOUR_API_SECRET
   REDIS_URL=YOUR_REDIS_URL
   ```
4. Start the server (Dev Mode):
   ```bash
   npm run start
   ```

### 3. Frontend Setup
1. Open the `/Frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the application at the URL provided in the console (usually `http://localhost:5173`).

---

## 📈 Future Enhancements
- [ ] In-app direct messaging for buyers and sellers.
- [ ] Real-time price tracking and negotiation.
- [ ] Campus event integration and alerts.
- [ ] Expanded AI-based product recommendations.

---

## ⚖️ License
This project is licensed under the ISC License.
