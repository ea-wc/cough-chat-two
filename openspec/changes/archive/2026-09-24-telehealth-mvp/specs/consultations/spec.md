# Spec Delta

## Purpose

Provides a first-party consultation workspace shared by patient and doctor that tracks appointment state and records clinical outcomes.

## ADDED Requirements

### Requirement: Join consultation workspace
The system SHALL allow both the patient and the doctor to access the scheduled consultation session through a first-party workspace.

#### Scenario: Participant joins
- **WHEN** the patient or doctor opens the consultation workspace for an appointment
- **THEN** the system displays the appointment context to that participant

### Requirement: Track consultation state
The system SHALL track scheduled, joined, in-progress, and completed states for a consultation.

#### Scenario: State transitions
- **WHEN** participants interact with a consultation
- **THEN** the system updates and displays the consultation state through scheduled, joined, in-progress, and completed

### Requirement: Record consultation notes and prescriptions
The system SHALL allow a doctor to record findings, recommendations, prescriptions, and a consultation summary after an appointment.

#### Scenario: Doctor records outcome
- **WHEN** a doctor saves notes or a prescription for a consultation
- **THEN** the system stores the outcome and makes it available for later viewing

### Requirement: No external conferencing required
The system SHALL NOT require audio/video streaming or an external conferencing service for consultations.

#### Scenario: Workspace without A/V
- **WHEN** a consultation is conducted
- **THEN** the workspace functions without audio/video streaming or external conferencing
