# 🔗 SnipURL - URL Shortener

A full-stack URL shortener with Redis caching, rate limiting, and click analytics.

**🚀 Live Demo:** [https://url-shortener-flax-zeta.vercel.app/](https://url-shortener-flax-zeta.vercel.app/)
**⚙️ Backend API:** [https://url-shortener-83f7.onrender.com](https://url-shortener-83f7.onrender.com)

---

## ✨ Features

- **URL Shortening** — Convert long URLs into short, shareable links
- **Custom Short Codes** — Define your own alias instead of a random code
- **Reverse Lookup** — Get the original URL back from a short code or short URL
- **Click Analytics** — Track total clicks, timestamps, and user agent data
- **Redis Caching** — Fast redirects via cache-first lookups
- **Rate Limiting** — Sliding window rate limiter to prevent abuse
- **Async Click Tracking** — Click events are queued and processed in the background, so redirects stay fast

---

## 🛠 Tech Stack

**Backend:** Node.js, Express, PostgreSQL (Supabase), Prisma ORM, Redis (ioredis)
**Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
**Hosting:** Backend on Render · Frontend on Vercel · DB on Supabase · Cache on Redis Cloud

---

## 📡 API

### Shorten a URL
```
POST /api/shorten
Content-Type: application/json

{
  "url": "https://example.com/very/long/url",
  "customCode": "myLink"   // optional
}
```

**Response (201 Created)**
```json
{
  "success": true,
  "shortUrl": "https://url-shortener-83f7.onrender.com/myLink",
  "shortCode": "myLink",
  "originalUrl": "https://example.com/very/long/url"
}
```

| Status | Reason |
|---|---|
| 400 | Invalid URL or custom code format |
| 409 | Custom code already taken |
| 429 | Rate limit exceeded |

### Get the original URL from a short code
```
GET /api/lookup/:shortCode
```
Returns the original URL without redirecting — useful for previewing a link before visiting it.

**Response (200 OK)**
```json
{
  "success": true,
  "shortCode": "myLink",
  "originalUrl": "https://example.com/very/long/url"
}
```

### Redirect to the original URL
```
GET /:shortCode
```
Returns a 302 redirect to the original URL and tracks the click asynchronously.

### Get analytics
```
GET /api/analytics/:shortCode
```
**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "shortCode": "myLink",
    "originalUrl": "https://example.com",
    "totalClicks": 42,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 📁 Project Structure

```
url-shortener/
├── backend/
│   └── src/
│       ├── config/         # Prisma + Redis clients
│       ├── controllers/
│       ├── middleware/     # Rate limiter
│       ├── routes/
│       ├── services/
│       ├── workers/        # Background click processor
│       └── utils/
└── frontend/
    ├── app/
    └── src/
        ├── components/
        └── lib/
```

---

## 🚀 Getting Started

**Prerequisites:** Node.js 18+, a Supabase (PostgreSQL) account, a Redis Cloud account

**Backend**
```bash
cd backend
npm install
cp .env.example .env   # fill in DATABASE_URL, REDIS_URL, etc.
npx prisma migrate dev
npm run dev             # runs on http://localhost:5000
```

**Frontend**
```bash
cd frontend
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev                   # runs on http://localhost:3000
```

---

## 👤 Author
Ranveer Mane