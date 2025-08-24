## Ram Tech Solutions Pvt Ltd – Online Training Institute Website

This repository contains a full‑stack implementation of the Ram Tech Solutions training institute website.

### Stack
- Frontend: React (Vite), React Router
- Backend: Node.js (Express), SQLite (via better-sqlite3), Nodemailer
- Auth (Admin): Static API key via header `x-admin-key`

### Features
- Homepage with welcome, highlights, and upcoming demo classes
- Teacher registration with Admin approval workflow
- Student request/inquiry form (email notification optional)
- Courses listing and demo class schedules
- Admin dashboard to manage teachers, courses, and view student requests
- About and Contact pages with social links

---

## Getting Started (Local Dev)

### 1) Prerequisites
- Node.js 18+

### 2) Backend setup
```
cd "ram tech/backend"
npm install
copy .env.example .env
```
Now edit `.env` as needed. At minimum set `ADMIN_API_KEY`.

Start the backend (default port 4000):
```
npm run dev
```

The first run will create a local SQLite database at `data/app.db` and all tables.

### 3) Frontend setup
```
cd "ram tech/frontend"
npm install
copy .env.example .env
npm run dev
```

Open the URL printed by Vite (default `http://localhost:5173`).

### Admin Access
- All admin APIs require header `x-admin-key: <your ADMIN_API_KEY>`.
- The Admin UI prompts for the key (stored only in memory per tab).

---

## Configuration

### Backend `.env`
```
PORT=4000
ADMIN_API_KEY=changeme-strong-key

# Optional email (leave empty to disable emails)
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM="Ram Tech <no-reply@ramtech.example>"

# CORS (comma-separated list)
CORS_ORIGINS=http://localhost:5173
```

### Frontend `.env`
```
VITE_API_BASE_URL=http://localhost:4000
```

---

## Scripts

### Backend
- `npm run dev` – start server with auto-reload
- `npm start` – start server

### Frontend
- `npm run dev` – start Vite dev server
- `npm run build` – build for production
- `npm run preview` – preview production build

---

## API Overview (Backend)

- `POST /api/teachers/register` – Teacher registration
- `GET /api/teachers?status=approved` – Public teacher directory
- `GET /api/courses` – List courses (public)
- `GET /api/demo-classes` – Upcoming demo classes (derived from course start dates)
- `POST /api/requests` – Student inquiry

Admin (requires `x-admin-key`):
- `GET /api/admin/teachers?status=pending|approved|rejected`
- `POST /api/admin/teachers/:id/approve`
- `POST /api/admin/teachers/:id/reject`
- `GET /api/admin/requests`
- `POST /api/admin/courses`
- `PUT /api/admin/courses/:id`
- `DELETE /api/admin/courses/:id`

---

## Notes
- This implementation uses SQLite for simple local development. You can migrate to PostgreSQL/MySQL later if needed.
- Emails are sent only if SMTP env variables are provided; otherwise, the system will skip sending but still store requests in the DB.

