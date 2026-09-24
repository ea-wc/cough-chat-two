# Features

The system is decomposed into **10 capabilities**, each backed by an OpenSpec capability spec
(`openspec/specs/<capability>/spec.md`) and a NestJS module.

> This page is generated from `openspec/specs/`. Regenerate with `pnpm docs:generate`.

| Capability | Purpose | Requirements |
| --- | --- | --- |
| `admin` | Provides administrative oversight of user accounts, doctor profiles, appointments, operational metrics, and audit activity. | 5 |
| `appointments` | Allows patients to book, reschedule, and cancel consultations against doctor availability, with conflict rules enforced in the backend. | 4 |
| `auth` | Provides application-managed authentication and role-based authorization for Patient, Doctor, and Admin accounts. | 5 |
| `consultations` | Provides a first-party consultation workspace shared by patient and doctor that tracks appointment state and records clinical outcomes. | 4 |
| `doctor-discovery` | Allows patients to browse, search, and receive deterministic specialty-based matching of doctors without external services. | 3 |
| `doctor-profile` | Allows doctors to maintain their professional profile, biography, and specialization, and to manage their consultation availability. | 3 |
| `medical-records` | Stores and exposes appointment history, consultation notes, and prescriptions with role-based access control. | 4 |
| `notifications` | Delivers database-backed in-app notifications for bookings, upcoming appointments, cancellations, and schedule changes. | 3 |
| `patient-profile` | Allows patients to create and maintain their account profile, contact details, and basic medical history. | 3 |
| `product-website` | Provides the public-facing product website that communicates the telehealth service's value and routes visitors into registration or sign-in. | 4 |
