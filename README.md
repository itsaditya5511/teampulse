# TeamPulse — AI-Powered Internal Operations Dashboard

TeamPulse is a full-stack web application that provides role-based dashboards for managing team workflows across Development, DevOps, SEO, and Project Management domains. It features real-time notifications, bug tracking, deployment monitoring, API health checks, and SEO analytics.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Features](#features)
4. [Roles & Access Control](#roles--access-control)
5. [Getting Started](#getting-started)
6. [Environment Variables](#environment-variables)
7. [API Reference](#api-reference)
8. [Database Models](#database-models)
9. [Authentication Flow](#authentication-flow)
10. [Notification System](#notification-system)
11. [Deployment](#deployment)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4 |
| Routing | React Router v7 |
| Animations | Framer Motion |
| Charts | Recharts |
| 3D Graphics | Three.js |
| Icons | Lucide React |
| HTTP Client | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Scheduled Tasks | node-cron |
| AI Integration | Google Generative AI (Gemini) |
| Client Hosting | Vercel |
| Server Hosting | Render |

---

## Project Structure

```
teampulse/
├── client/                          # React + Vite frontend
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vercel.json
│   ├── .env
│   └── src/
│       ├── main.jsx                 # App bootstrap
│       ├── App.jsx                  # Router + ProtectedRoute
│       ├── index.css
│       ├── context/
│       │   └── AuthContext.jsx      # Auth state, login/logout, axios interceptors
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Home.jsx             # Overview dashboard (all roles)
│       │   ├── DevDashboard.jsx
│       │   ├── DevOpsDashboard.jsx
│       │   ├── SEODashboard.jsx
│       │   └── PMDashboard.jsx
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Header.jsx       # Top navigation
│       │   │   └── Sidebar.jsx      # Side navigation
│       │   ├── auth/
│       │   │   └── ParticleBackground.jsx  # Three.js particle effect
│       │   ├── dev/
│       │   │   ├── BugCard.jsx
│       │   │   ├── BugTracker.jsx
│       │   │   ├── DevKPICards.jsx
│       │   │   ├── DevPerformanceInsights.jsx
│       │   │   ├── SprintChart.jsx
│       │   │   └── SubtleCodeNetwork.jsx
│       │   ├── devops/
│       │   │   ├── APIHealthBoard.jsx
│       │   │   ├── CloudGlobe.jsx   # Three.js 3D globe
│       │   │   └── DeploymentLog.jsx
│       │   ├── pm/
│       │   │   ├── CreateBugForm.jsx
│       │   │   ├── DashboardFilters.jsx
│       │   │   ├── DashboardInsights.jsx
│       │   │   ├── KPISection.jsx
│       │   │   ├── SubtleNetwork.jsx
│       │   │   └── TeamOverview.jsx
│       │   ├── seo/
│       │   │   ├── BrokenLinkChecker.jsx
│       │   │   ├── KeywordTracker.jsx
│       │   │   ├── SEOKPICards.jsx
│       │   │   ├── SEOTrafficChart.jsx
│       │   │   └── SubtleSEONetwork.jsx
│       │   └── shared/
│       │       ├── ActivityTimeline.jsx
│       │       └── StatusBadge.jsx
│       └── hooks/                   # Custom React hooks (reserved)
│
└── server/                          # Node.js + Express backend
    ├── index.js                     # App entry point
    ├── seed.js                      # Database seed script
    ├── render.yaml                  # Render deployment config
    ├── .env
    ├── .env.example
    ├── middleware/
    │   ├── authenticate.js          # JWT verification
    │   └── roleGuard.js             # Role-based access control
    ├── models/
    │   ├── User.js
    │   ├── Bug.js
    │   ├── Deployment.js
    │   ├── APIEndpoint.js
    │   ├── SEOReport.js
    │   ├── Keyword.js
    │   ├── Notification.js
    │   └── ChatHistory.js
    ├── routes/
    │   ├── auth.js
    │   ├── bugs.js
    │   ├── deployments.js
    │   ├── deploymentRequests.js
    │   ├── apihealth.js
    │   ├── seo.js
    │   └── notifications.js
    └── services/
        └── pingService.js           # API endpoint health checker
```

---

## Features

### Role-Based Dashboards
Each role gets a dedicated, purpose-built dashboard:
- **Dev Dashboard** — Bug tracker, KPI cards, sprint charts, performance insights
- **DevOps Dashboard** — Deployment log, API health board, 3D cloud globe
- **SEO Dashboard** — Keyword tracker, traffic charts, broken link checker, SEO KPIs
- **PM Dashboard** — Team overview, bug creation, insights, filters

### Bug Tracking
- Create, assign, update, and delete bugs
- Priority levels: `low`, `medium`, `high`, `critical`
- Status workflow: `open` → `in-progress` → `resolved`
- Optional deadline and error stack trace fields
- Automatic notifications on create, assign, and status changes

### Deployment Monitoring
- Track deployments across `dev`, `staging`, and `production` environments
- Status tracking: `success`, `failed`, `in-progress`
- Deployment requests: developers can request deployment via bug reference

### API Health Monitoring
- Register API endpoints to monitor
- Automatic pings every 5 minutes via cron job
- Status classification: `up` (< 1.5s), `slow` (> 1.5s), `down`
- Uptime percentage calculation
- 100-entry rolling history per endpoint

### SEO Analytics
- Track keyword positions with target URLs
- SEO reports with Core Web Vitals (LCP, FID, CLS)
- Performance, SEO, and accessibility scores
- AI suggestions (via Google Gemini)

### Notifications
- Real-time per-user notifications for all key events
- Unread count badge
- Mark individual or all as read

### 3D Visualizations
- Particle background on login page (Three.js)
- Cloud globe on DevOps dashboard (Three.js)
- Network diagrams on Dev, PM, and SEO dashboards

---

## Roles & Access Control

| Role | Dashboard Access | Special Permissions |
|---|---|---|
| `dev` | Home, Dev | Create/update bugs, request deployments |
| `devops` | Home, DevOps | Create deployments, manage API endpoints |
| `seo` | Home, SEO | Add keywords, create/update bugs |
| `pm` | Home, PM | Full bug management |
| `admin` | All dashboards | All permissions |

Route protection is enforced both client-side (React Router `ProtectedRoute`) and server-side (`authenticate` + `roleGuard` middleware).

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone the repository
```bash
git clone <repository-url>
cd teampulse
```

### 2. Set up the server
```bash
cd server
cp .env.example .env
# Edit .env with your values
npm install
npm run seed    # Optional: populate with demo data
npm run dev
```

### 3. Set up the client
```bash
cd client
# Create .env file
echo "VITE_API_BASE_URL=http://localhost:5000" > .env
npm install
npm run dev
```

Client runs at `http://localhost:5173`, server at `http://localhost:5000`.


## Environment Variables

### Server (`server/.env`)
```env
MONGODB_URI=mongodb://127.0.0.1:27017/teampulse
JWT_SECRET=your_jwt_secret_here
PORT=5000
CLIENT_URL=http://localhost:5173
```

### Client (`client/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000
```

---

## API Reference

All routes under `/api/*`. Authenticated routes require:
```
Authorization: Bearer <jwt_token>
```

---

### Auth — `/api/auth`

#### `POST /api/auth/register`
Register a new user.

**Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "dev | devops | seo | pm | admin"
}
```
**Response:** `201 Created`

---

#### `POST /api/auth/login`
Authenticate and receive a JWT token.

**Body:**
```json
{ "email": "string", "password": "string" }
```
**Response:**
```json
{
  "token": "eyJ...",
  "user": { "id": "...", "name": "...", "email": "...", "role": "..." }
}
```

---

#### `GET /api/auth/users`
Get list of all users (for assignment dropdowns).

**Response:** Array of user objects (passwords excluded)

---

### Bugs — `/api/bugs`
*Requires authentication*

| Method | Path | Roles | Description |
|---|---|---|---|
| `GET` | `/api/bugs` | All | List bugs (filtered by ownership for non-admins) |
| `POST` | `/api/bugs` | All | Create bug, notifies all users |
| `PUT` | `/api/bugs/:id` | All | Update bug, triggers notifications |
| `DELETE` | `/api/bugs/:id` | All | Delete bug |

**Query params for `GET`:** `status`, `priority`

**Bug body fields:** `title`, `description`, `errorStack`, `priority`, `assignedTo`, `deadline`

---

### Deployments — `/api/deployments`
*Requires authentication*

| Method | Path | Roles | Description |
|---|---|---|---|
| `GET` | `/api/deployments` | All | List deployments |
| `POST` | `/api/deployments` | devops, admin | Create deployment record |
| `POST` | `/api/deployments/request/:bugId` | dev, admin | Request deployment for a bug |

**Query params for `GET`:** `environment`, `status`

**Deployment body fields:** `project`, `version`, `environment`, `status`, `notes`

---

### API Health — `/api/apihealth`
*Requires authentication*

| Method | Path | Roles | Description |
|---|---|---|---|
| `GET` | `/api/apihealth` | All | List all monitored endpoints |
| `POST` | `/api/apihealth` | devops, admin | Register new endpoint |
| `POST` | `/api/apihealth/ping` | devops, admin | Manually trigger health ping |

---

### SEO — `/api/seo`
*Requires authentication*

| Method | Path | Roles | Description |
|---|---|---|---|
| `GET` | `/api/seo/reports` | All | Get all SEO reports |
| `GET` | `/api/seo/keywords` | All | Get all tracked keywords |
| `POST` | `/api/seo/keywords` | seo, admin | Add keyword to tracker |

---

### Notifications — `/api/notifications`
*Requires authentication*

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/notifications` | Get current user's notifications (max 50) |
| `GET` | `/api/notifications/unread-count` | Get unread count |
| `PUT` | `/api/notifications/:id/read` | Mark one as read |
| `PUT` | `/api/notifications/read-all` | Mark all as read |

---

### Health Check

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Server liveness check |

---

## Database Models

### User
```
name        String   required
email       String   required, unique
password    String   required (bcrypt hashed)
role        Enum     dev | devops | seo | pm | admin  (default: dev)
createdAt   Date     auto
```

### Bug
```
title        String   required
description  String   required
errorStack   String   optional
status       Enum     open | in-progress | resolved  (default: open)
priority     Enum     low | medium | high | critical  (default: medium)
assignedTo   Ref      User  (optional)
deadline     Date     optional
createdBy    Ref      User  (required)
createdAt    Date     auto
```

### Deployment
```
project      String   required
version      String   required
environment  Enum     dev | staging | production
status       Enum     success | failed | in-progress
deployedBy   Ref      User  (required)
notes        String   optional
timestamp    Date     auto
```

### APIEndpoint
```
name           String   required
url            String   required
lastChecked    Date
status         Enum     up | down | slow | unknown  (default: unknown)
responseTime   Number   (ms)
uptimePercent  Number   (default: 100)
history        Array    [{timestamp, responseTime, status}]  (max 100)
```

### SEOReport
```
url                  String   required
performanceScore     Number
seoScore             Number
accessibilityScore   Number
lcp                  Number   (ms)
fid                  Number   (ms)
cls                  Number
aiSuggestions        String
createdAt            Date     auto
```

### Keyword
```
keyword     String   required
targetUrl   String   required
position    Number   (null until first check)
checkedAt   Date     auto
```

### Notification
```
recipient   Ref      User  (required)
message     String   required
type        Enum     bug_created | bug_updated | bug_assigned | deployment |
                     status_change | deployment_request
relatedId   ObjectId optional (reference to related resource)
read        Boolean  (default: false)
createdAt   Date     auto
```

### ChatHistory
```
userId    Ref     User  (required)
messages  Array   [{role, content, timestamp}]
  role    Enum    user | assistant | system
  content String  required
```

---

## Authentication Flow

```
Register
  POST /api/auth/register
    → Validate email uniqueness
    → bcrypt hash password (10 rounds)
    → Save User document
    → Return 201

Login
  POST /api/auth/login
    → Query user by email
    → bcrypt.compare password
    → Sign JWT {userId, role, name, email} — expires 24h
    → Return {token, user}

Client
  → Store token in localStorage
  → Set axios default header: Authorization: Bearer <token>

Protected Requests
  → authenticate.js extracts Bearer token
  → jwt.verify() with JWT_SECRET
  → Attach decoded user to req.user
  → roleGuard.js checks req.user.role against allowed roles
  → 401 if invalid token | 403 if insufficient role
```

---

## Notification System

Notifications are created automatically by the server on:

| Event | Recipients |
|---|---|
| Bug created | All users except creator |
| Bug assigned to user | Assigned user |
| Bug status changed | All users |
| Bug updated | All users |
| Deployment requested (by dev) | All DevOps users |
| Deployment created | All users |

---

## Deployment

### Client (Vercel)
- Build command: `npm run build` (outputs to `dist/`)
- Framework preset: Vite
- Set `VITE_API_BASE_URL` to your server's production URL in Vercel environment settings
- `vercel.json` handles SPA routing redirects

### Server (Render)
- Config defined in `render.yaml`
- Build command: `npm install`
- Start command: `npm start`
- Set environment variables in Render dashboard:
  - `MONGODB_URI` — MongoDB Atlas connection string
  - `JWT_SECRET` — Strong random secret
  - `CLIENT_URL` — Vercel deployment URL (for CORS)
  - `PORT` — Render sets this automatically

### CORS Configuration
Server accepts requests from `CLIENT_URL` env variable (falls back to `http://localhost:5173`). Set this to your Vercel URL in production.

---

## Scripts

### Server
```bash
npm run dev    # Start with nodemon (auto-reload)
npm start      # Start production server
npm run seed   # Seed database with demo data
```

### Client
```bash
npm run dev      # Start Vite dev server
npm run build    # Production build
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

---

## API Health Ping Schedule

The server runs a cron job every 5 minutes:
```
*/5 * * * *  →  pingService.pingAllEndpoints()
```

Each endpoint is classified:
- `up` — Response received in < 1500ms
- `slow` — Response received in ≥ 1500ms
- `down` — Request failed or timed out

Uptime percentage and a rolling 100-entry history are maintained per endpoint.
