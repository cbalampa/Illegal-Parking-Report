# Illegal Parking Report Web Application [![eng](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/cbalampa/Illegal-Parking-Report/blob/main/README.md)

A full-stack civic web application that allows citizens to report illegal parking violations and enables administrators to manage and resolve those reports.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite), React Router |
| Backend | Spring Boot 4.x, Java 21 |
| Database | PostgreSQL 16 |
| ORM | Spring Data JPA / Hibernate |
| Auth | Spring Security + JWT (JJWT 0.12.6) |
| Image Upload | Cloudinary |
| Geocoding | Photon (Komoot) |
| Containerization | Docker / Docker Compose |

---

## Project Structure

```
├── docker-compose.yml              # PostgreSQL container setup
├── init.sql                        # Database schema + seed data
├── pom.xml                         # Maven dependencies
├── application.properties          # Spring Boot configuration
│
├── src/main/java/com/traffichq/backend/
│   ├── config/                     # Security, CORS, JWT, Cloudinary config
│   ├── controller/                 # REST controllers (Auth, Report, Vehicle)
│   ├── dto/                        # Request/Response DTOs
│   ├── entity/                     # JPA entities (User, Report, Vehicle)
│   ├── enums/                      # UserRole, ReportStatus, ViolationType
│   ├── repository/                 # Spring Data JPA repositories
│   ├── security/                   # JWT filter, UserDetailsService
│   └── service/                    # Business logic (Auth, Report, Cloudinary)
│
└── src/main/frontend/
    ├── api/                        # Axios API clients (reportApi, userApi)
    ├── context/                    # AuthContext (JWT + user state)
    ├── components/
    │   └── AddressAutocomplete.jsx # Geocoding address picker
    └── pages/
        ├── LoginPage.jsx
        ├── RegisterPage.jsx
        ├── CitizenPage.jsx         # Report submission form
        └── AdminPage.jsx           # Admin dashboard
```

---

## Database Schema

The application uses **PostgreSQL 16** with three core tables:

- **`users`** — stores citizens and admins with bcrypt-hashed passwords and a `user_role` ENUM (`CITIZEN`, `ADMIN`)
- **`reports`** — stores parking violation reports with location coordinates, violation type, photo URL and a `report_status` ENUM (`PENDING`, `IN_PROGRESS`, `FULFILLED`, `DECLINED`)
- **`vehicles`** — stores registered vehicle info (license plate, owner, make/model/color) for admin lookups

Automatic `updated_at` timestamps are managed via PostgreSQL triggers.

---

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Java 21
- Maven 3.9+
- Node.js 20+ (for the frontend)

### 1. Start the Database

Copy the provided example file and fill in your values:

```bash
cd backend
cp docker-compose.yml.example docker-compose.yml
```

```docker-compose.yml
environment:
  POSTGRES_USER: your_db_username
  POSTGRES_PASSWORD: your_db_password
  POSTGRES_DB: your_db_name
```

```bash
docker-compose up -d
```

This will spin up a PostgreSQL 16 container on port `5432`, create the `parking_reports` database and run `init.sql` to initialize the schema and seed data.

### 2. Configure the Application

Copy the provided example file and fill in your values:

```bash
cd backend
cp .env.example .env
```

```env
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Run the Backend

```bash
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080`.

### 4. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Default Credentials (Dev Only)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@traffichq.gov` | `admin123` |
| Citizen | `john.doe@email.com` | *(see init.sql)* |
| Citizen | `maria.smith@email.com` | *(see init.sql)* |

> These are seeded by `init.sql` for testing purposes only. Passwords are bcrypt-hashed.

---

## Key Features

**Citizens can:**
- Register and log in securely
- Submit parking violation reports with an address (autocompleted via Photon geocoding), violation type, optional photo and description
- View confirmation upon successful submission

**Admins can:**
- View all submitted reports in a sortable, filterable table
- See vehicle owner information if the license plate is registered
- Update report statuses (`PENDING` → `IN_PROGRESS` → `FULFILLED` / `DECLINED`)
- View photo evidence via Cloudinary-hosted URLs

---

## API Overview

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register a new citizen account |
| POST | `/api/auth/login` | Public | Authenticate and receive a JWT |
| POST | `/api/reports` | CITIZEN | Submit a new parking violation report |
| GET | `/api/reports` | ADMIN | Retrieve all reports |
| PATCH | `/api/reports/{id}/status` | ADMIN | Update a report's status |

Authentication is handled via Bearer tokens in the `Authorization` header.

---

## Environment Notes

- `spring.jpa.hibernate.ddl-auto=validate` — Hibernate validates the schema against `init.sql` on startup (it does **not** auto-create or modify tables).
- File uploads are capped at **10MB** per file and per request.
- The Photon geocoding API requires no API key and biases results toward the user's typed input with a 350ms debounce.

---

## Preview
<p align="center">
<img width="1366" height="581" alt="Parking-Report-Admin-Dashboard-Preview" src="https://github.com/user-attachments/assets/d3434ef2-316d-47e8-b928-13af127202b8" />
</p>

## Roadmap / To Be Done

Features planned or considered for future iterations:

- **Email verification on registration** — Send a confirmation email upon sign-up and require verification before allowing login
- **Fine notifications via email** — Automatically email the registered vehicle owner when a report against their plate is fulfilled, including violation details and any applicable fine information
- **Duplicate report detection** — Detect and flag (or merge) reports that share the same license plate, violation type, and location within a short time window to avoid redundant entries
- **Citizen report history** — Allow citizens to view their own past submissions and track the status of each report from their account page
- **Admin statistics dashboard** — Visualize report trends over time (by status, violation type, location, etc.) with charts and summary metrics
- **Pagination & search** — Add server-side pagination and keyword/plate search to the admin reports table for scalability
- **Push / in-app notifications** — Notify citizens in real time when the status of one of their reports changes

---
