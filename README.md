# Vinyasa Earth

Marketing site + content-managed admin panel for Vinyasa Earth, an art-residential
space in Amer, Jaipur. Built with Next.js 15 (App Router), Tailwind CSS v4,
Drizzle ORM on Neon Postgres, and Vercel Blob for image uploads.

Reference site: <https://www.vinyasa.earth/>

---

## Repository layout

This repo is nested. **The real application is `vinyasa/` inside the repo root**
(`.../Vinayasa/vinyasa/vinyasa`). Run every command below from that folder:

```
Vinayasa/
└─ vinyasa/            <- repo root (this README's parent points here)
   └─ vinyasa/         <- THE APP: package.json, next.config.mjs, src/, run npm here
```

---

## Quick start (local, zero external services)

`.env.local.example` defaults to `DATABASE_URL=pglite` — an embedded file-backed
Postgres, no signup, data stored in `./.pglite/`.

```bash
cd vinyasa/vinyasa            # the app folder
npm install
cp .env.local.example .env.local
npm run db:setup:local       # create ./.pglite and apply migrations
npm run db:seed              # seed content + first admin user
npm run dev                  # http://localhost:3000
```

Admin: <http://localhost:3000/admin/login> — `admin@vinyasa.earth` / `vinyasa-admin`
(from `.env.local`; change it at `/admin/settings`).

### Using a hosted database instead

Set `DATABASE_URL` to a Neon connection string, then `npm run db:migrate &&
npm run db:seed` (see "Deployment" below).

The public site renders even with **no database configured** — it falls back to
bundled seed content in `src/lib/content.ts`. The admin panel and all editing
need the database.

---

## Environment (`.env.local`)

| Variable | Required | What it is |
| --- | --- | --- |
| `DATABASE_URL` | for admin/CMS | Neon Postgres pooled connection string (`postgres://...neon.tech/neondb?sslmode=require`). Create a free project at <https://neon.tech>. |
| `BLOB_READ_WRITE_TOKEN` | for image uploads | Vercel dashboard → Storage → Blob → create store → **Read/Write token**. |
| `ADMIN_EMAIL` | for first login | Email for the first admin account. Used **only** by `npm run db:seed`. |
| `ADMIN_PASSWORD` | for first login | Password for that account. Used **only** by `npm run db:seed`; change it afterwards from `/admin/settings`. |
| `SESSION_SECRET` | yes | Long random string. Signs the admin session cookie **and** hashes visitor IPs for analytics. Generate: `openssl rand -hex 32`. |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | optional | Live payments. Leave unset and the booking flow uses a mock order that still completes end to end. |

---

## Admin login credentials

There are **no hard-coded credentials**. The first admin user is created by the
seed script from your `.env.local`:

- **Email** — whatever you set as `ADMIN_EMAIL` (the example file suggests
  `admin@vinyasa.earth`)
- **Password** — whatever you set as `ADMIN_PASSWORD`

Steps:

1. Put `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env.local`.
2. Run `npm run db:seed` (creates the row, hashed with bcrypt).
3. Go to **`/admin/login`** and sign in with those two values.
4. Change the password at **`/admin/settings`**. After that, `ADMIN_PASSWORD`
   in the env file is ignored (re-running `db:seed` will reset it, so remove it
   from production env once you've logged in).

Session lasts 8 hours, stored in the `vinyasa_admin_session` HTTP-only cookie.

To reset a forgotten password: set `ADMIN_PASSWORD` again in `.env.local` and
re-run `npm run db:seed` (it upserts the admin by email).

---

## Admin panel

All routes under `/admin` are gated by `src/middleware.ts` (redirects to
`/admin/login`); API routes re-check the session independently.

| Route | Purpose |
| --- | --- |
| `/admin` | Dashboard — visitors (30d / today), page views, bookings, **abandoned checkouts** (started, no payment after 15 min), contact-form count, top pages, recent activity |
| `/admin/contact` | Every enquiry from the contact / volunteer / corporate forms, with full details and message; filterable by source |
| `/admin/bookings` | All bookings and payment status |
| `/admin/blog` | Blog posts. Rich editor (TipTap): headings, **text colour**, bullet/number lists, quotes, **links anywhere**, **image upload**, **button blocks**. Publishes to `/blog`. |
| `/admin/stays` | Cottages (add / edit / reorder via `sort` / publish toggle), "More ways to visit" options, accessory partners. Renders `/stays`. |
| `/admin/events` | Events & Retreats — all fields + optional rich body. Renders `/events`. |
| `/admin/pages` | Editable copy for the Home, About and Contact pages (`site_content` table) |
| `/admin/settings` | Change password |

Editor HTML is sanitised with `isomorphic-dompurify` **on save and again on
render**. Uploaded images go to Vercel Blob; `next.config.mjs` whitelists that host.

---

## Content model

Public pages read through `src/lib/cms.ts` (cached with `unstable_cache` + tags).
Every getter falls back to the seed constants in `src/lib/content.ts` when the DB
is empty or unreachable, so the site never breaks.

| Table | Feeds |
| --- | --- |
| `cottages`, `visit_options`, `partners` | `/stays`, `/stays/[slug]` |
| `events` | `/events`, `/events/[slug]` |
| `blogs` | `/blog`, `/blog/[slug]` |
| `site_content` | Home / About / Contact copy |
| `bookings`, `leads` | `/admin/bookings`, `/admin/contact`, dashboard stats |
| `page_views` | dashboard analytics (path + hashed IP only) |
| `admin_users` | login |

Admin edits call `revalidateTag()` / `revalidatePath()`, so public pages update
within seconds. Detail pages use `export const revalidate = 300` (ISR, 5 min).

---

## Analytics

First-party, no third-party scripts. `src/components/page-view-tracker.tsx`
(mounted in the root layout) sends a beacon to `/api/track` on every route
change. The route stores the path plus an HMAC hash of the visitor IP — the raw
address is never written.

---

## Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Dev server (uses `.next-dev/`) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run db:generate` | Regenerate SQL migration from `src/lib/db/schema.ts` |
| `npm run db:migrate` | Apply migrations to `DATABASE_URL` |
| `npm run db:push` | Push schema without a migration file (dev only) |
| `npm run db:seed` | Seed content + first admin (idempotent; never overwrites edited rows) |

---

## Deployment (Vercel)

1. Add `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `SESSION_SECRET` (and Razorpay
   keys if used) to the Vercel project's Environment Variables. **Do not** keep
   `ADMIN_PASSWORD` there after the first seed.
2. Run `npm run db:migrate` once against the production `DATABASE_URL` (from your
   machine, or as part of the build command).
3. Run `npm run db:seed` once to create the admin user and seed content.
4. Deploy. Public pages are static / ISR; `/admin` and `/api/*` are dynamic.

---

## Tech stack

- **Next.js 15** App Router, React 19, TypeScript
- **Tailwind CSS v4**
- **Drizzle ORM** + **@neondatabase/serverless** (Neon Postgres)
- **@vercel/blob** — image storage
- **bcryptjs** — password hashing
- **TipTap 3** — rich text editor (`/admin` only, not shipped to the public site)
- **isomorphic-dompurify** — HTML sanitisation
- **react-hook-form** + **zod** — forms and validation
- **Razorpay** — payments (optional, mock fallback)

See `ADMIN_SETUP.md` for a shorter setup-only checklist.
