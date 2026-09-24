# medical-records Specification

## Purpose
Stores and exposes appointment history, consultation notes, and prescriptions with role-based access control.

## Requirements

### Requirement: Appointment history
The system SHALL store and display a patient's appointment history.

#### Scenario: Patient views history
- **WHEN** a patient opens their appointment history
- **THEN** the system lists their past appointments

### Requirement: Consultation notes
The system SHALL store and display consultation notes for completed appointments.

#### Scenario: Patient views notes
- **WHEN** a patient views a completed consultation
- **THEN** the system displays the doctor's consultation notes

### Requirement: Prescriptions
The system SHALL store and display prescriptions issued by doctors.

#### Scenario: Patient views prescriptions
- **WHEN** a patient views their medical records
- **THEN** the system displays the prescriptions issued to them

### Requirement: Role-based access to records
The system SHALL enforce role-based access so patients see only their own records and doctors see only records of their patients.

#### Scenario: Cross-patient access denied
- **WHEN** a patient attempts to view another patient's records
- **THEN** the system denies access
