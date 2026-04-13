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

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin: 20px 0;">

<div style="background: #f8f9fa; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
  <div style="padding: 16px; border-bottom: 2px solid #1a73e8;">
    <h4 style="margin: 0; color: #1a73e8;">🏠 Home</h4>
    <p style="margin: 8px 0 0 0; font-size: 13px; color: #666;">Overview with key sections (news, matches, videos)</p>
  </div>
  <img src="screenshots/home.png" alt="Home" width="100%" style="display: block; aspect-ratio: 16/9; object-fit: cover;"/>
</div>

<div style="background: #f8f9fa; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
  <div style="padding: 16px; border-bottom: 2px solid #1a73e8;">
    <h4 style="margin: 0; color: #1a73e8;">📰 News</h4>
    <p style="margin: 8px 0 0 0; font-size: 13px; color: #666;">News list with cards and filters</p>
  </div>
  <img src="screenshots/news.png" alt="News" width="100%" style="display: block; aspect-ratio: 16/9; object-fit: cover;"/>
</div>

<div style="background: #f8f9fa; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
  <div style="padding: 16px; border-bottom: 2px solid #1a73e8;">
    <h4 style="margin: 0; color: #1a73e8;">📄 News Detail</h4>
    <p style="margin: 8px 0 0 0; font-size: 13px; color: #666;">Full article with image, content, and metadata</p>
  </div>
  <img src="screenshots/news-details.png" alt="News detail" width="100%" style="display: block; aspect-ratio: 16/9; object-fit: cover;"/>
</div>

<div style="background: #f8f9fa; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
  <div style="padding: 16px; border-bottom: 2px solid #1a73e8;">
    <h4 style="margin: 0; color: #1a73e8;">⚽ Matches</h4>
    <p style="margin: 8px 0 0 0; font-size: 13px; color: #666;">Schedule and match list with scores</p>
  </div>
  <img src="screenshots/matches.png" alt="Matches" width="100%" style="display: block; aspect-ratio: 16/9; object-fit: cover;"/>
</div>

<div style="background: #f8f9fa; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
  <div style="padding: 16px; border-bottom: 2px solid #1a73e8;">
    <h4 style="margin: 0; color: #1a73e8;">🏟️ Match Detail</h4>
    <p style="margin: 8px 0 0 0; font-size: 13px; color: #666;">Full match sheet (teams, score, status)</p>
  </div>
  <img src="screenshots/match-detail.png" alt="Match detail" width="100%" style="display: block; aspect-ratio: 16/9; object-fit: cover;"/>
</div>

<div style="background: #f8f9fa; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
  <div style="padding: 16px; border-bottom: 2px solid #1a73e8;">
    <h4 style="margin: 0; color: #1a73e8;">🎬 Videos</h4>
    <p style="margin: 8px 0 0 0; font-size: 13px; color: #666;">Video gallery with previews</p>
  </div>
  <img src="screenshots/videos.png" alt="Videos" width="100%" style="display: block; aspect-ratio: 16/9; object-fit: cover;"/>
</div>

<div style="background: #f8f9fa; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
  <div style="padding: 16px; border-bottom: 2px solid #1a73e8;">
    <h4 style="margin: 0; color: #1a73e8;">▶️ Video Detail</h4>
    <p style="margin: 8px 0 0 0; font-size: 13px; color: #666;">Video player with title and description</p>
  </div>
  <img src="screenshots/video-detail.png" alt="Video detail" width="100%" style="display: block; aspect-ratio: 16/9; object-fit: cover;"/>
</div>

<div style="background: #f8f9fa; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
  <div style="padding: 16px; border-bottom: 2px solid #1a73e8;">
    <h4 style="margin: 0; color: #1a73e8;">⭐ Stars</h4>
    <p style="margin: 8px 0 0 0; font-size: 13px; color: #666;">List of players and public figures</p>
  </div>
  <img src="screenshots/stars.png" alt="Stars" width="100%" style="display: block; aspect-ratio: 16/9; object-fit: cover;"/>
</div>

<div style="background: #f8f9fa; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
  <div style="padding: 16px; border-bottom: 2px solid #1a73e8;">
    <h4 style="margin: 0; color: #1a73e8;">🏅 Star Detail</h4>
    <p style="margin: 8px 0 0 0; font-size: 13px; color: #666;">Profile with bio and stats</p>
  </div>
  <img src="screenshots/star-detail.png" alt="Star detail" width="100%" style="display: block; aspect-ratio: 16/9; object-fit: cover;"/>
</div>

<div style="background: #f8f9fa; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
  <div style="padding: 16px; border-bottom: 2px solid #1a73e8;">
    <h4 style="margin: 0; color: #1a73e8;">✍️ Articles</h4>
    <p style="margin: 8px 0 0 0; font-size: 13px; color: #666;">Editorial and analysis articles</p>
  </div>
  <img src="screenshots/articles.png" alt="Articles" width="100%" style="display: block; aspect-ratio: 16/9; object-fit: cover;"/>
</div>

<div style="background: #f8f9fa; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
  <div style="padding: 16px; border-bottom: 2px solid #1a73e8;">
    <h4 style="margin: 0; color: #1a73e8;">📖 Article Details</h4>
    <p style="margin: 8px 0 0 0; font-size: 13px; color: #666;">Full article page with content</p>
  </div>
  <img src="screenshots/article-details.png" alt="Article Details" width="100%" style="display: block; aspect-ratio: 16/9; object-fit: cover;"/>
</div>

<div style="background: #f8f9fa; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
  <div style="padding: 16px; border-bottom: 2px solid #1a73e8;">
    <h4 style="margin: 0; color: #1a73e8;">🔐 Login</h4>
    <p style="margin: 8px 0 0 0; font-size: 13px; color: #666;">User authentication screen</p>
  </div>
  <img src="screenshots/login.png" alt="Login" width="100%" style="display: block; aspect-ratio: 16/9; object-fit: cover;"/>
</div>

<div style="background: #f8f9fa; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
  <div style="padding: 16px; border-bottom: 2px solid #1a73e8;">
    <h4 style="margin: 0; color: #1a73e8;">📝 Register</h4>
    <p style="margin: 8px 0 0 0; font-size: 13px; color: #666;">User registration form</p>
  </div>
  <img src="screenshots/register.png" alt="Register" width="100%" style="display: block; aspect-ratio: 16/9; object-fit: cover;"/>
</div>

<div style="background: #f8f9fa; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
  <div style="padding: 16px; border-bottom: 2px solid #1a73e8;">
    <h4 style="margin: 0; color: #1a73e8;">💬 Feedback</h4>
    <p style="margin: 8px 0 0 0; font-size: 13px; color: #666;">User feedback submission form</p>
  </div>
  <img src="screenshots/feedback.png" alt="Feedback" width="100%" style="display: block; aspect-ratio: 16/9; object-fit: cover;"/>
</div>

</div>

---

### 🛠️ Admin Panel

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 24px; margin: 20px 0;">

<div style="background: #f8f9fa; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
  <div style="padding: 16px; border-bottom: 2px solid #ea4335;">
    <h4 style="margin: 0; color: #ea4335;">📊 Admin Dashboard</h4>
    <p style="margin: 8px 0 0 0; font-size: 13px; color: #666;">Overview with widgets and KPIs</p>
  </div>
  <img src="screenshots/admin-dashboard.png" alt="Admin dashboard" width="100%" style="display: block; aspect-ratio: 16/9; object-fit: cover;"/>
</div>

<div style="background: #f8f9fa; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
  <div style="padding: 16px; border-bottom: 2px solid #ea4335;">
    <h4 style="margin: 0; color: #ea4335;">📰 News Management</h4>
    <p style="margin: 8px 0 0 0; font-size: 13px; color: #666;">Full CRUD for news</p>
  </div>
  <img src="screenshots/admin-news.png" alt="Admin news" width="100%" style="display: block; aspect-ratio: 16/9; object-fit: cover;"/>
</div>

<div style="background: #f8f9fa; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
  <div style="padding: 16px; border-bottom: 2px solid #ea4335;">
    <h4 style="margin: 0; color: #ea4335;">✏️ News Edit</h4>
    <p style="margin: 8px 0 0 0; font-size: 13px; color: #666;">Edit news content and images</p>
  </div>
  <img src="screenshots/admin-news-edit.png" alt="Admin news edit" width="100%" style="display: block; aspect-ratio: 16/9; object-fit: cover;"/>
</div>

<div style="background: #f8f9fa; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
  <div style="padding: 16px; border-bottom: 2px solid #ea4335;">
    <h4 style="margin: 0; color: #ea4335;">⚽ Matches Management</h4>
    <p style="margin: 8px 0 0 0; font-size: 13px; color: #666;">Full CRUD for matches</p>
  </div>
  <img src="screenshots/admin-matches.png" alt="Admin matches" width="100%" style="display: block; aspect-ratio: 16/9; object-fit: cover;"/>
</div>

<div style="background: #f8f9fa; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
  <div style="padding: 16px; border-bottom: 2px solid #ea4335;">
    <h4 style="margin: 0; color: #ea4335;">🎬 Videos Management</h4>
    <p style="margin: 8px 0 0 0; font-size: 13px; color: #666;">Full CRUD for videos</p>
  </div>
  <img src="screenshots/admin-videos.png" alt="Admin videos" width="100%" style="display: block; aspect-ratio: 16/9; object-fit: cover;"/>
</div>

<div style="background: #f8f9fa; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
  <div style="padding: 16px; border-bottom: 2px solid #ea4335;">
    <h4 style="margin: 0; color: #ea4335;">🎥 Videos Edit</h4>
    <p style="margin: 8px 0 0 0; font-size: 13px; color: #666;">Edit video content and links</p>
  </div>
  <img src="screenshots/admin-videos-edit.png" alt="Admin videos edit" width="100%" style="display: block; aspect-ratio: 16/9; object-fit: cover;"/>
</div>

<div style="background: #f8f9fa; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
  <div style="padding: 16px; border-bottom: 2px solid #ea4335;">
    <h4 style="margin: 0; color: #ea4335;">⭐ Stars Management</h4>
    <p style="margin: 8px 0 0 0; font-size: 13px; color: #666;">Full CRUD for stars</p>
  </div>
  <img src="screenshots/admin-stars.png" alt="Admin stars" width="100%" style="display: block; aspect-ratio: 16/9; object-fit: cover;"/>
</div>

<div style="background: #f8f9fa; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
  <div style="padding: 16px; border-bottom: 2px solid #ea4335;">
    <h4 style="margin: 0; color: #ea4335;">👤 Star Edit</h4>
    <p style="margin: 8px 0 0 0; font-size: 13px; color: #666;">Edit star profiles and photos</p>
  </div>
  <img src="screenshots/admin-stars-edit.png" alt="Admin stars edit" width="100%" style="display: block; aspect-ratio: 16/9; object-fit: cover;"/>
</div>

<div style="background: #f8f9fa; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
  <div style="padding: 16px; border-bottom: 2px solid #ea4335;">
    <h4 style="margin: 0; color: #ea4335;">✍️ Articles Management</h4>
    <p style="margin: 8px 0 0 0; font-size: 13px; color: #666;">Full CRUD for articles</p>
  </div>
  <img src="screenshots/admin-articles.png" alt="Admin articles" width="100%" style="display: block; aspect-ratio: 16px/9; object-fit: cover;"/>
</div>

<div style="background: #f8f9fa; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
  <div style="padding: 16px; border-bottom: 2px solid #ea4335;">
    <h4 style="margin: 0; color: #ea4335;">📝 Article Edit</h4>
    <p style="margin: 8px 0 0 0; font-size: 13px; color: #666;">Edit article content</p>
  </div>
  <img src="screenshots/admin-articles-edit.png" alt="Admin articles edit" width="100%" style="display: block; aspect-ratio: 16/9; object-fit: cover;"/>
</div>

<div style="background: #f8f9fa; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
  <div style="padding: 16px; border-bottom: 2px solid #ea4335;">
    <h4 style="margin: 0; color: #ea4335;">💬 Feedback Management</h4>
    <p style="margin: 8px 0 0 0; font-size: 13px; color: #666;">Review and moderation</p>
  </div>
  <img src="screenshots/admin-feedback.png" alt="Admin feedback" width="100%" style="display: block; aspect-ratio: 16/9; object-fit: cover;"/>
</div>

<div style="background: #f8f9fa; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
  <div style="padding: 16px; border-bottom: 2px solid #ea4335;">
    <h4 style="margin: 0; color: #ea4335;">👤 Admin Profile</h4>
    <p style="margin: 8px 0 0 0; font-size: 13px; color: #666;">Admin account settings and profile</p>
  </div>
  <img src="screenshots/admin-profil.png" alt="Admin profile" width="100%" style="display: block; aspect-ratio: 16/9; object-fit: cover;"/>
</div>

<div style="background: #f8f9fa; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
  <div style="padding: 16px; border-bottom: 2px solid #ea4335;">
    <h4 style="margin: 0; color: #ea4335;">👥 Users Management</h4>
    <p style="margin: 8px 0 0 0; font-size: 13px; color: #666;">User accounts and role management</p>
  </div>
  <img src="screenshots/admin-users.png" alt="Admin users" width="100%" style="display: block; aspect-ratio: 16/9; object-fit: cover;"/>
</div>

</div>
