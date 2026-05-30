# Deployment Guide — Extensio AI

This guide covers deploying Extensio AI to production using:

| Layer | Platform |
|-------|----------|
| Frontend | [Vercel](https://vercel.com) |
| Backend API | [Render](https://render.com) |
| Database | [MongoDB Atlas](https://www.mongodb.com/atlas) |

---

## Architecture

```
Browser (Vercel)
    │
    │  HTTPS + cookies (SameSite=None)
    ▼
Render Web Service (Express API)
    │
    ├── MongoDB Atlas
    ├── Groq API (AI generation)
    └── Stripe (billing webhooks)
```

---

## 1. MongoDB Atlas

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com).
2. **Database Access** → add a database user with password.
3. **Network Access** → add `0.0.0.0/0` (or Render egress IPs if you restrict access).
4. **Connect** → choose **Drivers** → copy the connection string.
5. Replace `<password>` in the URI. The app uses database name `extensio`.

Example:

```
mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

Store this as `MONGO_URI` on Render.

---

## 2. Backend on Render

### Option A — Blueprint (`render.yaml`)

1. Push this repo to GitHub.
2. In Render: **New** → **Blueprint** → connect the repo.
3. Set secret env vars when prompted (`MONGO_URI`, `GROQ_API_KEY`, `FRONTEND_URL`, Stripe keys).

### Option B — Manual web service

1. **New** → **Web Service** → connect GitHub repo.
2. Settings:
   - **Root directory:** `backend`
   - **Build command:** `npm install && npm run build`
   - **Start command:** `npm start`
   - **Health check path:** `/api/health`
3. Add environment variables (see table below).

### Required backend environment variables

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | `production` |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Random string, at least 32 characters |
| `FRONTEND_URL` | Vercel app URL, e.g. `https://your-app.vercel.app` |
| `GROQ_API_KEY` | Groq API key for AI generation |
| `COOKIE_SAME_SITE` | `none` (required for cross-origin cookies) |
| `PORT` | Render sets this automatically |

### Optional (billing and ops)

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret |
| `STRIPE_PRICE_PRO_MONTHLY` | Price ID for Pro monthly |
| `STRIPE_PRICE_PRO_YEARLY` | Price ID for Pro yearly |
| `CORS_ORIGINS` | Comma-separated extra origins (preview URLs) |
| `LOG_LEVEL` | `info` (default in production) |

See [STRIPE_SETUP.md](./STRIPE_SETUP.md) for local webhook setup with Stripe CLI.

### Stripe webhook on Render

1. Stripe Dashboard → **Developers** → **Webhooks** → **Add endpoint**.
2. URL: `https://YOUR-RENDER-SERVICE.onrender.com/api/webhooks/stripe`
3. Events: `checkout.session.completed`, `customer.subscription.*`, `invoice.payment_failed`
4. Copy the signing secret to `STRIPE_WEBHOOK_SECRET` on Render.

### Verify backend

```bash
curl https://YOUR-RENDER-SERVICE.onrender.com/api/health
```

Expected:

```json
{"success":true,"status":"ok","timestamp":"...","environment":"production"}
```

---

## 3. Frontend on Vercel

1. Import the GitHub repo in [Vercel](https://vercel.com/new).
2. Settings:
   - **Framework preset:** Vite
   - **Root directory:** `frontend`
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
3. Environment variables:

| Variable | Value |
|----------|--------|
| `VITE_API_URL` | `https://YOUR-RENDER-SERVICE.onrender.com/api` |

4. Deploy.

`frontend/vercel.json` configures SPA routing so client-side routes work.

### Cross-origin auth (Vercel + Render)

The frontend and API run on different domains. The backend supports this:

- CORS allows `FRONTEND_URL` (and optional `CORS_ORIGINS`)
- Cookies use `SameSite=None` and `Secure` in production (`COOKIE_SAME_SITE=none`)
- Axios sends `withCredentials: true`

Set `FRONTEND_URL` on Render to your exact Vercel URL (no trailing slash). For preview deployments, add URLs to `CORS_ORIGINS`:

```
CORS_ORIGINS=https://your-app.vercel.app,https://your-app-git-main-user.vercel.app
```

---

## 4. Local development

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Vite proxies `/api` to `http://localhost:5000`. Leave `VITE_API_URL=/api` or unset for local dev.

---

## 5. Production checklist

### Security

- [ ] `JWT_SECRET` is at least 32 random characters
- [ ] No secrets in git (`.env` is gitignored)
- [ ] MongoDB user has least-privilege access
- [ ] Stripe webhook secret is set
- [ ] `NODE_ENV=production` on Render

### Backend hardening (included)

- Helmet security headers
- Rate limiting (global, auth, generate)
- Structured JSON logging
- Environment validation at startup
- Global error handler (no stack traces in production)
- Health check at `/api/health`

### Frontend UX (included)

- Error boundary for unexpected React errors
- Toast notifications (Sonner)
- Skeleton loaders on data-heavy pages
- Session loading state on protected routes

### Smoke test after deploy

1. Register / login on Vercel URL
2. Generate an extension
3. Download ZIP
4. Open Billing → Stripe Checkout (test mode)
5. Confirm webhook updates subscription

---

## 6. Troubleshooting

### Login works locally but not in production

- Confirm `FRONTEND_URL` on Render matches the Vercel URL exactly
- Set `COOKIE_SAME_SITE=none` on Render
- Ensure `VITE_API_URL` points to Render with `/api` suffix
- Check DevTools → Network → login response includes `Set-Cookie`

### CORS errors

- Add the browser origin to `FRONTEND_URL` or `CORS_ORIGINS`
- Do not use `*` with `credentials: true`

### 429 Too many requests

- Auth: 15 attempts / 15 min per IP (production)
- Generate: 40 requests / hour per IP (production)
- Adjust in `backend/src/middleware/rateLimit.ts` if needed

### Render cold starts

Free tier services spin down after inactivity. First request may take 30–60s.

### MongoDB connection failures

- Verify Atlas network access allows Render
- Check credentials in the connection string
- Ensure cluster is not paused

---

## 7. Custom domains (optional)

1. **Vercel:** Project → Settings → Domains → add `app.yourdomain.com`
2. **Render:** Service → Settings → Custom Domains → add `api.yourdomain.com`
3. Update env vars:
   - Render: `FRONTEND_URL=https://app.yourdomain.com`
   - Vercel: `VITE_API_URL=https://api.yourdomain.com/api`
4. Update Stripe webhook URL to the custom API domain

---

## File reference

| File | Purpose |
|------|---------|
| `backend/.env.example` | Backend env template |
| `frontend/.env.example` | Frontend env template |
| `frontend/vercel.json` | Vercel SPA rewrites |
| `render.yaml` | Render blueprint |
| `backend/src/config/env.ts` | Env validation |
| `backend/src/middleware/rateLimit.ts` | Rate limits |
| `backend/src/middleware/errorHandler.ts` | Global errors |
