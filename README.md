# Hex Healing Hub

One Next.js app (App Router) serving the public website **and** the admin dashboard.

```
app/
  (site)/         public pages: home, about, services, portfolio, blog, contact
  (admin)/login   admin sign-in
  (admin)/admin   dashboard: overview, inquiries, blogs, services, gallery, users, account
  api/admin/      authenticated API (image upload signing)
features/         feature code per area: components, thin server actions, service classes (*.service.ts)
features/shared/server/container.ts   wires the services together (one instance per server process)
components/ui/    shadcn/ui components (dashboard only)
prisma/           schema, migrations, seed
proxy.ts          redirects signed-out visitors away from /admin
```

- **Content** (services, blog posts, portfolio gallery) lives in PostgreSQL via Prisma and is edited at `/admin`. Saving in the dashboard refreshes the public pages immediately.
- **Contact form** saves each inquiry to the database and emails `INQUIRY_NOTIFY_TO`. If email fails, the inquiry is still saved.
- **Images** upload from the dashboard straight to Cloudflare R2 using short-lived signed URLs.
- **Auth**: users live in the database; sessions are a signed, HTTP-only cookie (8 hours) re-checked against the database on every request, so removing a user or changing a password takes effect immediately.
- **Users**: the owner (superadmin) account is created only by `pnpm db:seed` from `SUPERADMIN_*` env vars. It is invisible to other admins and can't be deleted from the dashboard. Any signed-in user can add admins at `/admin/users`; everyone changes their own password at `/admin/account`.

## Local setup

```bash
pnpm install
cp .env.example .env            # then fill it in (see below)
pnpm admin:hash "a-long-password"   # owner password: paste the printed line into .env
pnpm db:migrate                 # creates tables
pnpm db:seed                    # creates the owner account + launch content (only into empty tables)
pnpm dev
```

Sign in at <http://localhost:3000/login>.

## Environment variables

See `.env.example` for every variable with a description. Required: the `DB_*` connection vars (or a `DATABASE_URL`, which wins; handy in `.env.local` for a local database), `SITE_URL`, `SUPERADMIN_EMAIL`, `SUPERADMIN_PASSWORD_HASH`, `SESSION_SECRET`. Use `pnpm db:migrate` / `pnpm db:deploy` rather than calling `prisma` directly: they build the connection URL from the `DB_*` vars. R2 and SMTP variables are optional in development: without R2, uploads show a clear "not configured" message; without SMTP, inquiries are saved but no email is sent.

`SUPERADMIN_PASSWORD_HASH` must keep its `\$` escapes (Next.js expands `$VAR` in env files). `pnpm admin:hash` prints it already escaped. To change the owner's email or password later: update the env vars and run `SUPERADMIN_RESET=1 pnpm db:seed` (this also signs the owner out everywhere).

## Cloudflare R2 setup

1. Create a bucket and enable public access (an `r2.dev` URL or a custom domain). Put that URL in `R2_PUBLIC_BASE_URL`.
2. Create an R2 API token with **Object Read & Write** on that bucket; set `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`.
3. Add a CORS policy to the bucket so the browser can upload directly:

```json
[
  {
    "AllowedOrigins": ["https://yourdomain.com", "http://localhost:3000"],
    "AllowedMethods": ["PUT"],
    "AllowedHeaders": ["Content-Type"],
    "MaxAgeSeconds": 3600
  }
]
```

`R2_PUBLIC_BASE_URL` is read at build time to allow its host in `next/image`, so rebuild after changing it.

## VPS deployment (Docker)

Same setup as slv-backend: GitHub Actions builds the image, pushes it to Docker Hub (`webxnepal/hex-healing-hub`), then SSHes into the VPS and restarts the container. The app joins the shared `webx-net` network and talks to `webx-postgres` / `webx-redis`.

### 1. Shared Postgres + Redis (once per VPS; skip if slv-backend's are already running)

```bash
docker network create webx-net
cd deploy && cp .env.example .env    # POSTGRES_USER / POSTGRES_PASSWORD (server superuser)
docker compose up -d && docker compose ps
```

### 2. Database for this app

```bash
HEX_DB_PW=$(openssl rand -hex 24)   # goes into DB_PASSWORD
docker exec -i webx-postgres psql -U webxuser -d postgres -v ON_ERROR_STOP=1 -v pw="$HEX_DB_PW" <<'SQL'
CREATE ROLE hex_user LOGIN PASSWORD :'pw';
CREATE DATABASE hexdb OWNER hex_user;
REVOKE ALL ON DATABASE hexdb FROM PUBLIC;
GRANT CONNECT, TEMPORARY ON DATABASE hexdb TO hex_user;
\c hexdb
ALTER SCHEMA public OWNER TO hex_user;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO hex_user;
SQL
```

### 3. App env on the VPS

Create `/var/www/hex-healing-hub/.env` from `.env.example` (`DB_USER=hex_user`, `DB_PASSWORD`, `DB_NAME=hexdb`, `SESSION_SECRET`, `SUPERADMIN_*`, R2, SMTP). `DB_HOST` / `REDIS_HOST` are set by `docker-compose.yml`.

Docker reads this file, not Next.js, so put values containing `$` (the password hash, passwords) in **single quotes, unescaped**: `SUPERADMIN_PASSWORD_HASH='$2b$12$...'`.

### 4. GitHub repository settings

- Secrets: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `VPS_HOST`, `VPS_USER`, `SSH_PRIVATE_KEY`
- `SITE_URL` and `R2_PUBLIC_BASE_URL` are needed at build time and come from the committed `.env.production` (public values only). Keep them in sync with the server's `.env`.

Push to `main` → typecheck + lint → image build → deploy. On every start the container applies pending migrations and runs the seed (creates the owner and launch content only if missing), then starts Next.js on `127.0.0.1:3010`.

### 5. Nginx

Proxy the domain to `http://127.0.0.1:3010`, set up SSL with certbot, and forward the client IP (`proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`) so rate limits apply per visitor.

Public pages render per request from the database, so the image builds without one and content edits show up immediately.

### Backups

```bash
docker exec webx-postgres pg_dump -U webxuser -Fc hexdb > /var/backups/hexdb-$(date +%F).dump
# restore: docker exec -i webx-postgres pg_restore -U webxuser -d hexdb --clean < file.dump
```

## Media licensing

Homepage background videos (`public/videos/scene-1..5.mp4`) are from [Mixkit](https://mixkit.co), clips 3350, 4148, 4281, 4040 and 4999, all under the **Mixkit Stock Video Free License** (free for commercial use, no attribution required). They were re-encoded as forward-and-reverse seamless loops. Mixkit items under the *Restricted* license were deliberately avoided.
