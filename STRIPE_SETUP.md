# Stripe integration guide

Extensio AI uses **Stripe Checkout** for subscriptions (Pro monthly/yearly) and the **Stripe Customer Portal** for payment methods and invoices. Webhooks keep your MongoDB user record in sync with Stripe.

## 1. Create products & prices

1. Open [Stripe Dashboard](https://dashboard.stripe.com) (use **Test mode** while developing).
2. **Product catalog** → **Add product** → name it **Extensio Pro**.
3. Add two recurring prices:
   - **Monthly** — e.g. $19/month
   - **Yearly** — e.g. $190/year
4. Copy each **Price ID** (`price_...`) — you need both in `.env`.

## 2. Backend environment variables

Add these to `backend/.env`:

```env
STRIPE_SECRET_KEY=sk_test_xxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxx
STRIPE_PRICE_PRO_MONTHLY=price_xxxxxxxx
STRIPE_PRICE_PRO_YEARLY=price_xxxxxxxx
FRONTEND_URL=http://localhost:5173
```

| Variable | Where to find it |
|----------|------------------|
| `STRIPE_SECRET_KEY` | Developers → API keys → **Secret key** (`sk_test_...`) |
| `STRIPE_PRICE_PRO_MONTHLY` | Product → monthly price → Price ID |
| `STRIPE_PRICE_PRO_YEARLY` | Product → yearly price → Price ID |
| `STRIPE_WEBHOOK_SECRET` | From webhook setup (step 3) or Stripe CLI |

Restart the backend after changing `.env`.

## 3. Webhooks (local development)

Checkout can redirect back without webhooks, but **plan upgrades won't persist** until webhooks sync the subscription.

### Option A — Stripe CLI (recommended)

```bash
# Install: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to localhost:5000/api/webhooks/stripe
```

Copy the `whsec_...` signing secret from the CLI output into `STRIPE_WEBHOOK_SECRET`.

### Option B — Stripe Dashboard tunnel

Use a tunnel (ngrok, Cloudflare Tunnel) to expose `http://localhost:5000/api/webhooks/stripe` and add the endpoint in **Developers → Webhooks**.

### Events to subscribe to

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_failed`

## 4. Customer Billing Portal

1. Stripe Dashboard → **Settings** → **Billing** → **Customer portal**.
2. Enable the portal and allow customers to update payment methods and cancel subscriptions.
3. Save — required for **Manage payment method** on the Billing page.

## 5. Test the flow

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Sign in → **Billing** → **Pro Monthly** (use test card `4242 4242 4242 4242`, any future expiry, any CVC).
4. After redirect to `/billing?checkout=success`, confirm plan shows **pro** and status **active**.

### Test cards

| Scenario | Card number |
|----------|-------------|
| Success | `4242 4242 4242 4242` |
| Decline | `4000 0000 0000 0002` |
| 3D Secure | `4000 0025 0000 3155` |

## 6. Production (Render + Vercel)

1. Switch Stripe to **Live mode** and create live products/prices.
2. Set live keys on Render:
   - `STRIPE_SECRET_KEY=sk_live_...`
   - `STRIPE_PRICE_PRO_MONTHLY=price_...`
   - `STRIPE_PRICE_PRO_YEARLY=price_...`
   - `FRONTEND_URL=https://your-app.vercel.app`
   - `COOKIE_SAME_SITE=none` (cross-origin cookies)
3. Webhook endpoint: `https://YOUR-API.onrender.com/api/webhooks/stripe`
4. Set `STRIPE_WEBHOOK_SECRET` to the **live** endpoint signing secret.

See also [DEPLOYMENT.md](./DEPLOYMENT.md).

## API routes (already implemented)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/billing` | Current plan, usage, Stripe config status |
| POST | `/api/billing/checkout` | Body: `{ "plan": "pro_monthly" \| "pro_yearly" }` → `{ url }` |
| POST | `/api/billing/portal` | Stripe Customer Portal URL |
| POST | `/api/billing/cancel` | Cancel at period end |
| POST | `/api/billing/resume` | Undo cancel |
| POST | `/api/billing/change-plan` | Switch monthly ↔ yearly |
| POST | `/api/webhooks/stripe` | Stripe webhook (raw body) |

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Billing page says Stripe not configured | Add all three: secret key + both price IDs to `backend/.env`, restart backend |
| Checkout works but plan stays Free | Run `stripe listen` and set `STRIPE_WEBHOOK_SECRET` |
| 503 on checkout | Missing or invalid Stripe env vars |
| Portal link fails | Enable Customer Portal in Stripe Dashboard |
| CORS / cookie issues in production | Set `FRONTEND_URL`, `COOKIE_SAME_SITE=none`, HTTPS on both domains |
