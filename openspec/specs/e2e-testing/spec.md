# e2e-testing Specification

## Purpose
Provides automated browser-level regression tests that exercise the core user journeys against the real stack and fail fast in CI.

## Requirements

### Requirement: Core journey regression coverage
The system SHALL have automated end-to-end tests that exercise the core patient, doctor, and admin journeys against the running application.

#### Scenario: Patient books a consultation
- **WHEN** the regression suite runs the patient journey (register → complete profile → discover → book)
- **THEN** the test asserts the booking succeeds and the appointment appears in the patient's list

#### Scenario: Doctor completes a consultation
- **WHEN** the regression suite runs the doctor journey (manage availability → join consultation → record notes and a prescription)
- **THEN** the test asserts the consultation reaches a completed state and the patient can view the record

#### Scenario: Admin oversees the platform
- **WHEN** the regression suite runs the admin journey (suspend a user, review a doctor, view the dashboard)
- **THEN** the test asserts the actions persist and the audit log records them

### Requirement: Deterministic test data
The system SHALL provide deterministic, isolated test data so regression tests do not depend on or corrupt the development database.

#### Scenario: Isolated fixture data
- **WHEN** the regression suite seeds its own test accounts and availability
- **THEN** the tests run against known data without mutating the developer's local database

### Requirement: CI integration
The system SHALL run the regression suite automatically in CI on push and pull request, failing the build on any regression.

#### Scenario: Regression fails the build
- **WHEN** a change breaks a covered journey
- **THEN** the CI pipeline fails and reports the failing test

#### Scenario: Regression suite runs in CI
- **WHEN** a push or pull request occurs
- **THEN** the CI workflow starts the stack and runs the regression suite
