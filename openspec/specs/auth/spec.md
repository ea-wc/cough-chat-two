# auth Specification

## Purpose
Provides application-managed authentication and role-based authorization for Patient, Doctor, and Admin accounts.

## Requirements

### Requirement: Patient registration
The system SHALL allow a patient to register an account using an email address and a password managed by the application.

#### Scenario: Successful patient registration
- **WHEN** a visitor submits a valid email and password for a new patient account
- **THEN** the system creates the patient account and signs the user in

#### Scenario: Duplicate email
- **WHEN** a visitor registers with an email that already exists
- **THEN** the system rejects the registration with an error and does not create a second account

### Requirement: Doctor registration
The system SHALL allow a doctor to register an account using an email address and a password managed by the application.

#### Scenario: Successful doctor registration
- **WHEN** a visitor submits a valid email and password for a new doctor account
- **THEN** the system creates the doctor account and signs the user in

### Requirement: Sign-in
The system SHALL allow a registered patient or doctor to sign in with their email and password.

#### Scenario: Successful sign-in
- **WHEN** a registered user submits correct credentials
- **THEN** the system establishes an authenticated session for that user

#### Scenario: Incorrect credentials
- **WHEN** a user submits an incorrect email or password
- **THEN** the system rejects the sign-in and does not establish a session

### Requirement: Pre-provisioned admin account
The system SHALL provide a pre-provisioned, application-managed administrator account and SHALL NOT provide public administrator registration.

#### Scenario: Admin sign-in
- **WHEN** the pre-provisioned administrator submits valid credentials
- **THEN** the system establishes an authenticated admin session

#### Scenario: No public admin registration
- **WHEN** a visitor attempts to register an admin account
- **THEN** the system provides no such path

### Requirement: Role-based access control
The system SHALL enforce role-based authorization in the backend so that each role can only access the resources permitted to it.

#### Scenario: Unauthorized resource access
- **WHEN** an authenticated user requests a resource outside their role
- **THEN** the system denies access with an authorization error
