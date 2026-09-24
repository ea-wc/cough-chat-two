# Tasks

## 1. Project scaffolding

- [ ] 1.1 Create pnpm workspace (`pnpm-workspace.yaml`) with `apps/web` (Vite + React + TS) and `apps/api` (NestJS + TS) and verify `pnpm install` succeeds
- [ ] 1.2 Add root `docker-compose.yml` with `web`, `api`, and `postgres` services and verify `docker compose config` validates

## 2. Database schema

- [ ] 2.1 Define Prisma schema (User, PatientProfile, DoctorProfile, Availability, Appointment, Consultation, Prescription, Notification, AuditLog) and verify `prisma migrate dev` applies cleanly
- [ ] 2.2 Add seed script (pre-provisioned admin, specialty-matching rules, sample doctors) and verify seeding runs without error

## 3. Authentication and authorization (auth)

- [ ] 3.1 Implement local email/password registration and sign-in with bcrypt hashing + JWT and verify a curl to the register/sign-in endpoints returns a token
- [ ] 3.2 Implement role-based NestJS guards (patient/doctor/admin) and verify an out-of-role request is denied with 403

## 4. Profiles (patient-profile, doctor-profile)

- [ ] 4.1 Implement patient profile create/read/update endpoints (name, birthday, weight, height, contact, medical history) with initials avatar and verify fields persist
- [ ] 4.2 Implement doctor profile endpoints (bio, specialization) and verify a saved profile is returned on read

## 5. Availability and discovery (doctor-profile, doctor-discovery)

- [ ] 5.1 Implement doctor availability create/list with overlap rejection and verify an overlapping slot is rejected
- [ ] 5.2 Implement doctor browse/search endpoints (by specialization/name/availability) and verify a filtered search returns matching doctors
- [ ] 5.3 Implement deterministic symptom-to-specialty matching endpoint and verify a symptom query returns suggested doctors with no external call

## 6. Appointments (appointments)

- [ ] 6.1 Implement booking with transactional slot re-check and verify two concurrent bookings of one slot allow only one
- [ ] 6.2 Implement reschedule and cancel with slot release and verify the freed slot can be rebooked

## 7. Consultations and records (consultations, medical-records)

- [ ] 7.1 Implement consultation workspace endpoint with appointment context and scheduled/joined/in-progress/completed state transitions and verify state updates persist
- [ ] 7.2 Implement doctor notes/prescriptions write and patient read with role-based access and verify a patient cannot read another patient's records

## 8. Notifications (notifications)

- [ ] 8.1 Implement notification rows written on book/upcoming/cancel/schedule-change events and mark-read endpoint and verify a booking triggers a stored notification

## 9. Admin (admin)

- [ ] 9.1 Implement user management (search, activate/suspend/deactivate with reason) and verify a suspended user cannot sign in
- [ ] 9.2 Implement doctor profile review (approve/reject/update) and verify approval status persists
- [ ] 9.3 Implement appointment oversight (view all, resolve invalid, cancel) and verify a cancelled appointment state is corrected
- [ ] 9.4 Implement operational dashboard counts and audit log writes and verify an admin action appends an audit entry

## 10. Product website (product-website)

- [ ] 10.1 Build responsive landing page with value prop, how-it-works, header CTAs, prototype disclaimer, and self-hosted assets and verify no external network requests on load
- [ ] 10.2 Add application-managed terms and privacy pages and verify they render from the app

## 11. Integration and delivery

- [ ] 11.1 Wire frontend flows (register → profile → discover → book → consult → records) against the API and verify the full core journey works locally
- [ ] 11.2 Verify `docker compose up` runs web, api, and postgres end-to-end and document local setup in README
