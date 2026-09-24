# Tasks

## 1. Scaffold the test package

- [x] 1.1 Add `apps/e2e` workspace package with `@playwright/test` and a `playwright.config.ts` (baseURL, chromium, HTML/trace reporters) and verify `pnpm exec playwright --version` succeeds
- [x] 1.2 Add root scripts (`e2e`, `e2e:install`, `e2e:report`) and verify `pnpm e2e:install` downloads the chromium browser

## 2. Isolated test data

- [x] 2.1 Add an E2E seed creating deterministic test accounts and availability against a `telehealth_e2e` database and verify it runs idempotently
- [x] 2.2 Add an E2E compose override/profile that points the API at `telehealth_e2e` and verify `docker compose config` validates

## 3. Journey tests

- [x] 3.1 Write the patient journey test (register → profile → discover → book) and verify it passes against the running stack
- [x] 3.2 Write the doctor journey test (availability → consultation → notes + prescription) and verify it passes
- [x] 3.3 Write the admin journey test (suspend user, review doctor, dashboard + audit) and verify it passes

## 4. CI integration

- [x] 4.1 Add `.github/workflows/e2e.yml` that starts the compose stack, runs `pnpm e2e`, and uploads the Playwright report and verify the workflow is syntactically valid
- [x] 4.2 Confirm a full local run (`pnpm e2e`) is green end-to-end and document the run command in the README

## 5. Documentation

- [x] 5.1 Add a "Testing" section to the docs site describing the regression suite and verify `pnpm docs:build` still passes
