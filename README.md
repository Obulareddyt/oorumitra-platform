# OoruMitra — Rural Marketplace & Services Platform

OoruMitra connects rural communities with local workers, products, vehicles, and transport services — all in one place.

## Features

- **Worker Services** — Find skilled workers (harvesting, plumbing, electrical, mason, etc.)
- **Product Sales** — Buy/sell agricultural products, tools, and livestock
- **Vehicle Work** — Hire tractors and farm machinery by the acre
- **Transport** — Book trucks and transport vehicles by the km
- **Request Tickets** — Post service requests for workers to respond to
- **Real-time Chat** — STOMP/WebSocket messaging between buyers and sellers
- **Nearby Map** — Google Maps view of services within configurable radius
- **Emergency Services** — One-tap calling for police, ambulance, fire
- **Government Schemes** — PM-KISAN, e-NAM, Fasal Bima and more
- **Multi-language** — English, Telugu, Hindi, Tamil, Kannada
- **Voice Search** — Search in your local language

## Tech Stack

### Backend (`/backend`)
| Layer | Technology |
|-------|-----------|
| Runtime | Java 21, Spring Boot 3.3.0 |
| Database | PostgreSQL + Flyway migrations |
| Auth | OTP via MSG91, JWT (stateless) |
| Messaging | Spring WebSocket (STOMP/SockJS) |
| Storage | AWS S3 |
| Push | Firebase Cloud Messaging |
| HTTP Client | Spring WebFlux WebClient |
| Cache | Caffeine |
| Docs | Springdoc OpenAPI (Swagger UI) |

### Mobile (`/mobile`)
| Layer | Technology |
|-------|-----------|
| Framework | React Native 0.74.3 (Android + iOS) |
| Language | TypeScript |
| Navigation | React Navigation (Drawer + Bottom Tabs + Stack) |
| State | Redux Toolkit |
| HTTP | Axios (with JWT refresh interceptor) |
| i18n | i18next + react-native-localize |
| Maps | React Native Maps (Google Maps) |
| Chat | @stomp/stompjs over WebSocket |
| Voice | @react-native-voice/voice |
| Push | @react-native-firebase/messaging |

## Project Structure

```
OoruMitra/
├── backend/                  # Spring Boot REST API
│   ├── src/main/java/com/ooumitra/
│   │   ├── config/           # Security, Firebase, S3, WebSocket config
│   │   ├── controller/       # REST controllers
│   │   ├── dto/              # Request/response DTOs
│   │   ├── entity/           # JPA entities
│   │   ├── enums/            # Domain enums
│   │   ├── exception/        # Global exception handler
│   │   ├── repository/       # Spring Data JPA repositories
│   │   ├── security/         # JWT filter & utility
│   │   ├── service/          # Business logic
│   │   └── util/             # ApiResponse, SecurityUtils
│   └── src/main/resources/
│       ├── application.yml
│       └── db/migration/V1__initial_schema.sql
│
└── mobile/                   # React Native app
    ├── src/
    │   ├── components/       # Reusable cards and navigation components
    │   ├── i18n/             # Translations (EN/TE/HI/TA/KN)
    │   ├── navigation/       # App/Auth/Main navigators
    │   ├── screens/          # All 22 screens
    │   ├── services/         # API service layer
    │   ├── store/            # Redux store + auth slice
    │   ├── theme/            # Colors, spacing, typography
    │   └── types/            # TypeScript type definitions
    ├── App.tsx
    └── index.js
```

## Getting Started

### Backend

1. Start PostgreSQL and create database `oorumitra`
2. Copy `application.yml` and fill in:
   - DB credentials
   - MSG91 auth key + template ID
   - Firebase service account path
   - AWS S3 region, bucket, and credentials
   - Google Maps API key
3. Build and run:
   ```bash
   cd backend
   mvn package -DskipTests
   java -jar target/ooru-mitra-backend-1.0.0.jar
   ```
4. Swagger UI: `http://localhost:8080/swagger-ui.html`

### Mobile

```bash
cd mobile
npm install --legacy-peer-deps
# Android
npm run android
# iOS
npm run ios
```

## API Endpoints

| Resource | Base Path |
|----------|-----------|
| Auth (OTP) | `POST /api/auth/send-otp`, `/api/auth/register`, `/api/auth/login` |
| Workers | `GET/POST /api/workers`, `GET /api/workers/nearby` |
| Products | `GET/POST /api/products`, `GET /api/products/nearby` |
| Vehicle Work | `GET/POST /api/vehicle-work` |
| Transport | `GET/POST /api/transport` |
| Tickets | `GET/POST /api/tickets` |
| Chat | `GET /api/chats`, WebSocket `/ws` |
| Ratings | `POST /api/ratings` |
| Notifications | `GET /api/notifications` |
| Favourites | `GET/POST/DELETE /api/favourites` |
| Bookings | `GET /api/bookings/my`, `POST /api/bookings` |
| Emergency | `GET /api/emergency/services` |
| Profile | `GET/PUT /api/users/profile` |

## License


