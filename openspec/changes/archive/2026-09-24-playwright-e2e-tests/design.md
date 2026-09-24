# Design

## Context

The stack runs as three services — Next.js web (`:3000`), NestJS API (`:4000`), PostgreSQL
(`:5432`) — via Docker Compose. There are no automated end-to-end tests today; the seeded accounts
(`patient@telehealth.dev`, `doctor1..7@`, `admin@`) are shared demo data. See proposal.md for
motivation.

## Goals / Non-Goals

**Goals:**
- A single `apps/e2e` workspace package with Playwright driving a real browser against the built app.
- Deterministic, isolated test data that never touches the developer's local database.
- One command (`pnpm e2e`) and one CI workflow to run the whole suite.

**Non-Goals:**
- Unit/integration test coverage (already partial in the API; out of scope here).
- Visual-regression snapshots, cross-browser matrix, or performance testing.
- Mocking the API — the point is to test the real stack end-to-end.

## Decisions

### Playwright Test runner in a dedicated workspace package
**Decision:** `apps/e2e` with `@playwright/test`, a `playwright.config.ts` (baseURL `http://localhost:3000`,
chromium project, HTML + trace reporters), and `tests/` specs organized per journey.

**Rationale:** Playwright is the standard for browser-level E2E; a separate workspace package keeps
test deps and browser binaries out of the app packages.

**Alternatives:** Cypress — rejected for weaker multi-tab/fixture ergonomics and heavier install.

### Isolated E2E seed rather than reusing the dev seed
**Decision:** A dedicated seed (`apps/api/prisma/seed-e2e.mjs`, or a `--e2e` flag on the existing
seed) that creates known test accounts and availability, run against a throwaway database
(`telehealth_e2e`) before the tests start.

**Rationale:** Tests must be deterministic and never mutate dev data. The E2E DB is dropped/recreated
per run.

**Alternatives:** In-test API fixtures (create users via `request` context) — viable but slower and
less representative of a cold start; a dedicated seed is simpler and reuses the Prisma layer.

### Run against the Docker Compose stack in CI
**Decision:** The CI workflow starts `docker compose up` (with an `e2e` profile or a dedicated
compose override pointing the API at `telehealth_e2e`), waits for health, runs `pnpm e2e`, then
tears down. Locally, `pnpm e2e` assumes the stack is already up (documented), with a `pnpm
e2e:up` convenience script.

**Rationale:** Reuses the existing Compose orchestration; tests exercise the same containers that
deploy.

**Alternatives:** Playwright's `webServer` config to auto-start services — rejected because three
dependent services (web → api → db) are better managed by Compose.

### Journey tests via the UI (not raw HTTP)
**Decision:** Tests drive the real Next.js UI (fill forms, click, assert rendered results), using the
seeded credentials, and assert on database state via a thin `@playwright/test` `request` helper only
where a UI assertion would be indirect (e.g. audit log).

**Rationale:** Browser-level regression matches the requirement; a few API-side assertions avoid
fragile UI-only checks.

## Risks / Trade-offs

- [E2E DB left behind / flaky state] → Mitigation: recreate `telehealth_e2e` at the start of each run.
- [Slow CI (browser + compose)] → Mitigation: run only chromium, single worker; cache Playwright browsers.
- [Port conflicts locally (3000/4000/5432 already used)] → Mitigation: document that the local E2E
  stack needs those ports free, or run E2E inside the compose network with `baseURL` to the `web`
  service hostname in CI.

## Migration Plan

1. Scaffold `apps/e2e` and add `@playwright/test`; add root scripts.
2. Add the isolated `seed-e2e` and an E2E compose override/profile.
3. Write the journey specs (patient, doctor, admin).
4. Add `.github/workflows/e2e.yml`; verify it passes on a PR.

## Open Questions

- None blocking. Whether to add a multi-browser matrix (webkit/firefox) can be decided after the
  chromium baseline is green.
