# Proposal

## Why

There is no application today. We need a functional prototype of a telehealth web app that lets visitors understand the service, and lets patients register, find a doctor, book a consultation, and connect online — while doctors manage availability and clinical notes, and admins oversee the platform. The goal is a polished, coherent end-to-end core journey shipped in a short window, prioritizing correctness and product sense over feature quantity.

## What Changes

- Introduce a public, responsive product landing page with clear registration/sign-in calls to action and application-managed trust/legal content (prototype disclaimer, privacy, safety, terms).
- Introduce application-managed email/password authentication for Patients and Doctors, plus a pre-provisioned Admin account (no public admin registration), with role-based access control enforced in NestJS.
- Introduce patient account and profile management (name, birthday, weight, height, contact, basic medical history) stored in PostgreSQL.
- Introduce doctor profiles (biography, specialization) and doctor schedule/availability management.
- Introduce doctor discovery: browse, search, and deterministic specialty-matching (no external AI) over profiles and availability.
- Introduce appointment booking, rescheduling, and cancellation with availability and booking-conflict rules enforced in NestJS.
- Introduce a first-party consultation workspace that tracks scheduled → joined → in-progress → completed states and carries appointment context (no A/V streaming).
- Introduce medical records: appointment history, consultation notes, and prescriptions with role-based access.
- Introduce database-backed in-app notifications (no email/SMS/push).
- Introduce an admin module: user management, doctor-profile review, appointment oversight, an operational dashboard, and an audit log.
- Establish the standalone runtime: Next.js frontend, NestJS backend, Prisma + PostgreSQL, all served via Docker Compose, with no SaaS/BaaS/external runtime dependencies.

## Capabilities

### New Capabilities
- `product-website`: Public landing page, navigation, and application-managed trust/legal content.
- `auth`: Authentication and authorization for patient, doctor, and admin roles.
- `patient-profile`: Patient account, profile, and basic medical history.
- `doctor-profile`: Doctor account, professional profile, and availability management.
- `doctor-discovery`: Browse, search, and deterministic matching of doctors.
- `appointments`: Booking, rescheduling, and cancellation with conflict rules.
- `consultations`: Consultation session workspace, states, notes, and prescriptions.
- `medical-records`: Patient-visible appointment history, notes, and prescriptions.
- `notifications`: Database-backed in-app notifications.
- `admin`: User management, doctor review, appointment oversight, dashboard, and audit log.

### Modified Capabilities
<!-- None — this is a greenfield project. -->

## Impact

- **New monorepo structure**: `apps/web` (Next.js), `apps/api` (NestJS), shared Prisma schema, Docker Compose at root.
- **Database**: new PostgreSQL schema via Prisma (users, profiles, doctors, availability, appointments, consultations, prescriptions, notifications, audit).
- **API**: new REST + JSON surface under `/api` with role guards.
- **Auth**: local email/password with hashed credentials and JWT or session tokens (no external provider).
- **Infrastructure**: `docker-compose.yml` plus local setup docs; no SaaS/BaaS/external runtime APIs introduced.
