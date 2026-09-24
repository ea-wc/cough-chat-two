# notifications Specification

## Purpose
Delivers database-backed in-app notifications for bookings, upcoming appointments, cancellations, and schedule changes.

## Requirements

### Requirement: In-app notifications
The system SHALL provide database-backed in-app notifications for bookings, upcoming appointments, cancellations, and schedule changes.

#### Scenario: Booking notification
- **WHEN** a consultation is booked
- **THEN** the system creates an in-app notification for the relevant participants

#### Scenario: Cancellation notification
- **WHEN** a consultation is cancelled
- **THEN** the system creates an in-app notification for the relevant participants

#### Scenario: Schedule change notification
- **WHEN** a consultation is rescheduled or a doctor's schedule changes
- **THEN** the system creates an in-app notification for the affected participants

### Requirement: No external notification service
The system SHALL deliver notifications without email, SMS, or push-notification services.

#### Scenario: Notification without external service
- **WHEN** a notification is delivered
- **THEN** the system stores and shows it in-app without contacting any external notification service

### Requirement: View and read notifications
The system SHALL allow a user to view their notifications and mark them as read.

#### Scenario: Mark notification read
- **WHEN** a user opens and marks a notification as read
- **THEN** the system updates the notification's read state
