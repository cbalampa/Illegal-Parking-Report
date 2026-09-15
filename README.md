# Illegal Parking Report Web Application [![eng](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/cbalampa/Illegal-Parking-Report/blob/main/README.md)

A full-stack civic web application that allows citizens to report illegal parking violations and enables administrators to manage and resolve those reports. 

The project demonstrates a complete web development workflow using React, Spring Boot, PostgreSQL, authentication, REST APIs, and database-driven application design.

## 📑 Table of Contents

- [Tech Stack](#%EF%B8%8F-tech-stack)
- [Project Structure](#-project-structure)
- [Database Schema](#%EF%B8%8F-database-schema)
- [Key Features](#-key-features)
- [Application Flow](#-application-flow)
- [Getting Started](#-getting-started)
- [API Overview](#-api-overview)
- [Preview](#-preview)
- [Roadmap / To Be Done](#-roadmap--to-be-done)
- [License](#-license)

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite), React Router |
| Backend | Spring Boot 4.x, Java 21 |
| Database | PostgreSQL 16 |
| ORM | Spring Data JPA / Hibernate |
| Auth | Spring Security + JWT (JJWT 0.12.6) |
| Image Upload | Cloudinary |
| Geocoding | Photon (Komoot) |
| Containerization | Docker Compose |

## 📁 Project Structure

<details open>
<summary>Click to expand</summary>

```text
├── docker-compose.yml.example      # Multi-container setup
├── init.sql                        # Database schema + seed data
│
├── env/
│   ├── backend.env.example         # Backend environment variables
│   └── postgres.env.example        # PostgreSQL environment variables
│
├── backend/
│   ├── Dockerfile                  # Backend container image
│   ├── config/                     # Security, CORS, JWT, Cloudinary config
│   ├── controller/                 # REST controllers (Auth, Report, Vehicle)
│   ├── dto/                        # Request/Response DTOs
│   ├── entity/                     # JPA entities (User, Report, Vehicle)
│   ├── enums/                      # UserRole, ReportStatus, ViolationType
│   ├── repository/                 # Spring Data JPA repositories
│   ├── security/                   # JWT filter, UserDetailsService
│   ├── service/                    # Business logic (Auth, Report, Cloudinary)
│   ├── pom.xml                     # Maven dependencies
│   └── application.properties      # Spring Boot configuration
│
└── frontend
    ├── Dockerfile                  # Frontend container image
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
</summary>
</details>

## 🗄️ Database Schema

The application uses **PostgreSQL 16** with three core tables:

- **`users`** — stores citizens and admins with bcrypt-hashed passwords and a `user_role` ENUM (`CITIZEN`, `ADMIN`)
- **`reports`** — stores parking violation reports with location coordinates, violation type, photo URL and a `report_status` ENUM (`PENDING`, `IN_PROGRESS`, `FULFILLED`, `DECLINED`)
- **`vehicles`** — stores registered vehicle info (license plate, owner, make/model/color) for admin lookups

Automatic `updated_at` timestamps are managed via PostgreSQL triggers.

## ✨ Key Features

**Citizens can:**
- Register and log in securely
- Submit parking violation reports with:
    - an address (autocompleted via Photon geocoding)
    - violation type
    - optional photo
    - and description
- View confirmation upon successful submission

**Admins can:**
- View all submitted reports in a sortable, filterable table
- See vehicle owner information if the license plate is registered
- Update report statuses (`PENDING` → `IN_PROGRESS` → `FULFILLED` / `DECLINED`)
- View photo evidence via Cloudinary-hosted URLs

## 🔄 Application Flow

1. A citizen creates an account and authenticates through the backend API.
2. The backend issues a JWT token used for authenticated requests.
3. The citizen submits a parking violation report through the React frontend.
4. The backend validates the request, stores the report in PostgreSQL, and uploads images through Cloudinary.
5. Administrators access the dashboard to review reports and update their status.

## 🚀 Getting Started

### Prerequisites

- Docker
  - [Installation instructions](https://docs.docker.com/desktop/)
- A Cloudinary setup
  - [Create a Cloudinary account](https://cloudinary.com/)

### 1. Configure Docker Compose

Create a local copy of the compose file:

```bash
cp docker-compose.yml.example docker-compose.yml
```

### 2. Configure Environment Variables

Create the required environment files from the provided examples:

```bash
cp env/postgres.env.example env/postgres.env
cp env/backend.env.example env/backend.env
```
Update the values in `env/postgres.env`:

```
POSTGRES_DB=<postgres.database>
POSTGRES_USER=<postgres.username>
POSTGRES_PASSWORD=<postgres.password>
```

Update the values in `env/backend.env`:

```
DB_NAME=<database.name>
DB_HOST=<database.host>

DB_USERNAME=<database.username>
DB_PASSWORD=<database.password>

JWT_SECRET=<jwt.secret>

CLOUDINARY_CLOUD_NAME=<cloudinary.cloud.name>
CLOUDINARY_API_KEY=<cloudinary.api.key>
CLOUDINARY_API_SECRET=<cloudinary.api.secret>
```

> [!NOTE]
> `DB_USERNAME`, `DB_PASSWORD`, and `DB_NAME` should match the corresponding PostgreSQL values defined in `postgres.env`.

#### Generate a JWT Secret

You can generate a random JWT secret using openssl: 

```bash
openssl rand -base64 64
```

Alternatively, you can use any sufficiently long randomized string as your `JWT_SECRET`.

#### Configure Cloudinary

Create a Cloudinary account and project, then retrieve the following values from your Cloudinary dashboard:
- Cloud Name
- API Key
- API Secret

Add them to `env/backend.env`.

### 3. Start the Containers

Start the application with Docker Compose:

```bash
docker compose up -d
```

> [!NOTE]
> Docker Compose will start the PostgreSQL, backend, and frontend containers. The PostgreSQL container executes `init.sql` to initialize the database schema and seed data.

The application will be available at:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080`

#### Demo Administrator Account

The database is initialized with a demo administrator account:

```text
Email:    admin@traffichq.gov
Password: admin123
```

### 4. Stop the Containers

To stop the application:

```bash
docker compose down
```

To stop the containers and remove the PostgreSQL volume, forcing the database to be initialized again on the next startup:

```bash
docker compose down -v
```

> [!WARNING]
> Removing the PostgreSQL volume will permanently delete the database data stored in that volume.

## 📡 API Overview

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register a new citizen account |
| POST | `/api/auth/login` | Public | Authenticate and receive a JWT |
| POST | `/api/reports` | CITIZEN | Submit a new parking violation report |
| GET | `/api/reports` | ADMIN | Retrieve all reports |
| PATCH | `/api/reports/{id}/status` | ADMIN | Update a report's status |

Authentication is handled via Bearer tokens in the `Authorization` header.

## 🔎 Preview
<p align="center">
<img width="1366" height="581" alt="Parking-Report-Admin-Dashboard-Preview" src="https://github.com/user-attachments/assets/d3434ef2-316d-47e8-b928-13af127202b8" />
</p>

<p align="center">
<img width="1347" height="610" alt="Parking-Report-User-Dashboard-Preview" src="https://github.com/user-attachments/assets/067e83a1-fa26-4a3c-92fc-a496b8b1c455" />
</p>

## 📌 Roadmap / To Be Done

Features planned or considered for future iterations:

- **Email verification on registration** — Send a confirmation email upon sign-up and require verification before allowing login
- **Fine notifications via email** — Automatically email the registered vehicle owner when a report against their plate is fulfilled, including violation details and any applicable fine information
- **Duplicate report detection** — Detect and flag (or merge) reports that share the same license plate, violation type, and location within a short time window to avoid redundant entries
- **Citizen report history** — Allow citizens to view their own past submissions and track the status of each report from their account page
- **Admin statistics dashboard** — Visualize report trends over time (by status, violation type, location, etc.) with charts and summary metrics
- **Pagination & search** — Add server-side pagination and keyword/plate search to the admin reports table for scalability
- **Push / in-app notifications** — Notify citizens in real time when the status of one of their reports changes

## 📄 License

This project is licensed under the MIT License.
