<div align="center">

<img src="https://img.shields.io/badge/Sportify-TN-1a73e8?style=for-the-badge&logo=lightning&logoColor=white" alt="Sportify TN" height="60"/>

# ⚽ Sportify TN

**All-in-one Tunisian sports platform — news, matches, videos, articles, and stars**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb)](https://mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker)](https://docker.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens)](https://jwt.io/)
[![Swagger](https://img.shields.io/badge/API-Swagger-85EA2D?style=flat-square&logo=swagger)](http://localhost:5000/api-docs)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Quick Start (Docker)](#-quick-start-docker)
- [Local Setup](#-local-setup)
- [Environment Variables](#-environment-variables)
- [Deployment (Vercel)](#-deployment-vercel)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)

---

## 🎯 Overview

**Sportify TN** is a full‑stack web app that centralizes Tunisian and international sports content. It offers:

- A **public interface** to browse news, matches, videos, articles, and star profiles
- A **complete admin back‑office** for CRUD management of all content
- **Secure authentication** with roles (user / admin)

---

## ✨ Features

### 🌐 Public Interface
| Feature | Description |
|---|---|
| 📰 News | List and details of news articles with filters |
| ⚽ Matches | Schedule, scores, and detailed match pages |
| 🎬 Videos | Video gallery with playback and details |
| ✍️ Articles | Editorial articles and analysis |
| ⭐ Stars | Player and personality profiles |
| 💬 Feedback | User feedback submission |

### 🔐 Authentication
- Secure sign up / login with JWT
- Role-based access: `user` and `admin`

### 🛠️ Admin Panel
| Module | Capabilities |
|---|---|
| 📊 Dashboard | KPIs, stats, and overview widgets |
| 📰 News | Full CRUD + image upload |
| ⚽ Matches | Full CRUD + score management |
| 🎬 Videos | Full CRUD + link management |
| ✍️ Articles | Full CRUD + content editor |
| ⭐ Stars | Full CRUD + profile photos |
| 💬 Feedback | Review and moderation |
| 👥 Users | Role and account management |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** — SPA UI
- **React Router** — routing
- **Axios** — API client
- **ApexCharts** — charts (admin dashboard)

### Backend
- **Node.js + Express** — REST API server
- **MongoDB + Mongoose** — NoSQL database + ODM
- **JWT** — stateless authentication
- **Multer** — file uploads
- **Swagger UI** — interactive API docs

### Infrastructure
- **Docker + Docker Compose** — service orchestration
- **Nginx** — static hosting for the frontend

---

## 🏗️ Architecture

```
sportify-tn/
├── frontend/               # React app
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # App pages
│   │   ├── context/        # React contexts (auth, etc.)
│   │   └── utils/          # Helpers and utilities
│   └── .env.production
│
├── backend/                # Express REST API
│   ├── api/                # Serverless entry (Vercel)
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── middleware/         # Auth, uploads, validation
│   ├── uploads/            # Uploaded media (local)
│   ├── utils/              # Utilities
│   ├── server.js
│   └── .env.production
│
├── docker-compose.yml      # Service orchestration
└── README.md
```

**Docker Services**
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │   Backend   │    │   MongoDB   │
│  React:3000 │◄──►│ Express:5000│◄──►│   :27017    │
│   (Nginx)   │    │  + Multer   │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
```

---

## 🚀 Quick Start (Docker)

> **Prerequisites:** Docker and Docker Compose installed

### 1. Clone the repository

```bash
git clone https://github.com/your-org/sportify-tn.git
cd sportify-tn
```

### 2. Configure environment files

```bash
# Create local env files based on production examples
cp backend/.env.production backend/.env
cp frontend/.env.production frontend/.env
# Edit the files with your local values
```

### 3. Start all services

```bash
docker compose up --build
```

### 4. Access services

| Service | URL |
|---|---|
| 🌐 Frontend | http://localhost:3000 |
| ⚙️ Backend API | http://localhost:5000 |
| 📖 Swagger Docs | http://localhost:5000/api-docs |

### 5. Seed the database (optional)

```bash
docker compose exec backend npm run seed
```

---

## 💻 Local Setup

### Prerequisites

- Node.js >= 16
- MongoDB >= 5.0 (local or Atlas)
- npm or yarn

### Backend

```bash
cd backend
npm install
cp .env.production .env
npm run dev   # runs on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
cp .env.production .env
npm start     # runs on http://localhost:3000
```

---

## 🔧 Environment Variables

### Backend — `backend/.env`

```env
# Database
MONGO_URI=mongodb://localhost:27017/sportify-tn

# Authentication
JWT_SECRET=your_jwt_secret

# Server
PORT=5000
NODE_ENV=development

# Swagger
API_BASE_URL=http://localhost:5000

# Uploads
UPLOADS_DIR=./uploads
```

### Frontend — `frontend/.env`

```env
# Axios base URL
REACT_APP_API_BASE_URL=http://localhost:5000

# Used to resolve image/media URLs
REACT_APP_API_URL=http://localhost:5000
```

---

## 🚀 Deployment (Vercel)

This project can be deployed as two separate apps on Vercel:

- **Backend** (Node/Express) from the `backend/` folder
- **Frontend** (React) from the `frontend/` folder

### Backend (Vercel)

1. Create a new Vercel project from the `backend/` directory.
2. Set **Build & Output** defaults (Vercel will use `api/index.js`).
3. Add environment variables (Project Settings → Environment Variables):
   - `MONGO_URI`
   - `JWT_SECRET`
   - `API_BASE_URL` (set to your backend Vercel URL)
   - `UPLOADS_DIR` (recommended: `/tmp/uploads`)
   - `BLOB_READ_WRITE_TOKEN` (if using Vercel Blob)
4. Deploy.

The backend exposes Swagger at:

```
https://your-backend.vercel.app/api-docs
```

### Frontend (Vercel)

1. Create a new Vercel project from the `frontend/` directory.
2. Set the **Build Command** to `npm run build` and **Output** to `build`.
3. Add environment variables:
   - `REACT_APP_API_BASE_URL` (set to your backend Vercel URL)
   - `REACT_APP_API_URL` (same backend URL for media)
4. Deploy.

---

## 📖 API Documentation

Swagger UI is available at:

**➜ http://localhost:5000/api-docs**

### Main Endpoints

| Resource | Base URL | Auth Required |
|---|---|---|
| News | `/api/news` | Admin (write) |
| Matches | `/api/matches` | Admin (write) |
| Videos | `/api/videos` | Admin (write) |
| Articles | `/api/articles` | Admin (write) |
| Stars | `/api/stars` | Admin (write) |
| Feedback | `/api/feedback` | Admin (read) |
| Auth | `/api/auth` | No |
| Admin | `/api/admin` | Admin |

---

## 📸 Screenshots

### 🌐 Public Interface

<table>
  <tr>
    <td align="center" width="33%">
      <strong>🏠 Home</strong><br/>
      <sub>Overview with key sections (news, matches, videos)</sub><br/><br/>
      <img src="screenshots/home.png" alt="Home" width="100%" style="border-radius:8px;border:1px solid #e0e0e0"/>
    </td>
    <td align="center" width="33%">
      <strong>📰 News</strong><br/>
      <sub>News list with cards and filters</sub><br/><br/>
      <img src="screenshots/news.png" alt="News" width="100%" style="border-radius:8px;border:1px solid #e0e0e0"/>
    </td>
    <td align="center" width="33%">
      <strong>📄 News Detail</strong><br/>
      <sub>Full article with image, content, and metadata</sub><br/><br/>
      <img src="screenshots/news-details.png" alt="News detail" width="100%" style="border-radius:8px;border:1px solid #e0e0e0"/>
    </td>
  </tr>
  <tr>
    <td align="center" width="33%">
      <strong>⚽ Matches</strong><br/>
      <sub>Schedule and match list with scores</sub><br/><br/>
      <img src="screenshots/matches.png" alt="Matches" width="100%" style="border-radius:8px;border:1px solid #e0e0e0"/>
    </td>
    <td align="center" width="33%">
      <strong>🏟️ Match Detail</strong><br/>
      <sub>Full match sheet (teams, score, status)</sub><br/><br/>
      <img src="screenshots/match-detail.png" alt="Match detail" width="100%" style="border-radius:8px;border:1px solid #e0e0e0"/>
    </td>
    <td align="center" width="33%">
      <strong>🎬 Videos</strong><br/>
      <sub>Video gallery with previews</sub><br/><br/>
      <img src="screenshots/videos.png" alt="Videos" width="100%" style="border-radius:8px;border:1px solid #e0e0e0"/>
    </td>
  </tr>
  <tr>
    <td align="center" width="33%">
      <strong>▶️ Video Detail</strong><br/>
      <sub>Video player with title and description</sub><br/><br/>
      <img src="screenshots/video-detail.png" alt="Video detail" width="100%" style="border-radius:8px;border:1px solid #e0e0e0"/>
    </td>
    <td align="center" width="33%">
      <strong>⭐ Stars</strong><br/>
      <sub>List of players and public figures</sub><br/><br/>
      <img src="screenshots/stars.png" alt="Stars" width="100%" style="border-radius:8px;border:1px solid #e0e0e0"/>
    </td>
    <td align="center" width="33%">
      <strong>🏅 Star Detail</strong><br/>
      <sub>Profile with bio and stats</sub><br/><br/>
      <img src="screenshots/star-detail.png" alt="Star detail" width="100%" style="border-radius:8px;border:1px solid #e0e0e0"/>
    </td>
  </tr>
  <tr>
    <td align="center" width="33%">
      <strong>✍️ Articles</strong><br/>
      <sub>Editorial and analysis articles</sub><br/><br/>
      <img src="screenshots/articles.png" alt="Articles" width="100%" style="border-radius:8px;border:1px solid #e0e0e0"/>
      <img src="screenshots/article-details.png" alt="Articles" width="100%" style="border-radius:8px;border:1px solid #e0e0e0"/>
    </td>
    <td align="center" width="33%">
      <strong>🔐 Authentication</strong><br/>
      <sub>Login and registration screens</sub><br/><br/>
      <img src="screenshots/register.png" alt="Authentication" width="100%" style="border-radius:8px;border:1px solid #e0e0e0"/>
      <img src="screenshots/login.png" alt="Authentication" width="100%" style="border-radius:8px;border:1px solid #e0e0e0"/>
    </td>
    <td align="center" width="33%">
      <strong>💬 Feedback</strong><br/>
      <sub>User feedback submission form</sub><br/><br/>
      <img src="screenshots/feedback.png" alt="Feedback" width="100%" style="border-radius:8px;border:1px solid #e0e0e0"/>
    </td>
  </tr>
</table>

### 🛠️ Admin Panel

<table>
  <tr>
    <td align="center" width="50%">
      <strong>📊 Admin Dashboard</strong><br/>
      <sub>Overview with widgets and KPIs</sub><br/><br/>
      <img src="screenshots/admin-dashboard.png" alt="Admin dashboard" width="100%" style="border-radius:8px;border:1px solid #e0e0e0"/>
    </td>
    <td align="center" width="50%">
      <strong>📰 News Management</strong><br/>
      <sub>Full CRUD for news</sub><br/><br/>
      <img src="screenshots/admin-news.png" alt="Admin news" width="100%" style="border-radius:8px;border:1px solid #e0e0e0"/>
      <img src="screenshots/admin-news-edit.png" alt="Admin news" width="100%" style="border-radius:8px;border:1px solid #e0e0e0"/>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <strong>⚽ Matches Management</strong><br/>
      <sub>Full CRUD for matches</sub><br/><br/>
      <img src="screenshots/admin-matches.png" alt="Admin matches" width="100%" style="border-radius:8px;border:1px solid #e0e0e0"/>
    </td>
    <td align="center" width="50%">
      <strong>🎬 Videos Management</strong><br/>
      <sub>Full CRUD for videos</sub><br/><br/>
      <img src="screenshots/admin-videos.png" alt="Admin videos" width="100%" style="border-radius:8px;border:1px solid #e0e0e0"/>
      <img src="screenshots/admin-videos-edit.png" alt="Admin videos" width="100%" style="border-radius:8px;border:1px solid #e0e0e0"/>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <strong>⭐ Stars Management</strong><br/>
      <sub>Full CRUD for stars</sub><br/><br/>
      <img src="screenshots/admin-stars.png" alt="Admin stars" width="100%" style="border-radius:8px;border:1px solid #e0e0e0"/>
      <img src="screenshots/admin-stars-edit.png" alt="Admin stars" width="100%" style="border-radius:8px;border:1px solid #e0e0e0"/>
    </td>
    <td align="center" width="50%">
      <strong>✍️ Articles Management</strong><br/>
      <sub>Full CRUD for articles</sub><br/><br/>
      <img src="screenshots/admin-articles.png" alt="Admin articles" width="100%" style="border-radius:8px;border:1px solid #e0e0e0"/>
      <img src="screenshots/admin-articles-edit.png" alt="Admin articles" width="100%" style="border-radius:8px;border:1px solid #e0e0e0"/>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <strong>💬 Feedback Management</strong><br/>
      <sub>Review and moderation</sub><br/><br/>
      <img src="screenshots/admin-feedback.png" alt="Admin feedback" width="100%" style="border-radius:8px;border:1px solid #e0e0e0"/>
    </td>
    <td align="center" width="50%">
      <strong>💬 Admin Profil</strong><br/>
      <sub>.....</sub><br/><br/>
      <img src="screenshots/admin-profil.png" alt="Admin feedback" width="100%" style="border-radius:8px;border:1px solid #e0e0e0"/>
    </td>
    <td align="center" width="50%">
      <strong>👥 Users Management</strong><br/>
      <sub>User accounts and role management</sub><br/><br/>
      <img src="screenshots/admin-users.png" alt="Admin users" width="100%" style="border-radius:8px;border:1px solid #e0e0e0"/>
    </td>
  </tr>
</table>
