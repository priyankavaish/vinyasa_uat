# Vinyasa UAT

This repository and its `vinyasa-uat` Vercel project are separate from production.

- Git source: `priyankavaish/vinyasa_uat`, branch `main`.
- Database: independent `vinyasa-uat-db` Neon project, free plan.
- Uploaded files: independent `vinyasa-uat-uploads` Blob store.
- CMS pages, stays, events, blog posts and content start from a read-only production snapshot.
- Production admin accounts, bookings, enquiries, notification history and email credentials are excluded.
- A separate admin account and session secret are created for UAT. Login details are handed over privately.
- `UAT_MODE=true` disables indexing and sends hosted payment buttons to a clearly labelled local payment simulation.
- Live payment keys and live email credentials are not configured. Testing these integrations requires dedicated test credentials.
- Only pushes to this repository deploy this UAT project. UAT admin edits only write its own database.

Do not connect production's `DATABASE_URL`, Blob token, session secret or email/payment credentials to this project. Do not mirror or merge client test changes to production automatically.
