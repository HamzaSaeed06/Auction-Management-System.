# Auction OS — Cricket Auction Platform

A powerful, real-time cricket auction management system. This platform is designed for tournament organizers to manage player registrations, teams, and live bidding wars with sub-second synchronization.

---

## 🚀 Key Features

*   **Real-Time Bidding**: Sub-second bid updates powered by WebSockets (Socket.io).
*   **Role Management**:
    *   **Super Admin**: Manage countries, categories, and auction seasons.
    *   **Admin**: Manage teams, players, and control the live auction flow.
    *   **Franchise**: A dedicated "War Room" for live bidding and squad management.
*   **Dynamic System**: No hardcoded data; everything is managed via dashboards.
*   **Responsive UI**: Optimized for desktops, tablets, and mobile devices.

---

## 🛠️ Tech Stack

*   **Frontend**: Next.js (App Router), Vanilla CSS, Framer Motion.
*   **Backend**: Node.js, Express, Socket.io.
*   **Database**: MySQL (with Stored Procedures for high-speed bidding logic).
*   **Auth**: JWT (JSON Web Tokens).

---

## 📦 Installation & Setup

### 1. Database Setup
1. Create a MySQL database (e.g., `Auction_DB`).
2. Run the SQL script found in `/database/schema.sql` to create tables and procedures.

### 2. Backend Setup
1. Go to the `backend` folder.
2. Run `npm install`.
3. Create a `.env` file and add your database details:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=Auction_DB
   JWT_SECRET=your_secret_key
   PORT=8000
   ```
4. Start the server: `npm run dev`.

### 3. Frontend Setup
1. Go to the `frontend` folder.
2. Run `npm install`.
3. Start the app: `npm run dev`.
4. Open `http://localhost:3000`.

---

## 🔐 System Roles

The platform supports three distinct access levels:
*   **Super Admin**: Global configuration, countries, categories, and auction seasons.
*   **Admin**: Team management, player registration, and live auction control.
*   **Franchise**: Live bidding "War Room," squad analysis, and team profile management.

*Note: Credentials should be managed through the respective dashboards or direct database entry.*

---

## 📂 Project Structure

```text
├── backend/            # Express API & Socket server
│   ├── routes/         # API Endpoints
│   ├── uploads/        # Image storage
│   └── server.js       # Main entry point
├── frontend/           # Next.js Application
│   ├── app/            # Pages & Layouts
│   ├── components/     # UI Components
│   └── lib/            # API & Socket helpers
└── database/           # SQL Schema & Procedures
```

---

## 🌐 Deployment Guidelines

### Backend (Railway/Render)
*   Set **Root Directory** to `backend`.
*   Add all Environment Variables from your `.env` to the dashboard.

### Frontend (Vercel)
*   Set **Root Directory** to `frontend`.
*   Add these Environment Variables:
    *   `NEXT_PUBLIC_API_URL`: Your live backend URL.

---
Developed as a Database & Web Development Project.
