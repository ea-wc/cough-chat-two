# Design

## Context

Greenfield project. Tech stack is fixed by the requirements: React + Vite frontend, NestJS backend, Prisma + PostgreSQL, TypeScript throughout, pnpm, Docker Compose for local deployment. The hard constraint is a standalone runtime — no SaaS, BaaS, or external runtime APIs for any core feature. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- A single repository with two apps (`apps/web`, `apps/api`) sharing a Prisma schema and Docker Compose orchestration.
- A clean NestJS module boundary per capability so the backend maps 1:1 to the specs.
- Deterministic, in-application implementations for matching, availability, booking conflicts, and notifications.
- A polished core patient journey first, with doctor and admin built on the same data model.

**Non-Goals:**
- Audio/video streaming or any external conferencing (consultation workspace is state-tracking only).
- Real email/SMS/push delivery (notifications are database-backed and in-app only).
- External file storage (avatars are initials-based or bundled).
- Horizontal scaling, multi-region deployment, or real medical-data compliance beyond a prototype disclaimer.

## Decisions

### Monorepo layout with pnpm workspaces
**Decision:** `apps/web` (Vite + React + TypeScript) and `apps/api` (NestJS + TypeScript), with a shared Prisma schema under `packages/db` (or `apps/api/prisma`) and a root `pnpm-workspace.yaml`.

**Rationale:** Keeps frontend and backend independently runnable while sharing types and a single schema. pnpm is mandated by the requirements and handles the workspace natively.

**Alternatives:** Next.js (allowed) was considered for SSR of the landing page, but Vite keeps the frontend simpler and the landing page is static enough to not need SSR. Next.js could be swapped later without changing specs.

### Authentication: local email/password with hashed credentials + JWT
**Decision:** Store email + bcrypt-hashed password in PostgreSQL; issue a signed JWT (or opaque session) on sign-in; NestJS guards enforce role-based access. Admin is seeded via a Prisma migration/seed script (no public registration).

**Rationale:** Meets the "application-managed authentication" and "no external provider" requirements. Passport.js (open-source) wraps the local strategy cleanly.

**Alternatives:** Session cookies — equally valid and simpler for CSRF; JWT chosen for statelessness across the API. Either satisfies the spec.

### Booking conflicts and availability enforced in NestJS
**Decision:** Availability is stored as slots; booking endpoints run inside a transaction that re-checks slot status before insert, so two concurrent bookings of the same slot cannot both succeed. Overlap/validity checks are pure backend logic.

**Rationale:** No external scheduling service is allowed; a transactional check on a unique/guarded slot gives correctness without locks across the whole table.

**Alternatives:** A Postgres advisory lock or a partial unique index on booked slots. The transaction check is chosen for simplicity and clarity.

### Deterministic doctor matching in NestJS
**Decision:** A symptom/concern → specialty mapping table stored in the application (e.g. seed data), resolved by a pure NestJS service that ranks doctors by specialty match plus availability. No external AI or directory calls.

**Rationale:** The requirement explicitly forbids external AI and directory services; deterministic rules are predictable, testable, and explainable.

### In-app notifications as database rows
**Decision:** A `notification` table keyed to user and type; the API writes rows on booking/upcoming/cancel/schedule-change events and the UI polls or fetches them.

**Rationale:** Fully self-contained and satisfies "database-backed in-app notifications" without email/SMS/push.

### Prisma schema as the single source of truth
**Decision:** One Prisma schema with entities: `User` (role + profile union), `PatientProfile`, `DoctorProfile` (specialization, bio), `Availability`, `Appointment`, `Consultation`, `Prescription`, `Notification`, `AuditLog`.

**Rationale:** Prisma gives type-safe access and migrations; the single schema keeps the two apps consistent.

## Risks / Trade-offs

- [Concurrent booking race] → Mitigation: transactional re-check on slot status before commit; a duplicate slot insert is guarded by the transaction.
- [Seed/admin credential leakage] → Mitigation: admin is seeded with a hashed default password documented for local setup only; a prototype disclaimer is shown.
- [Schema drift between apps] → Mitigation: one shared Prisma schema + generated client used by the API; frontend consumes typed API contracts.
- [Time-boxed build] → Mitigation: capabilities are independent; core journey (auth → profile → discover → book → consult → records) is prioritized so a partial build still demos end-to-end.
- [Medical-data sensitivity] → Mitigation: prototype disclaimer, role-based access on every records endpoint, and no real PII beyond the demo.

## Migration Plan

1. Scaffold `apps/web`, `apps/api`, and the shared Prisma schema.
2. Run `prisma migrate dev` to create the initial schema; seed admin and specialty-matching data.
3. Implement backend modules in dependency order (auth → profiles → discovery → appointments → consultations/records → notifications → admin).
4. Implement frontend flows against the API.
5. Compose `docker-compose.yml` (web, api, postgres) and document `docker compose up` setup.

## Open Questions

- None blocking. Deployment target (Docker Compose only vs. optional bonus cloud) can be decided after the local build works.
