# Sportify TN

Plateforme web sportive full‑stack pour publier et consulter des actualites, matchs, videos, articles et stars, avec un espace d’administration pour la gestion du contenu.

## Sommaire

- Presentation
- Fonctionnalites
- Tech Stack
- Architecture
- Demarrage rapide (Docker)
- Installation locale
- Variables d’environnement
- Seed de donnees
- Documentation API
- Screenshots

## Presentation

Sportify TN est une application web qui centralise les contenus sportifs et offre une interface publique pour les utilisateurs, plus un back‑office pour l’equipe editorial.

## Fonctionnalites

- Actualites, matchs, videos, articles et stars
- Details de chaque contenu
- Authentification (utilisateurs/admin)
- Espace admin pour CRUD sur tout le contenu
- Gestion des feedbacks
- Upload d’images et servir les fichiers via `/uploads`
- Documentation Swagger exposee par le backend

## Tech Stack

- Frontend: React 18, React Router, Axios, ApexCharts
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, Multer
- Infra: Docker, Nginx

## Architecture

- `frontend/`: application React
- `backend/`: API REST Express + MongoDB
- `docker-compose.yml`: MongoDB + backend + frontend

## Demarrage rapide (Docker)

1. Lancer l’ensemble des services:

```bash
docker compose up --build
```

2. Acces:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Swagger: http://localhost:5000/api-docs

## Installation locale

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## Variables d’environnement

### Backend (`backend/.env`)

- `MONGO_URI` (ex: `mongodb://localhost:27017/sportify-tn`)
- `JWT_SECRET`
- `PORT` (par defaut `5000`)
- `API_BASE_URL` (pour Swagger, ex: `http://localhost:5000`)
- `UPLOADS_DIR` (optionnel, dossier de stockage des fichiers upload)

### Frontend (`frontend/.env`)

- `REACT_APP_API_BASE_URL` (base URL Axios, ex: `http://localhost:5000`)
- `REACT_APP_API_URL` (utilise pour resoudre les images, ex: `http://localhost:5000`)

## Seed de donnees

Un script de seed est disponible pour peupler la base.

```bash
cd backend
npm run seed
```

## Documentation API

Le backend expose une documentation Swagger:

- http://localhost:5000/api-docs

## Screenshots


- Accueil (Home)
  Description: Vue generale avec les sections principales (news, matchs, videos) et un aperçu des contenus.
  Image: `screenshots/home.png`

- Actualites
  Description: Liste des articles d’actualite avec cartes et filtres.
  Image: `screenshots/news.png`

- Details actualite
  Description: Page detaillee d’un article avec image, contenu et meta‑infos.
  Image: `screenshots/news-detail.png`

- Matchs
  Description: Calendrier/liste des matchs avec score et infos par match.
  Image: `screenshots/matches.png`

- Details match
  Description: Fiche complete d’un match (equipes, score, statut).
  Image: `screenshots/match-detail.png`

- Videos
  Description: Galerie video avec apercus et accès au detail.
  Image: `screenshots/videos.png`

- Details video
  Description: Page de lecture video avec titre et description.
  Image: `screenshots/video-detail.png`

- Stars
  Description: Liste des joueurs/personnalites avec cartes.
  Image: `screenshots/stars.png`

- Details star
  Description: Profil d’une star avec bio et statistiques.
  Image: `screenshots/star-detail.png`

- Articles
  Description: Page des articles d’analyse/chroniques.
  Image: `screenshots/articles.png`

- Authentification
  Description: Ecrans de connexion/inscription.
  Image: `screenshots/auth.png`

- Admin dashboard
  Description: Vue d’ensemble avec widgets et KPIs.
  Image: `screenshots/admin-dashboard.png`

- Admin news
  Description: Gestion CRUD des actualites.
  Image: `screenshots/admin-news.png`

- Admin matchs
  Description: Gestion CRUD des matchs.
  Image: `screenshots/admin-matches.png`

- Admin videos
  Description: Gestion CRUD des videos.
  Image: `screenshots/admin-videos.png`

- Admin stars
  Description: Gestion CRUD des stars.
  Image: `screenshots/admin-stars.png`

- Admin articles
  Description: Gestion CRUD des articles.
  Image: `screenshots/admin-articles.png`

- Admin feedback
  Description: Consultation et moderation des feedbacks.
  Image: `screenshots/admin-feedback.png`

- Admin users
  Description: Gestion des utilisateurs et roles.
  Image: `screenshots/admin-users.png`
