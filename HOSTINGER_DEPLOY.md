# Hostinger par live karne ki guide

Ye guide client ke Hostinger account par app chalane ke liye hai. Vercel ya developer ke kisi account par dependency nahi honi chahiye.

Hostinger ke hPanel ke menu naam plan aur screen ke hisaab se thode alag ho sakte hain. Jo step samajh na aaye, woh screenshot ke saath poochh lo.

## 0. Pehle ye confirm karo

- Hostinger plan mein **Node.js web app** option hai (hPanel mein "Node.js" ya "Websites > Add website > Node.js").
- App ke liye Node **24.x** chahiye (`package.json` mein `engines.node` aur `.nvmrc` dono 24 bolte hain). Agar hPanel mein 24 nahi mila toh developer se baat karo.

## 1. Backup lo (sabse pehle)

1. **WordPress ka backup:** hPanel > Websites > WordPress site > Backups (ya "Backup" option). Full backup (files + database) download karke safe jagah rakho.
2. **Current Neon database ka dump** (agar data hai): Neon dashboard > project > Connection details se connection string lo, phir `pg_dump` se file banao. Developer ye kar sakta hai.
3. **Uploads folder** (purani site ki images): abhi ye app ke `uploads/` folder mein hain. Backup lo.

## 2. Database banao (client ke account mein)

1. Neon (https://neon.tech) par client ke naam se free account banao.
2. Naya project banao, region **Asia Pacific (Mumbai/Singapore)** chuno.
3. Connection string copy karo. Ye **pooled** wali ho, aur `sslmode=require` ke saath.
4. Agar purana data hai, toh backup file ko is naye database mein restore karo (`psql` ya developer ki madad se).

## 3. Razorpay aur email keys (client ke account se)

- **Razorpay:** client ka Razorpay account. Dashboard > Settings > API Keys se `Key ID` aur `Key Secret` lo. Webhook banao aur uska secret `RAZORPAY_WEBHOOK_SECRET` mein daalo.
- **Email (Gmail):** client ke Gmail par 2-Step Verification on karo, phir App Password banao. Woh `SMTP_PASSWORD` mein jayega.
- **Admin login:** ek email aur strong password decide karo. `ADMIN_EMAIL` aur `ADMIN_PASSWORD`.

## 4. Environment variables

Hostinger Node.js app ki settings mein ye variables daalo. Values ko kisi file mein mat likho, aur git par mat dalo.

| Variable | Kya daalna hai |
|---|---|
| `DATABASE_URL` | Neon pooled connection string (step 2) |
| `SITE_ORIGIN` | `https://vinyasa.earth` (zaroori hai, warna sitemap aur links purane domain par jayenge) |
| `SESSION_SECRET` | Random lamba string. Banane ka tarika: `openssl rand -hex 32` |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin password (pehli baar seed ke liye) |
| `RAZORPAY_KEY_ID` | Razorpay key id |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Same key id, public |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook secret |
| `SMTP_USER` | Gmail address |
| `SMTP_PASSWORD` | Gmail App Password |
| `EMAIL_FROM` | Jo naam aur email se mail jaaye, jaise `Vinyasa Earth <client@gmail.com>` |
| `NODE_ENV` | `production` |

**Ye variable mat daalna:** `BLOB_READ_WRITE_TOKEN` (Vercel Blob hai, Hostinger par zaroori nahi). Uploads `uploads/` folder mein save honge.

## 5. App deploy karo

Hostinger Node.js app setup mein ye commands chahiye honge:

1. **Source:** GitHub repo `https://github.com/priyankavaish/vinyasa` (branch `main`). Agar repo private hai toh Hostinger ko access dena padega, ya zip upload karo.
2. **Install:** `npm ci`
3. **Build:** `npm run build`
4. **Start:** `npm start`
5. **Port:** Hostinger jo port de, woh Next.js ko `PORT` env se milna chahiye. Agar `npm start` port nahi uthata toh `npm start -- -p $PORT` try karo.

## 6. Database tables aur admin user

App ke pehle start se pehle, server par ye chalana hoga (ek baar):

```
npm run db:migrate
```

Agar database khali hai aur admin user chahiye:

```
npm run db:seed
```

Note: `db:seed` sirf naye database par chalao. Blog posts ke liye koi alag command nahi chahiye, woh pehle request par apne aap aate hain.

## 7. Uploads folder

- Hostinger par `uploads/` folder hona chahiye aur write permission honi chahiye.
- Purani uploads ki backup files wahan copy karo.
- Hostinger par ye folder restart ke baad bhi bacha rehna chahiye, ye Hostinger plan par confirm karo.

## 8. Domain (DNS) badlo

**Bahut zaroori:** sirf website wale records badlo. **MX, SPF (TXT), DKIM** records mat chhedo, warna mail band ho jayega.

1. Hostinger hPanel > Domains > DNS zone.
2. Purane **A** record (`@`) aur **CNAME** (`www`) ko Hostinger Node.js app ke IP / target par point karo. Hostinger jo value dikhaye woh use karo.
3. MX, TXT (SPF, DKIM) records same rahne do.
4. DNS badalne ke baad 1 se 24 ghante lag sakte hain. Hostinger SSL (HTTPS) apne aap set kare, woh enable karo.

## 9. Check karo

- `https://vinyasa.earth` khule, aur `/blogs` par 5 posts dikhein.
- `/admin` par admin login ho.
- Ek test booking aur payment (Razorpay test mode pehle).
- Contact form submit karo aur mail aaye.
- `https://vinyasa.earth/sitemap.xml` purane domain ke bajay `vinyasa.earth` URLs dikhaye.

## Rollback

Agar kuch atak jaye, DNS ko purani WordPress site par wapas point karo. WordPress backup safe hai.
