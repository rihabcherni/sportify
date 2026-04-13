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

| 🏠 Home |
|:---:|
| ![Home](screenshots/home.png) |
| Overview with key sections |

<b>🔐 Authentication</b>
<br>
| 🔐 Login | 📝 Register |
|:---:|:---:|
|![Login](screenshots/login.png) | ![Register](screenshots/register.png) |
| User authentication screen | User registration form |

<b>📰 News</b>
<br>

| 📰 News List | 📄 News Detail |
|:---:|:---:|
| ![News](screenshots/news.png) | ![News detail](screenshots/news-details.png) |
| News cards with filters | Full article with image & metadata |

<b>⚽ Matches</b>
<br>

| ⚽ Matches List | 🏟️ Match Detail |
|:---:|:---:|
| ![Matches](screenshots/matches.png) | ![Match detail](screenshots/match-detail.png) |
| Schedule and scores | Full match sheet (teams, score, status) |

<b>🎬 Videos</b>
<br>

| 🎬 Video Gallery | ▶️ Video Detail |
|:---:|:---:|
| ![Videos](screenshots/videos.png) | ![Video detail](screenshots/video-detail.png) |
| Gallery with previews | Player with title and description |

<b>⭐ Stars & ✍️ Articles</b>
<br>

| ⭐ Stars List | 🏅 Star Detail |
|:---:|:---:|
| ![Stars](screenshots/stars.png) | ![Star detail](screenshots/star-detail.png) |
| Players and public figures | Profile with bio and stats |

| ✍️ Articles List | 📖 Article Detail |
|:---:|:---:|
| ![Articles](screenshots/articles.png) | ![Article detail](screenshots/article-details.png) |
| Editorial and analysis | Full article page with content |

<b>💬 Feedback</b>
<br>

| 💬 Feedback Form |
|:---:|
| ![Feedback](screenshots/feedback.png) |
| User feedback submission form |

</details>

---

### 🛠️ Admin Panel

<b>📊 Dashboard & 👥 Users</b>
<br>

| 📊 Admin Dashboard | 
|:---:|
| ![Admin dashboard](screenshots/admin-dashboard.png) |
| KPIs, stats, and overview widgets | 

| 👤 Admin Profile |👥 Users Management |
|:---:|:---:|
| ![Admin profile](screenshots/admin-profil.png) | ![Admin users](screenshots/admin-users.png) |
| Admin account settings |User accounts and role management |

<b>📰 News Management</b>
<br>

| 📰 News List | ✏️ News Edit |
|:---:|:---:|
| ![Admin news](screenshots/admin-news.png) | ![Admin news edit](screenshots/admin-news-edit.png) |
| Full CRUD for news | Edit content and images |

<b>⚽ Matches & 🎬 Videos Management</b>
<br>

| ⚽ Matches Management |
|:---:|
| ![Admin matches](screenshots/admin-matches.png) |
| Full CRUD for matches |

| 🎬 Videos List | 🎥 Videos Edit |
|:---:|:---:|
| ![Admin videos](screenshots/admin-videos.png) | ![Admin videos edit](screenshots/admin-videos-edit.png) |
| Full CRUD for videos | Edit content and links |

<b>⭐ Stars & ✍️ Articles Management</b>
<br>

| ⭐ Stars List | 👤 Star Edit |
|:---:|:---:|
| ![Admin stars](screenshots/admin-stars.png) | ![Admin stars edit](screenshots/admin-stars-edit.png) |
| Full CRUD for stars | Edit profiles and photos |

| ✍️ Articles List | 📝 Article Edit |
|:---:|:---:|
| ![Admin articles](screenshots/admin-articles.png) | ![Admin articles edit](screenshots/admin-articles-edit.png) |
| Full CRUD for articles | Edit article content |

<b>💬 Feedback Management</b>
<br>

| 💬 Feedback Management |
|:---:|
| ![Admin feedback](screenshots/admin-feedback.png) |
| Review and moderation |

</details>