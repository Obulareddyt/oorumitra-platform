# OoruMitra — Deployment Process Steps

**Project:** OoruMitra Rural Marketplace  
**Stack:** Spring Boot 3.3 (Backend) · React 18 + Vite (Web) · React Native 0.73 (Android)  
**Database:** MariaDB on Hostinger  
**Last Updated:** June 2026

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Deploy Backend on Render](#2-deploy-backend-on-render)
3. [Deploy Web Frontend on Render](#3-deploy-web-frontend-on-render)
4. [Connect Domain via Cloudflare Tunnel](#4-connect-domain-via-cloudflare-tunnel)
5. [Generate Android APK](#5-generate-android-apk)
6. [Environment Variables Reference](#6-environment-variables-reference)
7. [Post-Deployment Checklist](#7-post-deployment-checklist)

---

## 1. Prerequisites

### Accounts Required
| Service | Purpose | URL |
|---------|---------|-----|
| GitHub | Source code hosting | github.com |
| Render | Backend + Web hosting | render.com |
| Hostinger | Database (MariaDB) | hpanel.hostinger.com |
| Cloudflare | DNS + Tunnel | cloudflare.com |
| MSG91 | SMS (OTP + notifications) | msg91.com |
| Google Cloud | Maps API | console.cloud.google.com |

### Local Tools Required
- Java 21+
- Maven 3.9+
- Node.js 20+
- Android Studio (for APK only)
- Android SDK with Build Tools 34+
- Git

---

## 2. Deploy Backend on Render

### Step 1 — Push Code to GitHub

```bash
# From project root
git add .
git commit -m "deploy: backend to render"
git push origin main
```

### Step 2 — Create a New Web Service on Render

1. Login to **render.com**
2. Click **New → Web Service**
3. Connect your GitHub repository
4. Select the repository: `OoruMitra` (or your repo name)

### Step 3 — Configure Build Settings

| Setting | Value |
|---------|-------|
| **Name** | `ooumitra-backend` |
| **Region** | Singapore (closest to India) |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | Java |
| **Build Command** | `mvn package -DskipTests` |
| **Start Command** | `java -jar target/ooru-mitra-backend-1.0.0.jar --spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MariaDBDialect` |
| **Instance Type** | Starter ($7/month) or higher |

### Step 4 — Set Environment Variables on Render

Go to **Environment** tab and add the following:

```
DB_URL=jdbc:mysql://in-mum-web679.main-hosting.eu:3306/u185240877_oorumitra?useSSL=true&allowPublicKeyRetrieval=true&serverTimezone=Asia/Kolkata&characterEncoding=UTF-8
DB_USERNAME=u185240877_samara
DB_PASSWORD=Oorumitra@2026#
JWT_SECRET=<generate a 64-char random string>
MSG91_AUTH_KEY=508655AXJoOkgf69e07f6eP1
MSG91_TEMPLATE_ID=6a3fe3e129dfc59d6e023f22
MSG91_NOTIFICATION_TEMPLATE_ID=<your-notification-template-id>
MSG91_SENDER_ID=OORMIT
GOOGLE_MAPS_API_KEY=AIzaSyAyeDx9i7LUnv70XaM6FmThbRyvCFDzB74
PORT=8080
```

> **Security note:** Never commit these values to Git. Render stores them encrypted.

### Step 5 — Deploy

1. Click **Create Web Service**
2. Render will run `mvn package -DskipTests` (~3-4 minutes)
3. After build: Flyway migrations V1–V8 run automatically on startup
4. Note your backend URL: `https://ooumitra-backend.onrender.com`

### Step 6 — Verify Backend

```
GET https://ooumitra-backend.onrender.com/actuator/health
```
Expected: `{"status":"UP"}`

---

## 3. Deploy Web Frontend on Render

### Step 1 — Update API Base URL

Edit `web/src/api/client.js`. When deploying, ensure the `baseURL` points to your Render backend:

```js
// For production, set VITE_API_URL in Render environment
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
})
```

Or use a proxy — simpler is to deploy frontend as a **Static Site** and set:

**`web/vite.config.js`** — no changes needed for static site (API calls go to the same domain via Cloudflare routing, or you set the full backend URL as `VITE_API_URL`).

### Step 2 — Create a Static Site on Render

1. Click **New → Static Site**
2. Connect the same GitHub repository
3. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `ooumitra-web` |
| **Branch** | `main` |
| **Root Directory** | `web` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

### Step 3 — Set Environment Variables

```
VITE_GOOGLE_MAPS_KEY=AIzaSyAyeDx9i7LUnv70XaM6FmThbRyvCFDzB74
VITE_API_URL=https://ooumitra-backend.onrender.com/api
```

### Step 4 — Handle SPA Routing

In the Render static site settings, add a **Redirect/Rewrite** rule:

| Source | Destination | Action |
|--------|------------|--------|
| `/*` | `/index.html` | Rewrite |

This ensures React Router deep links work (e.g., `/admin`, `/products/5`).

### Step 5 — Deploy

Click **Create Static Site**. Build takes ~1 minute.  
Your frontend URL: `https://ooumitra-web.onrender.com`

---

## 4. Connect Domain via Cloudflare Tunnel

This routes `oorumitra.tgvctechnologies.in` to your Render services.

### Option A — Point Domain to Render Directly (Recommended)

1. In Render, go to your **Web Service → Settings → Custom Domains**
2. Add `oorumitra.tgvctechnologies.in`
3. Render gives you a CNAME target (e.g., `ooumitra-web.onrender.com`)
4. In **Hostinger hPanel → DNS**:
   - Delete the existing A record for `oorumitra`
   - Add: `CNAME | oorumitra | ooumitra-web.onrender.com`

### Option B — Keep Cloudflare Tunnel (Current Setup)

The Cloudflare tunnel `bc7cbe72-4434-48f8-878a-724241e8af15` currently points to `localhost:3000`.

To update it to point to Render:
```bash
# Update tunnel config to point to Render backend
cloudflared tunnel route dns bc7cbe72-4434-48f8-878a-724241e8af15 oorumitra.tgvctechnologies.in
```

Edit `~/.cloudflared/config.yml`:
```yaml
tunnel: bc7cbe72-4434-48f8-878a-724241e8af15
credentials-file: /path/to/bc7cbe72-4434-48f8-878a-724241e8af15.json
ingress:
  - hostname: oorumitra.tgvctechnologies.in
    service: https://ooumitra-web.onrender.com
  - service: http_status:404
```

### DNS Records (Final State)

| Type | Name | Value |
|------|------|-------|
| CNAME | oorumitra | ooumitra-web.onrender.com |
| *(delete)* | A record for oorumitra | 82.25.125.204 — DELETE THIS |

---

## 5. Generate Android APK

### Prerequisites

- Android Studio installed
- Android SDK: API Level 34 (Android 14), Build Tools 34.0.0
- Java 17+ in PATH
- `ANDROID_HOME` environment variable set

### Step 1 — Set Up Android SDK Path

Create `mobile/android/local.properties`:
```properties
sdk.dir=C\:\\Users\\LENOVO\\AppData\\Local\\Android\\Sdk
```
*(Adjust path for your machine. This file is gitignored.)*

### Step 2 — Install Dependencies

```bash
cd mobile
npm install
```

### Step 3 — Generate a Release Keystore (First Time Only)

```bash
cd mobile/android/app

keytool -genkey -v \
  -keystore ooumitra-release.keystore \
  -alias ooumitra-key \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

You will be prompted for:
- Keystore password (save this securely)
- Key alias password (save this securely)
- Organisation details (name, city, country)

> **IMPORTANT:** Back up `ooumitra-release.keystore`. If lost, you cannot update the app on Play Store.

### Step 4 — Configure Signing in gradle.properties

Create `mobile/android/gradle.properties` (gitignored):
```properties
MYAPP_UPLOAD_STORE_FILE=ooumitra-release.keystore
MYAPP_UPLOAD_KEY_ALIAS=ooumitra-key
MYAPP_UPLOAD_STORE_PASSWORD=<your-keystore-password>
MYAPP_UPLOAD_KEY_PASSWORD=<your-key-password>
GOOGLE_MAPS_API_KEY=AIzaSyAyeDx9i7LUnv70XaM6FmThbRyvCFDzB74
```

### Step 5 — Set the Backend API URL

Edit `mobile/src/config/api.js` (or equivalent config file) and set:
```js
export const API_BASE_URL = 'https://ooumitra-backend.onrender.com/api'
```

### Step 6 — Build Debug APK (for Testing)

```bash
cd mobile/android
./gradlew assembleDebug
```

Output: `mobile/android/app/build/outputs/apk/debug/app-debug.apk`

Install on a connected device:
```bash
adb install app/build/outputs/apk/debug/app-debug.apk
```

### Step 7 — Build Release APK (for Distribution)

```bash
cd mobile/android
./gradlew assembleRelease
```

Output: `mobile/android/app/build/outputs/apk/release/app-release.apk`

> **Build time:** ~5-10 minutes first time (downloads Gradle dependencies)

### Step 8 — Build Release AAB (for Play Store)

Google Play Store requires AAB format:
```bash
cd mobile/android
./gradlew bundleRelease
```

Output: `mobile/android/app/build/outputs/bundle/release/app-release.aab`

### Step 9 — Share APK for Testing

The APK at `app-release.apk` can be shared directly:
- Via WhatsApp, email, or Google Drive
- Recipients install by enabling "Install from unknown sources" in Android Settings
- File size is typically 20-40 MB

---

## 6. Environment Variables Reference

### Backend (Render Environment / deploy/.secrets)

| Variable | Description | Example |
|----------|------------|---------|
| `DB_URL` | Hostinger MariaDB JDBC URL | `jdbc:mysql://in-mum-web679...` |
| `DB_USERNAME` | Database username | `u185240877_samara` |
| `DB_PASSWORD` | Database password | `Oorumitra@2026#` |
| `JWT_SECRET` | 64-char secret for JWT signing | Random string |
| `MSG91_AUTH_KEY` | MSG91 API key for OTP SMS | `508655AX...` |
| `MSG91_TEMPLATE_ID` | DLT template ID for OTP | `6a3fe3e1...` |
| `MSG91_NOTIFICATION_TEMPLATE_ID` | DLT template ID for approval SMS | Register in MSG91 |
| `MSG91_SENDER_ID` | 6-char sender ID | `OORMIT` |
| `GOOGLE_MAPS_API_KEY` | Google Maps API key | `AIzaSyAy...` |
| `PORT` | Server port (Render sets automatically) | `8080` |

### Web Frontend (Render Static Site / web/.env)

| Variable | Description | Example |
|----------|------------|---------|
| `VITE_GOOGLE_MAPS_KEY` | Google Maps API key (browser) | `AIzaSyAy...` |
| `VITE_API_URL` | Backend base URL | `https://ooumitra-backend.onrender.com/api` |

### Mobile (mobile/android/gradle.properties)

| Variable | Description |
|----------|------------|
| `MYAPP_UPLOAD_STORE_FILE` | Keystore filename |
| `MYAPP_UPLOAD_KEY_ALIAS` | Key alias |
| `MYAPP_UPLOAD_STORE_PASSWORD` | Keystore password |
| `MYAPP_UPLOAD_KEY_PASSWORD` | Key password |
| `GOOGLE_MAPS_API_KEY` | Google Maps key for Android |

---

## 7. Post-Deployment Checklist

### Backend
- [ ] `GET /actuator/health` returns `{"status":"UP"}`
- [ ] Flyway migrations V1–V8 applied (check Render logs)
- [ ] OTP SMS sending works (test with a real mobile number)
- [ ] File uploads work (images saved to local disk or S3)

### Web
- [ ] Home page loads correctly
- [ ] Login with OTP works
- [ ] Login with Username + Password works
- [ ] Post Ad form submits successfully
- [ ] Admin panel loads stats and pending listings
- [ ] Listing detail page opens with distance shown
- [ ] Google Maps autocomplete works in Post Ad location field

### Domain
- [ ] `https://oorumitra.tgvctechnologies.in` loads the app (not Hostinger default page)
- [ ] HTTPS certificate is valid (green padlock)
- [ ] A record for `oorumitra` deleted from Hostinger DNS

### Android APK
- [ ] App installs without errors
- [ ] Login screen loads
- [ ] API calls reach the production backend
- [ ] Maps and location features work
- [ ] Camera / image upload works

---

## Quick Reference — Local Development

```bash
# Start backend
cd deploy
./start-backend.ps1          # Windows PowerShell

# Start web
cd web
npx vite preview --port 3000 --host

# Start mobile (Android)
cd mobile
npx react-native start       # Metro bundler
npx react-native run-android # In another terminal
```

---

## Render Free Tier Limitation

Render's free tier spins down services after 15 minutes of inactivity. The first request after sleep takes ~30 seconds. To avoid this:
- Upgrade to **Starter plan ($7/month)** for always-on backend
- Or set up a free uptime monitor (e.g., UptimeRobot) to ping `/actuator/health` every 10 minutes
