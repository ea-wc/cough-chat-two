# Tasks

## 1. Combined container

- [x] 1.1 Add `Dockerfile.fly` that installs PostgreSQL on a Node base, builds the web and API, and sets `scripts/run.sh` as the entrypoint and verify the image builds
- [x] 1.2 Add `scripts/run.sh` that initializes the data dir, starts Postgres, runs `prisma db push` + seed, and launches the API and web and verify it starts all three processes locally

## 2. Web proxying

- [x] 2.1 Add a Next.js rewrite so `/api/:path*` proxies to the internal API and verify a request through the web reaches the API
- [x] 2.2 Set the browser API base to a relative `/api` (env-driven) and verify the web's API calls resolve to the same origin

## 3. Fly configuration

- [x] 3.1 Add `fly.toml` (app + internal port + volume mount) and verify `fly config validate` passes
- [x] 3.2 Create the `data` Fly volume and confirm `fly volumes list` shows it

## 4. Deploy and verify

- [x] 4.1 Deploy with `fly deploy` and verify the app is reachable over HTTPS
- [x] 4.2 Smoke-test the public URL (landing page loads and a login request succeeds through the proxy) and verify it against the running deployment

## 5. Documentation

- [x] 5.1 Add a Fly.io deployment section to the README (deploy + smoke-test commands) and verify the docs build still passes
