# Proposal

## Why

The MVP's core journeys (patient registration → discovery → booking → consultation, doctor
availability → consultation, admin oversight) are only exercised manually. Any change to a shared
contract — the REST API, the Prisma schema, or a page flow — can silently break a journey with no
automated signal. We need automated end-to-end regression tests that run against the real stack and
fail fast in CI before a regression ships.

## What Changes

- Add a Playwright end-to-end test suite in a new `apps/e2e` workspace package, running against the
  built web + api + PostgreSQL stack.
- Cover the core journeys with browser-level tests: patient sign-up and profile, doctor discovery
  and deterministic matching, booking with conflict behavior, the consultation workspace
  (state, notes, prescriptions), and admin oversight (user suspend, dashboard, audit).
- Provide deterministic, isolated test data via a dedicated seed so tests do not depend on or
  corrupt the development database.
- Integrate the suite into CI with a GitHub Actions workflow (`pnpm e2e`) that spins up the stack
  via Docker Compose, runs the tests, and reports results.
- Add npm scripts and Playwright config (base URL, browsers, report output) plus a documented local
  run path.

## Capabilities

### New Capabilities
- `e2e-testing`: Automated browser-level regression tests covering the core user journeys, with
  deterministic test data and CI integration.

### Modified Capabilities
<!-- None — this adds test infrastructure without changing product behavior. -->

## Impact

- **New workspace package**: `apps/e2e` with `@playwright/test`, Playwright config, and specs.
- **Test data**: a dedicated `seed-e2e` (or test fixtures) creating isolated accounts/availability,
  distinct from the dev seed.
- **Scripts**: root `e2e`, `e2e:install`, `e2e:report`.
- **CI**: new `.github/workflows/e2e.yml` running the suite on push/PR against the Docker Compose
  stack.
- **Docs**: the `docs` artifact records the test architecture and how to run it; the docs site gains
  a "Testing" note.
