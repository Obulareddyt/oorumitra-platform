# Deploying OoruMitra for Friend Testing (IP/Tunnel-Based)

This guide covers running OoruMitra on your own PC with a real PostgreSQL
database and exposing it to the internet via a free Cloudflare quick tunnel,
so friends anywhere can test it using a real `https://` URL — no domain, no
router configuration, no cloud hosting bill.

This is **not** the `render.yaml` cloud deployment (that's a separate,
always-on option). This guide is for ad-hoc testing where your own PC acts
as the server.

## What you get

- Real PostgreSQL persistence (not the in-memory H2 used in local dev) —
  data survives backend restarts.
- A real, randomly-generated JWT signing secret (not the placeholder
  committed in `application.yml`).
- A public HTTPS URL anyone can open, backed by your machine.
- Empty database — every account/listing friends create is genuine data,
  not seed fixtures.

## One-time setup

### 1. Install PostgreSQL

```powershell
winget install --id PostgreSQL.PostgreSQL.17 -e --accept-package-agreements --accept-source-agreements
```

This requires an admin/UAC prompt — run it from an elevated PowerShell
window. During setup you'll be asked to set a password for the `postgres`
superuser; remember it for the next step. Default port `5432` is fine.

### 2. Create the app's database and user

```powershell
$env:PGPASSWORD = "<the postgres superuser password you just set>"
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -f "deploy\setup-postgres.sql"
```

This creates a `ooumitra` database and `ooumitra` user matching
`application.yml`'s defaults — no `DB_URL`/`DB_USERNAME`/`DB_PASSWORD`
environment variables are needed afterward.

### 3. Install cloudflared (tunnel client)

```powershell
winget install --id Cloudflare.cloudflared -e --accept-package-agreements --accept-source-agreements --silent
```

No account or domain required for a "quick tunnel."

### 4. Build the backend

```powershell
cd backend
mvn -DskipTests package
```

## Every time you want to go live

Run these three in **separate terminals**, in order, and leave them running:

### 1. Start the backend

```powershell
.\deploy\start-backend.ps1
```

- Generates (or reuses) a real `JWT_SECRET`, cached in `deploy/.jwt-secret`
  (gitignored — never commit this file).
- Runs with **no** `--spring.profiles.active` flag, so it loads the base
  `application.yml` (Postgres + Flyway, `ddl-auto: validate`) — this is the
  production-style config, not the H2 `dev` profile.
- On first run, Flyway applies all migrations automatically against the
  empty database.
- Wait for `Started OoruMitraApplication` in the console before continuing.

### 2. Build and serve the web app

```powershell
.\deploy\start-web.ps1
```

- Runs `npm run build`, then `vite preview --host 0.0.0.0 --port 3000`.
- `vite preview` proxies `/api` to the backend (see `web/vite.config.js`
  `preview.proxy`), so the web app and API share a single origin — friends
  only ever need **one** URL.

### 3. Expose it to the internet

```powershell
.\deploy\start-tunnel.ps1
```

Prints a random `https://*.trycloudflare.com` URL after a few seconds —
that's the link to share with friends. Valid HTTPS is automatic.

**Note:** the URL changes every time the tunnel restarts. It's a free "quick
tunnel" with no uptime guarantee — fine for casual testing, not for anything
long-lived.

## Stable URL via a named tunnel (recommended once you have a domain)

Quick tunnels can drop and don't auto-recover with the same URL. If you own
a domain, use a **named tunnel** instead — it survives restarts and
reconnects automatically, giving friends one permanent link.

### One-time setup

1. Add your domain to a free Cloudflare account (dashboard → Add a Site →
   Free plan), then update your domain's nameservers at your registrar to
   the two Cloudflare gives you. Wait for the zone to show "Active" (can
   take minutes to a few hours for nameserver propagation).
2. Authenticate cloudflared with your account (opens a browser to
   authorize):
   ```powershell
   cloudflared tunnel login
   ```
3. Create the named tunnel and route a subdomain to it:
   ```powershell
   cloudflared tunnel create oorumitra
   cloudflared tunnel route dns oorumitra app.yourdomain.com
   ```
4. Fill in `deploy/cloudflared-config.yml` with the tunnel ID and
   credentials file path printed by `tunnel create`, and your hostname.

### Running it

```powershell
cloudflared tunnel --config deploy/cloudflared-config.yml run oorumitra
```

This replaces `start-tunnel.ps1` for long-term use — same backend/web setup,
just a permanent hostname instead of a random one.

## Bootstrapping the first admin account

`DevDataInitializer` (which seeds a dev admin + sample listings) only runs
under the `dev` profile — this production-style database starts completely
empty. To make your own account an admin:

1. Open the app (your tunnel URL), tap **Register**, sign up with your real
   mobile number.
2. Since no SMS provider is configured yet, the OTP is printed to the
   backend console instead of being texted — look for a line like:
   ```
   [OTP-FALLBACK] No SMS provider configured — OTP for <mobile>: <code>
   ```
3. Promote that account to admin (one-time):
   ```powershell
   $env:PGPASSWORD = "ooumitra123"
   & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U ooumitra -h localhost -d ooumitra `
     -c "UPDATE users SET role='ADMIN' WHERE mobile_number='<your mobile>';"
   ```
4. Log out and back in (or just refresh) — the "Admin Panel" link now
   appears in the account dropdown, and `/admin` shows the approval queue
   for every new listing your friends create.

## OTP delivery for friends (until you set up real SMS)

Without an MSG91 account, OTPs aren't actually texted — they're logged to
your backend console (the same `[OTP-FALLBACK]` line as above). Until you
configure a real SMS provider, **you'll need to relay codes manually**: a
friend taps "Send OTP," you read the code off your terminal, and message it
to them.

To switch to real SMS once you have an MSG91 account:

```powershell
$env:MSG91_AUTH_KEY = "<your real key>"
$env:MSG91_TEMPLATE_ID = "<your real template id>"
.\deploy\start-backend.ps1
```

The console fallback automatically stops logging OTPs as soon as
`MSG91_AUTH_KEY` is no longer the placeholder default — no code changes
needed.

## Shutting down

Stop (Ctrl+C) the three terminals in reverse order: tunnel, web, backend.
PostgreSQL itself runs as a Windows service and can stay running.

## Known limitations of this setup

- **Your PC must stay on and awake** the whole time — there's no cloud
  uptime here.
- **The tunnel URL is not permanent** — re-share it if you restart
  `start-tunnel.ps1`.
- **OTP relay is manual** until MSG91 is configured.
- **No image upload (S3) / push notifications (Firebase) / Maps** unless
  you also set `AWS_*`, `FIREBASE_SERVICE_ACCOUNT_JSON`, and
  `GOOGLE_MAPS_API_KEY` — these gracefully no-op without them (listings just
  won't have photos/maps/push alerts).
