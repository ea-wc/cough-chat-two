FROM node:20-slim

# Prisma's engine needs OpenSSL to talk to PostgreSQL.
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm@12.6.0

WORKDIR /app

# Install workspace dependencies for the API only.
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/api/prisma apps/api/prisma
RUN pnpm install --filter api --frozen-lockfile

# Build the API and generate the Prisma client.
COPY apps/api apps/api
RUN pnpm --filter api exec prisma generate
RUN pnpm --filter api build

EXPOSE 4000

CMD ["sh", "-c", "pnpm --filter api exec prisma db push && pnpm --filter api exec prisma db seed && node apps/api/dist/main.js"]
