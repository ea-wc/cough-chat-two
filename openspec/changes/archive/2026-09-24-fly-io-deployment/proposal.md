# Proposal

## Why

The application currently runs only locally via Docker Compose, so it is not reachable by anyone
else. To share the prototype publicly we need a cloud deployment. Fly.io is chosen for its
Docker-native workflow and low friction. Per the standalone-runtime constraint, the whole stack —
Next.js web, NestJS API, and PostgreSQL — ships as a single self-contained container, avoiding any
external managed-database dependency.

## What Changes

- Add a single-container Docker image that runs PostgreSQL, the NestJS API, and the Next.js web app
  together under a small supervisor, with the web as the single external entry point.
- Add a `fly.toml` and a persistent Fly volume for the Postgres data directory, so data survives
  restarts.
- Route browser traffic to the API through the web via a Next.js rewrite, so only one public port
  is exposed and the API stays internal.
- Add a `fly:deploy` script and document the deploy + smoke-test steps.

## Capabilities

### New Capabilities
- `fly-io-deployment`: Deploy the full stack to Fly.io as one self-contained container (web + API +
  PostgreSQL) with a persistent database and public HTTPS access.

### Modified Capabilities
<!-- None — this is deployment infrastructure, not a change to product behavior. -->

## Impact

- **New files**: `Dockerfile.fly` (combined image), `scripts/run.sh` (supervisor), `fly.toml`,
  and a `fly` deployment doc section.
- **Web config**: a Next.js rewrite proxying `/api/*` to the internal API, and an env-driven API
  base URL so the browser talks to the same origin.
- **Database**: Postgres is initialized on first boot and migrations/seed run against a Fly volume.
- **No product-behavior change** to the existing capabilities.
