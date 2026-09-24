# Context

TeleHealth is a **fictional telehealth prototype**: a web application that lets visitors understand a
telehealth service, and lets patients register, find a doctor, book a consultation, and connect with
that doctor online. Doctors manage their availability, consultations, notes, and prescriptions;
administrators oversee accounts, doctor profiles, appointments, and audit activity.

## Problem

Access to a doctor typically requires phone calls, unavailable schedules, and fragmented records.
The prototype demonstrates a coherent, end-to-end alternative: discover, book, consult, and review —
all in one place, with a polished core journey prioritized over feature quantity.

## Constraints

The system runs on a **standalone runtime**: every core feature is implemented in the application
itself. No SaaS, BaaS, or external runtime APIs are used for authentication, matching,
notifications, storage, scheduling, conferencing, analytics, or medical records. Doctor matching is
deterministic (no external AI); notifications are database-backed (no email/SMS/push).

## Roles

| Role | Responsibilities |
| --- | --- |
| **Patient** | Register, complete a profile, discover doctors, book/reschedule/cancel consultations, attend consultations, and view appointment history and medical records. |
| **Doctor** | Maintain a professional profile and specialization, manage availability, record consultation notes and prescriptions, and manage session state. |
| **Admin** | Pre-provisioned only (no public registration). Manages users, reviews doctor profiles, oversees appointments, views an operational dashboard, and traces actions via an audit log. |

## Technology

| Layer | Technology |
| --- | --- |
| Frontend | Next.js (App Router) + TypeScript |
| Backend | NestJS + TypeScript |
| API | REST + JSON |
| Database | PostgreSQL via Prisma ORM |
| Package manager | pnpm (workspace) |
| Local run | Docker Compose |
