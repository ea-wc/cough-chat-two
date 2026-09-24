# Spec Delta

## Purpose

Allows patients to book, reschedule, and cancel consultations against doctor availability, with conflict rules enforced in the backend.

## ADDED Requirements

### Requirement: Book appointment
The system SHALL allow a patient to book a consultation using availability stored by the application.

#### Scenario: Successful booking
- **WHEN** a patient books an available slot
- **THEN** the system creates the appointment and marks the slot as booked

#### Scenario: Booking an unavailable slot
- **WHEN** a patient attempts to book a slot that is unavailable
- **THEN** the system rejects the booking with an error

### Requirement: Enforce booking conflicts
The system SHALL enforce availability and booking-conflict rules so a slot cannot be double-booked.

#### Scenario: Double-booking prevented
- **WHEN** two patients attempt to book the same slot
- **THEN** the system allows only one booking and rejects the other

### Requirement: Reschedule appointment
The system SHALL allow a patient to reschedule a consultation to a different available slot.

#### Scenario: Reschedule to available slot
- **WHEN** a patient reschedules an appointment to an available slot
- **THEN** the system updates the appointment and releases the previous slot

### Requirement: Cancel appointment
The system SHALL allow a patient to cancel a consultation.

#### Scenario: Cancellation releases slot
- **WHEN** a patient cancels an appointment
- **THEN** the system marks the appointment cancelled and releases the slot for future booking
