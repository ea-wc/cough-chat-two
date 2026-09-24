# TeleHealth — Telehealth MVP

A functional prototype of a telehealth web application: a public product landing page plus
role-based **Patient**, **Doctor**, and **Admin** interfaces. Patients register, find a doctor,
book a consultation, connect online, and view their records. Doctors manage availability,
consultations, notes, and prescriptions. Admins oversee accounts, doctor profiles,
appointments, metrics, and audit activity.

> **Fictional prototype** — this application is for demonstration only and is not a real
> medical service. It does not provide medical advice, diagnosis, or treatment.

## Tech stack

| Layer     | Technology                          |
| --------- | ----------------------------------- |
| Frontend  | Next.js (App Router) + TypeScript   |
| Backend   | NestJS + TypeScript                 |
| API       | REST + JSON over HTTP               |
| Database  | PostgreSQL via Prisma ORM           |
| Package   | pnpm (workspace)                    |
| Local run | Docker Compose                      |

Every core feature is implemented in the application itself — no SaaS, BaaS, or external
runtime APIs (no external auth, matching, notifications, storage, scheduling, or conferencing).

## Repository layout

```
apps/
  web/          Next.js frontend (app router)
  api/          NestJS backend (REST API, Prisma)
openspec/       Spec-driven development artifacts (changes, specs)
docker-compose.yml
pnpm-workspace.yaml
```

## Prerequisites

- Node.js 20.19+
- pnpm 12
- Docker + Docker Compose (for the one-command local run)

## Quick start (Docker Compose)

```bash
docker compose up --build
```

This starts three services:

- **web** — Next.js app at http://localhost:3000
- **api** — NestJS API at http://localhost:4000/api
- **postgres** — PostgreSQL at `localhost:5432` (database `telehealth`)

On startup the API applies the schema (`prisma db push`) and seeds the database.

## Local development (without Docker)

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Start PostgreSQL and create the database:

   ```bash
   createdb telehealth
   ```

3. Configure the API (`.env` is checked in for local dev). If your local Postgres
   uses a different role than `postgres:postgres` (e.g. Homebrew's default trust
   auth for your macOS user), adjust `DATABASE_URL` in `apps/api/.env`, for example:

   ```
   DATABASE_URL="postgresql://<your-user>@localhost:5432/telehealth?schema=public"
   ```

   ```bash
   cd apps/api
   pnpm db:push      # apply the schema
   pnpm db:seed      # seed admin, sample doctors, and a demo patient
   ```

4. Run both apps:

   ```bash
   # from the repo root
   pnpm dev          # runs web + api together
   # or separately:
   pnpm dev:api      # NestJS on :4000
   pnpm dev:web      # Next.js on :3000
   ```

## Seeded accounts

| Role    | Email                  | Password     |
| ------- | ---------------------- | ------------ |
| Admin   | `admin@telehealth.dev` | `Admin123!`  |
| Doctor  | `doctor1@telehealth.dev` … `doctor7@telehealth.dev` | `Doctor123!` |
| Patient | `patient@telehealth.dev` | `Patient123!` |

Seven doctors are seeded across specializations (General Practice, Cardiology, Dermatology,
Pediatrics, Psychiatry, Orthopedics, Endocrinology) with availability over the next week.

## API overview

REST endpoints under `/api`, authenticated with a Bearer JWT:

- `POST /auth/register`, `POST /auth/login`, `GET /auth/me`
- `GET/PATCH /patients/me`, `GET /patients/me/appointments`, `GET /patients/me/prescriptions`
- `GET/PATCH /doctors/me`, `GET/POST/DELETE /doctors/me/availability`, `GET /doctors/me/appointments`
- `GET /doctors`, `GET /doctors/search`, `GET /doctors/:id`, `POST /doctors/match`
- `POST /appointments`, `POST /appointments/:id/reschedule`, `POST /appointments/:id/cancel`
- `GET /consultations/:id`, `POST /consultations/:id/state|notes|prescriptions`
- `GET /notifications`, `POST /notifications/:id/read`
- `GET /admin/users`, `PATCH /admin/users/:id`, `GET/PATCH /admin/doctors/:id`,
  `GET /admin/appointments`, `POST /admin/appointments/:id/cancel`, `GET /admin/dashboard`, `GET /admin/audit`

## Scripts

| Command           | Description                       |
| ----------------- | --------------------------------- |
| `pnpm dev`        | Run web + api in development      |
| `pnpm build`      | Build both apps                   |
| `pnpm --filter api db:push`   | Apply the Prisma schema |
| `pnpm --filter api db:seed`   | Seed the database       |
| `pnpm --filter api test`      | Run API unit tests      |

## Spec-driven development

This project uses [OpenSpec](https://github.com/Fission-AI/OpenSpec). The `telehealth-mvp`
change under `openspec/changes/` contains the proposal, capability specs, design, and tasks.
Use `/opsx:propose`, `/opsx:apply`, and `/opsx:archive` to drive further work.
