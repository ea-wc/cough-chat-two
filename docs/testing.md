# Testing

Automated end-to-end regression tests cover the core journeys, driven by Playwright against the
real application stack.

## Stack

- **Runner** — Playwright Test in `apps/e2e` (chromium, HTML + trace reporters).
- **Coverage** — three journey specs derived from the `e2e-testing` capability scenarios:
  - **Patient** — register → complete profile → discover → book.
  - **Doctor** — availability → consultation → notes + prescription.
  - **Admin** — dashboard → suspend a user → audit trail.
- **Data** — deterministic seeded accounts, plus unique (timestamped) registrations where a fresh
  account is required. CI uses a throwaway `telehealth_e2e` database.

## Running

```bash
pnpm e2e:install   # once: download chromium
pnpm e2e           # run the suite (stack must be up)
pnpm e2e:report    # open the HTML report
```

For an isolated database:

```bash
docker compose -f docker-compose.yml -f docker-compose.e2e.yml up --build
```

## CI

`.github/workflows/e2e.yml` starts the compose stack on push/PR, runs `pnpm e2e`, uploads the
Playwright report, and tears down.
