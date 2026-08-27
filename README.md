# 🔗 SnipURL - Distributed URL Shortener

A production-grade, horizontally scalable URL shortener built with system design principles used in real-world distributed systems like bit.ly. Features Redis-based caching, sliding window rate limiting, and a write-behind analytics queue.

**🚀 Live Demo:** [https://url-shortener-flax-zeta.vercel.app/](https://url-shortener-flax-zeta.vercel.app/)

**⚙️ Backend API:** [https://url-shortener-83f7.onrender.com](https://url-shortener-83f7.onrender.com)

---

## 📋 Table of Contents

- [Features](#features)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [System Design Concepts](#system-design-concepts)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Future Improvements](#future-improvements)

---

## ✨ Features

- **URL Shortening** - Convert long URLs into short, shareable links
- **Custom Short Codes** - Users can define their own custom aliases
- **Idempotent Requests** - Shortening the same URL twice returns the same short code
- **Click Analytics** - Track total clicks, timestamps, and user agent data
- **Redis Caching** - Sub-millisecond redirects via cache-first lookups
- **Rate Limiting** - Redis sliding window algorithm prevents API abuse
- **Write-Behind Queue** - Asynchronous click tracking without blocking redirects
- **Graceful Shutdown** - Proper cleanup of DB/Redis connections on process termination
- **Responsive UI** - Clean, dark-themed interface built with Tailwind CSS

---

## 🏗 System Architecture

┌─────────────────┐
│ Next.js UI │
│ (Vercel) │
└────────┬─────────┘
│ HTTPS
▼
┌─────────────────────────────────────┐
│ Express API (Render) │
│ │
│ ┌─────────────┐ ┌─────────────┐ │
│ │ Rate Limiter│───▶│ Controller │ │
│ └─────────────┘ └──────┬──────┘ │
│ ▼ │
│ ┌─────────────┐ │
│ │ Service │ │
│ └──────┬──────┘ │
└─────────────────────────────┼───────┘
│
┌────────────────┼────────────────┐
▼ ▼
┌─────────────────┐ ┌──────────────────┐
│ Redis Cloud │ │ PostgreSQL │
│ │ │ (Supabase) │
│ • URL Cache │ │ │
│ • Rate Limit ZSET │ │ • urls table │
│ • Analytics Queue │ │ • clicks table │
└────────┬──────────┘ └─────────▲──────────┘
│ │
│ ┌──────────────────┐ │
└────────▶│ Analytics Worker │───────┘
│ (Background Job) │
└───────────────────┘

### Request Flow: Shortening a URL
User submits URL → Rate Limiter (Redis ZSET check)
→ Controller validates input → Service checks for duplicate URL
→ Base62 encode DB id → Save to PostgreSQL → Cache in Redis
→ Return short URL


### Request Flow: Redirecting
User visits short URL → Check Redis cache (fast path)
→ Cache MISS? → Query PostgreSQL → Warm the cache
→ Push click event to Redis queue (fire-and-forget)
→ 302 redirect to original URL
→ [Background] Worker drains queue every 5s → Batch insert to PostgreSQL


---

## 🛠 Tech Stack

**Backend**
- Node.js + Express
- PostgreSQL (via Supabase)
- Prisma ORM
- Redis (ioredis client)
- Redis Cloud (managed Redis hosting)

**Frontend**
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS

**Infrastructure**
- Backend hosted on Render
- Frontend hosted on Vercel
- Database hosted on Supabase
- Cache/Queue hosted on Redis Cloud

---

## 🎯 System Design Concepts Demonstrated

| Concept | Implementation |
|---|---|
| **Caching Strategy** | Cache-aside pattern with 24hr TTL, cache warming on miss |
| **Rate Limiting** | Sliding window algorithm using Redis Sorted Sets (ZSET) |
| **Idempotency** | Duplicate URL submissions return existing short code instead of creating new records |
| **Write-Behind Queue** | Click events queued in Redis List, batch-processed by background worker every 5s |
| **Atomic Operations** | Prisma transactions + Redis `increment` prevent race conditions on click counts |
| **Graceful Degradation** | Rate limiter "fails open" if Redis is unreachable (availability over strict enforcement) |
| **Separation of Concerns** | Layered architecture: Routes → Controllers → Services → Data layer |
| **Fire-and-Forget** | Click tracking doesn't block the redirect response to the user |

---

## 📡 API Documentation

### Shorten a URL
POST /api/shorten
Content-Type: application/json

{
"url": "https://example.com/very/long/url",
"customCode": "myLink" // optional
}


**Response (201 Created)**
```json
{
  "success": true,
  "shortUrl": "https://url-shortener-83f7.onrender.com/myLink",
  "shortCode": "myLink",
  "originalUrl": "https://example.com/very/long/url",
  "createdAt": "2024-01-01T00:00:00.000Z"
}

Error Responses

Status	Reason
400	Invalid URL or invalid custom code format
409	Custom code already taken
429	Rate limit exceeded

Redirect to Original URL

GET /:shortCode
Returns 302 redirect to the original URL. Tracks click event asynchronously.

Get Analytics

GET /api/analytics/:shortCode
Response (200 OK)

{
  "success": true,
  "data": {
    "shortCode": "myLink",
    "originalUrl": "https://example.com",
    "totalClicks": 42,
    "recentClicks": [
      {
        "id": 1,
        "clickedAt": "2024-01-01T10:00:00.000Z",
        "userAgent": "Mozilla/5.0..."
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}

Rate Limit Headers
All requests to /api/shorten include:
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1704067260

📁 Project Structure
url-shortener/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js       # Prisma client instance
│   │   │   └── redis.js          # Redis connection + retry logic
│   │   ├── controllers/
│   │   │   ├── url.controller.js
│   │   │   └── analytics.controller.js
│   │   ├── middleware/
│   │   │   └── rateLimiter.js    # Sliding window rate limiter
│   │   ├── routes/
│   │   │   ├── url.routes.js
│   │   │   └── analytics.routes.js
│   │   ├── services/
│   │   │   ├── url.service.js
│   │   │   └── analytics.service.js
│   │   ├── workers/
│   │   │   └── analyticsWorker.js  # Background click processor
│   │   ├── utils/
│   │   │   ├── base62.js          # Short code encoding
│   │   │   └── urlValidator.js
│   │   └── app.js
│   ├── prisma/
│   │   └── schema.prisma
│   └── server.js
│
└── frontend/
    ├── app/
    │   ├── page.tsx                 # Home page
    │   ├── layout.tsx
    │   └── analytics/
    │       └── [code]/
    │           └── page.tsx         # Analytics dashboard
    └── src/
        ├── components/
        │   └── ShortenForm.tsx
        └── lib/
            └── api.ts               # Backend API client

Getting Started
Prerequisites
Node.js 18+
A Supabase account (PostgreSQL)
A Redis Cloud account


Backend Setup
cd backend
npm install
cp .env.example .env
# Fill in DATABASE_URL, REDIS_URL, etc. in .env
npx prisma migrate dev
npm run dev

Backend runs on http://localhost:5000

Frontend Setup
cd frontend
npm install
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev
Frontend runs on http://localhost:3000

Environment Variables

Backend (.env)
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000

☁️ Deployment
Service	Platform	Notes
Backend API	Render	Free tier - spins down after 15 min inactivity
Frontend	Vercel	Auto-deploys on push to main
Database	Supabase	PostgreSQL, session pooler connection
Cache/Queue	Redis Cloud	30MB free tier

👤 Author
Ranveer Mane