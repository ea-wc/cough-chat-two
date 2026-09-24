# Design

## Context

The stack is three processes — Next.js web (`:3000`), NestJS API (`:4000`), PostgreSQL (`:5432`) —
currently orchestrated by Docker Compose. Fly.io runs one container per app and routes external
traffic to a single `$PORT`. The user wants the whole stack in one container. See proposal.md for
motivation.

## Goals / Non-Goals

**Goals:**
- One Docker image that starts all three processes under a small supervisor.
- One public entry point (the web) with the API proxied behind it.
- Persistent Postgres data via a Fly volume.

**Non-Goals:**
- Horizontal scaling, zero-downtime deploys, or multi-region replication.
- Fly-managed Postgres or any external database service.

## Decisions

### Single image from `postgres` + Node, supervised by a shell script
**Decision:** Build `Dockerfile.fly` on `node:20-slim`, install PostgreSQL via `apt`, then a
`scripts/run.sh` that (1) initializes the data dir on first boot, (2) starts Postgres, (3) applies
`prisma db push` + seed, (4) starts the API, (5) starts the web on `$PORT`, and (6) waits on all
children with a `trap` for clean shutdown.

**Rationale:** A shell supervisor is the simplest thing that reliably starts three long-lived
processes and propagates termination. `s6-overlay` is the heavier alternative.

**Alternatives:** `s6-overlay` — more robust but adds image complexity; a `pm2`/`supervisord`
process manager — another dependency for little gain at this scale.

### Postgres in-container with a Fly volume
**Decision:** Postgres data lives in `/data` (a Fly volume). `run.sh` runs `initdb` when the dir is
empty, starts `pg_ctl`, and creates the `telehealth` database on first boot.

**Rationale:** Keeps the deployment self-contained (no managed DB), matching the standalone-runtime
constraint. The volume makes it durable.

**Alternatives:** Fly Postgres (managed) — simpler ops but contradicts the single-container ask;
ephemeral data — loses state on every deploy.

### Web as the single entry point, API proxied via Next.js
**Decision:** The web serves on `$PORT`. `next.config.ts` adds a `rewrites()` that maps `/api/:path*`
to `http://localhost:4000/api/:path*`, and `NEXT_PUBLIC_API_URL` is set to a relative `/api` at build
time, so the browser talks to the same origin and the API is never exposed.

**Rationale:** Fly exposes one port; proxying keeps the API internal and avoids CORS entirely in
production.

**Alternatives:** Expose the API on a second Fly app — more moving parts; hardcode the API URL —
breaks when the domain changes.

## Risks / Trade-offs

- [Postgres inside the app container is non-idiomatic] → Acceptable for a prototype; the supervisor
  initializes it idempotently and the volume holds state. Document that Fly Postgres is the
  production-grade alternative.
- [Cold starts and restarts] → The supervisor re-runs migrations/seed idempotently, so a restart is
  safe.
- [Single container couples deploy units] → Matches the explicit requirement; splitting into
  separate Fly apps is the escape hatch later.

## Migration Plan

1. Add `Dockerfile.fly`, `scripts/run.sh`, and the Next.js `/api` rewrite + relative API base.
2. `fly launch` (creates `fly.toml` + app) and `fly volumes create data`.
3. `fly deploy` and smoke-test the public URL (landing page + a login request).
4. Document the deploy/verify steps.

## Open Questions

- None blocking. Fly app name, region, and instance size are decided at `fly launch` time.
