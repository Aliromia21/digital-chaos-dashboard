# Digital Chaos Index — Dashboard

A modern, responsive **React dashboard** for visualizing and managing your personal **Digital Chaos Index**.  
The dashboard consumes a production-grade backend API to help users track daily digital clutter (tabs, files, emails, apps, etc.) and transform it into actionable insights.

---

## Related Repository (Backend API)

**Digital Chaos Index API**  
https://github.com/Aliromia21/digital-chaos-index

This project is part of a **two-repository architecture**:
- **Backend:** Node.js / Express API (JWT, MongoDB, Swagger, Tests, CI)
- **Frontend:** React Dashboard (Tailwind CSS, Charts, Protected Routes)

---

## Features

- **Authentication & Protected Routes**
- Login / Register
- JWT-based session handling
- **Dashboard Overview**
- Today’s Chaos Score
- Weekly Chaos Trend (charts)
- Worst / Best / Average day statistics
- **Snapshots Management (CRUD)**
- Create daily snapshots
- Edit snapshot (same day restriction enforced)
- Delete snapshots with confirmation modal
- **Business Rules**
- Only **one snapshot per day per user**
- Users can only access **their own data**
- **User Feedback**
- Toast notifications for success / errors
- **Clean UI**
- Tailwind CSS v3
- Responsive layout
- Skeleton loaders
- Modal portals

---

## 🧩 Architecture Overview : 
 ```bash
Frontend (this repo)
│
│── React + Vite
│── Tailwind CSS
│── Recharts
│── React Router
│── JWT Auth Context
│
└── communicates via REST API
↓
Backend API (separate repo)
│── Node.js / Express
│── MongoDB / Mongoose
│── JWT Authentication
│── Swagger Docs
│── Jest + CI

```

---

## 🛠️ Tech Stack

**Frontend**
- React 18
- Vite
- Tailwind CSS v3
- Recharts
- Framer Motion
- React Router
- Axios
- react-hot-toast

**Backend (external)**
- Node.js / Express
- MongoDB + Mongoose
- JWT Authentication
- Swagger (OpenAPI 3.0)
- Jest + Supertest
- GitHub Actions (CI)

---

## ⚙️ Local Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Aliromia21/digital-chaos-dashboard.git
cd digital-chaos-dashboard
```
### 2️⃣ Install dependencies
```bash
npm install
```
### 3️⃣ Environment variables
Create a .env file in the project root:
```bash
VITE_API_BASE_URL=http://localhost:5000/api
```
### 4️⃣ Run the project
```bash
npm run dev
```
Dashboard will be available at: 
```bash
http://localhost:5173
```
## Authentication Flow

JWT token is stored in localStorage

Axios interceptor automatically attaches:
```bash
Authorization: Bearer <token>
```
Unauthorized users are redirected to /login

Status :

Core dashboard features implemented

CRUD snapshots logic complete

User isolation & business rules enforced

Ongoing UI & data-visualization improvements

Planned Enhancements :

Additional charts (distribution, comparisons)

Snapshot creation modal UX improvements

Deployment (Vercel / Netlify)

Full SaaS flow integration with backend roadmap

License :

MIT License © Ali Romia

Author :
Ali Romia
Software Engineer

GitHub: https://github.com/Aliromia21

LinkedIn: https://www.linkedin.com/in/aliromia/

This dashboard is actively developed and serves as the frontend layer for the Digital Chaos Index SaaS project.


