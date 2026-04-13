<div align="center">

# ⚽ Sportify TN <img src="https://img.shields.io/badge/Sportify-TN-1a73e8?style=for-the-badge&logo=lightning&logoColor=white" alt="Sportify TN" height="20"/>

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
│   ├── api/                # Serverless entry 
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