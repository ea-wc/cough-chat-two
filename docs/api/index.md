# API Documentation

The REST API is a NestJS application exposing JSON over HTTP under `/api`. It is documented with
OpenAPI (Swagger).

## Interactive UI

Run the API locally and open the Swagger UI:

```bash
pnpm --filter api start:dev
# then open http://localhost:4000/api/docs
```

The raw OpenAPI document is served at `http://localhost:4000/api/docs-json`.

## Authentication

All endpoints except registration and sign-in require a Bearer JWT. Obtain one via:

```
POST /api/auth/login   { "email": "...", "password": "..." }
```

and send it as `Authorization: Bearer <token>`. Role-based guards restrict each resource.

## Resource groups

| Tag | Endpoints |
| --- | --- |
| `auth` | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| `patients` | `GET/PATCH /patients/me`, `GET /patients/me/appointments`, `GET /patients/me/prescriptions` |
| `doctors` | `GET/PATCH /doctors/me`, `GET/POST/DELETE /doctors/me/availability`, `GET /doctors`, `GET /doctors/search`, `GET /doctors/:id`, `POST /doctors/match` |
| `appointments` | `POST /appointments`, `POST /appointments/:id/reschedule`, `POST /appointments/:id/cancel`, `GET /appointments/:id` |
| `consultations` | `GET /consultations/:id`, `POST /consultations/:id/state|notes|prescriptions` |
| `notifications` | `GET /notifications`, `POST /notifications/:id/read` |
| `admin` | `GET/PATCH /admin/users`, `GET/PATCH /admin/doctors`, `GET /admin/appointments`, `POST /admin/appointments/:id/cancel`, `GET /admin/dashboard`, `GET /admin/audit` |
