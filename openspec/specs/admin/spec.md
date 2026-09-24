# admin Specification

## Purpose
Provides administrative oversight of user accounts, doctor profiles, appointments, operational metrics, and audit activity.

## Requirements

### Requirement: User management
The system SHALL allow an admin to view and search patient and doctor accounts and to activate, suspend, or deactivate them.

#### Scenario: Suspend a user
- **WHEN** an admin suspends a user account with a reason
- **THEN** the system stores the account state and reason and applies it

#### Scenario: Search users
- **WHEN** an admin searches for patient or doctor accounts
- **THEN** the system returns matching accounts

### Requirement: Doctor profile review
The system SHALL allow an admin to review and approve, reject, or update doctor profiles and specialization data.

#### Scenario: Approve doctor profile
- **WHEN** an admin approves a doctor profile
- **THEN** the system records the approval and updates the profile status

### Requirement: Appointment oversight
The system SHALL allow an admin to view all appointments and consultation states, resolve invalid bookings, and cancel appointments.

#### Scenario: Resolve invalid booking
- **WHEN** an admin resolves an invalid booking
- **THEN** the system corrects the appointment state

#### Scenario: Cancel appointment
- **WHEN** an admin cancels an appointment
- **THEN** the system marks the appointment cancelled

### Requirement: Operational dashboard
The system SHALL display database-derived counts for users, doctors, appointments, and consultation states.

#### Scenario: View dashboard
- **WHEN** an admin opens the operational dashboard
- **THEN** the system displays counts for users, doctors, appointments, and consultation states

### Requirement: Audit log
The system SHALL record administrator actions, affected records, timestamps, and optional reasons for traceability.

#### Scenario: Admin action logged
- **WHEN** an admin performs a management action
- **THEN** the system appends an audit entry with the action, affected record, timestamp, and optional reason
