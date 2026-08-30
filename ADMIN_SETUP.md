# Vinyasa Earth — Admin panel & CMS setup

The site is now content-managed. Public pages read from a Postgres database and
fall back to bundled seed content when the DB is empty or unreachable, so the
site never breaks.

## 1. Provision services

| Service | Why | Env var |
| --- | --- | --- |
| [Neon](https://neon.tech) Postgres | all CMS + bookings + analytics data | `DATABASE_URL` (pooled connection string) |
| [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) | image uploads from the editor | `BLOB_READ_WRITE_TOKEN` |

## 2. `.env.local`

Copy `.env.local.example` → `.env.local` and fill in:

```
DATABASE_URL=postgres://...neon.tech/neondb?sslmode=require
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=pick-a-strong-one         # only used once, by db:seed
SESSION_SECRET=<openssl rand -hex 32>    # signs the admin cookie + hashes visitor IPs
```

## 3. Create the schema and seed content

```bash
npm run db:migrate     # creates all tables in Neon
npm run db:seed         # loads cottages / events / page copy + the first admin user
```

Re-running `db:seed` is safe — it never overwrites edited rows.

On Vercel, run `npm run db:migrate` once from your machine against the production
`DATABASE_URL` (or add it to the build command).

## 4. Use it

- **/admin/login** — sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- **/admin** — dashboard: visitors, page views, bookings, abandoned checkouts, contact-form count
- **/admin/contact** — every enquiry with full details (contact / volunteer / corporate forms)
- **/admin/bookings** — all bookings and their payment status
- **/admin/blog** — WordPress-style rich editor (headings, text colour, images, buttons, links anywhere) → publishes to `/blog`
- **/admin/stays** — cottages (add / edit / reorder / unpublish), "more ways to visit" options, accessory partners → renders `/stays`
- **/admin/events** — programmes with an optional rich body → renders `/events`
- **/admin/pages** — editable copy for Home / About / Contact
- **/admin/settings** — change password

## Notes

- Visitor tracking is first-party: `PageViewTracker` beacons each route change to
  `/api/track`, which stores the path + a hashed IP (never the raw address).
- Admin routes are gated by `src/middleware.ts`; API routes double-check the session.
- Uploaded images live in Vercel Blob; `next.config.mjs` whitelists that host.
- Editor HTML is sanitised on save **and** on render (`isomorphic-dompurify`).
