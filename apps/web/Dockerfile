FROM node:20-slim

RUN npm install -g pnpm@12.6.0

WORKDIR /app

# Install workspace dependencies for the web app only.
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/web/package.json apps/web/package.json
RUN pnpm install --filter web --frozen-lockfile

# Build the Next.js app. NEXT_PUBLIC_* vars are inlined at build time.
COPY apps/web apps/web

ARG NEXT_PUBLIC_API_URL=http://localhost:4000/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN pnpm --filter web build

EXPOSE 3000

CMD ["pnpm", "--filter", "web", "start"]
