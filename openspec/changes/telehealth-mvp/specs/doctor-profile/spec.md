# Spec Delta

## Purpose

Allows doctors to maintain their professional profile, biography, and specialization, and to manage their consultation availability.

## ADDED Requirements

### Requirement: Doctor profile fields
The system SHALL store doctor profile details including biography and specialization.

#### Scenario: Save doctor profile
- **WHEN** a doctor saves a profile with biography and specialization
- **THEN** the system persists the profile for that doctor

### Requirement: Manage availability
The system SHALL allow a doctor to create and manage consultation availability slots.

#### Scenario: Create availability
- **WHEN** a doctor creates an availability slot for a date and time
- **THEN** the system stores the slot as available for booking

#### Scenario: Restrict unavailable slot
- **WHEN** a doctor marks a time as unavailable
- **THEN** the system prevents that time from being booked

### Requirement: Prevent overlapping availability
The system SHALL prevent a doctor from creating overlapping availability slots.

#### Scenario: Overlapping slot rejected
- **WHEN** a doctor attempts to create a slot that overlaps an existing slot
- **THEN** the system rejects the slot as invalid
