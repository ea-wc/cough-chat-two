#!/bin/sh
set -e

# Supervisor for the single-container Fly deployment: Postgres -> migrate/seed ->
# API (internal) -> web (public on $PORT).

PGDATA="${PGDATA:-/data/pgdata}"
DB_NAME="${DB_NAME:-telehealth}"
JWT_SECRET="${JWT_SECRET:-dev-secret-change-me}"

# Locate the PostgreSQL binaries (version varies by base image).
PG_BIN="$(dirname "$(find /usr/lib/postgresql -name initdb -type f 2>/dev/null | sort | tail -1)")"
export PATH="$PG_BIN:$PATH"

echo "==> PostgreSQL binaries at $PG_BIN"

# Initialize the cluster on first boot.
if [ ! -s "$PGDATA/PG_VERSION" ]; then
  echo "==> Initializing PostgreSQL data directory"
  mkdir -p "$PGDATA"
  chown -R postgres:postgres "$PGDATA"
  su postgres -s /bin/sh -c "initdb -D '$PGDATA' --auth=trust --username=postgres"
fi

echo "==> Starting PostgreSQL"
su postgres -s /bin/sh -c "pg_ctl -D '$PGDATA' -l /tmp/pg.log -o '-p 5432 -h 127.0.0.1' start"

stop_pg() {
  su postgres -s /bin/sh -c "pg_ctl -D '$PGDATA' stop" >/dev/null 2>&1 || true
}
trap 'stop_pg' EXIT INT TERM

# Wait for Postgres to accept connections.
until su postgres -s /bin/sh -c "pg_isready -h 127.0.0.1 -p 5432" >/dev/null 2>&1; do
  sleep 1
done

# Create the database if it does not exist.
if ! su postgres -s /bin/sh -c "psql -h 127.0.0.1 -p 5432 -U postgres -tAc \"SELECT 1 FROM pg_database WHERE datname='$DB_NAME'\"" | grep -q 1; then
  echo "==> Creating database $DB_NAME"
  su postgres -s /bin/sh -c "createdb -h 127.0.0.1 -p 5432 -U postgres '$DB_NAME'"
fi

export DATABASE_URL="postgresql://postgres@127.0.0.1:5432/$DB_NAME?schema=public"

echo "==> Applying schema and seed"
cd /app/apps/api
pnpm exec prisma db push
pnpm exec prisma db seed || true

echo "==> Starting API on :4000"
PORT=4000 node dist/main.js &
API_PID=$!

echo "==> Starting web on :$PORT"
cd /app
# Bind to all interfaces so Fly's proxy can reach the app (next start can
# otherwise bind to 127.0.0.1).
HOSTNAME=0.0.0.0 PORT="${PORT:-8080}" pnpm --filter web start &
WEB_PID=$!

wait "$API_PID" "$WEB_PID"
