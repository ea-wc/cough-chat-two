# patient-profile Specification

## Purpose
Allows patients to create and maintain their account profile, contact details, and basic medical history.

## Requirements

### Requirement: Patient profile fields
The system SHALL store patient profile data including name, birthday, weight, height, contact details, and basic medical history.

#### Scenario: Complete profile
- **WHEN** a patient saves a profile with name, birthday, weight, height, contact details, and medical history
- **THEN** the system persists all supplied fields

### Requirement: Initials-based avatar
The system SHALL generate an avatar from the patient's initials or provide an application-supplied avatar rather than external file storage.

#### Scenario: Avatar generated
- **WHEN** a patient account is created without an uploaded image
- **THEN** the system displays an initials-based or application-provided avatar

### Requirement: Edit profile
The system SHALL allow a patient to update their own profile information.

#### Scenario: Update profile
- **WHEN** a patient edits and saves their profile
- **THEN** the system updates the stored profile and reflects the changes on subsequent views
