# Auction OS — Professional Cricket Auction Platform

A high-fidelity, real-time cricket auction management system built for scalability and performance. This platform allows administrators to manage every aspect of a tournament auction, from player categories to live bidding wars.

## 🚀 Key Features

- **Real-Time Bidding Engine**: Powered by Socket.io for sub-second synchronization between franchises and the auctioneer.
- **Role-Based Access Control**:
  - **Super Admin**: Governance of countries, player categories, and auction seasons.
  - **Admin**: Registry management for teams and players, auction pool building, and live control.
  - **Franchise**: Interactive "War Room" for live bidding, squad tracking, and budget management.
- **Dynamic Data Driven**: Zero hardcoded data. Every team, player, and rule is managed through the dashboard.
- **Mobile First Design**: Fully responsive UI optimized for tablets and mobile devices.
- **Stored Procedures & Triggers**: Advanced database logic for data integrity and high-speed bidding operations.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ (App Router), Tailwind CSS, Framer Motion, Phosphor Icons, Lenis Smooth Scroll.
- **Backend**: Node.js, Express, Socket.io.
- **Database**: MySQL 8.0 (Relational schema with Procedures & Triggers).
- **Authentication**: JWT (JSON Web Tokens) with secure cookie/header handling.

---

## 📦 Installation & Setup

### 1. Database Configuration
1. Create a MySQL database (e.g., `Auction_DB`).
2. Import the complete schema and seed data from `/database/schema.sql`.
3. This will create the necessary tables, stored procedures, and the initial admin accounts.

### 2. Backend Setup
1. Navigate to the `backend` directory.
2. Run `npm install` to install dependencies.
3. Configure the `.env` file with your database credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=Auction_DB
   JWT_SECRET=your_secret_key
   PORT=5000
   ```
4. Start the server: `npm run dev`.

### 3. Frontend Setup
1. Navigate to the `frontend` directory.
2. Run `npm install`.
3. Start the development server: `npm run dev`.
4. Access the application at `http://localhost:3000`.

---

## 🔐 Initial Credentials

| Username | Password | Role |
|---|---|---|
| `superadmin` | `admin123` | Super Admin |
| `admin` | `admin123` | Admin |
| *(franchises)* | *Set by Admin during team creation* | Franchise |

---

## 📂 Project Architecture

```text
├── backend/
│   ├── middleware/     # Auth & Role guards
│   ├── routes/         # Feature-specific API endpoints
│   ├── uploads/        # Player/Team media storage
│   ├── server.js       # Entry point (Express + Socket.io)
│   └── state.js        # In-memory auction timer state
├── frontend/
│   ├── app/            # Next.js App Router (Layouts & Pages)
│   ├── components/     # Atomic UI Design System
│   └── lib/            # API clients and utility functions
└── database/
    └── schema.sql      # Single source of truth for DB
```

---

## 🌐 Deployment (Production)

To run this project live, follow this strategy:

### 1. Backend (Persistent Server)
Use **Railway.app** or **Render.com** for the backend.
- **Why?** Vercel does not support persistent WebSockets (Socket.io) well.
- Connect your GitHub repo and set the "Root Directory" to `backend`.
- Add environment variables (`DB_HOST`, `DB_USER`, etc.) in the dashboard.

### 2. Frontend (Static/Serverless)
Use **Vercel** for the frontend.
- Connect your GitHub repo and set the "Root Directory" to `frontend`.
- **CRITICAL**: Add these Environment Variables in Vercel:
  - `API_URL`: Your Backend URL (e.g., `https://your-backend.railway.app`)
  - `NEXT_PUBLIC_API_URL`: Same as above (Required for Socket.io)

### 3. Database
- Use the MySQL instance on **Railway** (already configured in `schema.sql`).

---
Developed as a professional Database & Web Project.
