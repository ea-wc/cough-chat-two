# Spec Delta

## Purpose

Allows patients to browse, search, and receive deterministic specialty-based matching of doctors without external services.

## ADDED Requirements

### Requirement: Browse doctors
The system SHALL allow a patient to browse doctor profiles, specializations, and availability.

#### Scenario: Browse doctor list
- **WHEN** a patient opens doctor discovery
- **THEN** the system lists doctor profiles with their specialization and availability

### Requirement: Search doctors
The system SHALL allow a patient to search doctor profiles by specialization or other criteria.

#### Scenario: Search by specialization
- **WHEN** a patient searches for a specialization
- **THEN** the system returns matching doctor profiles

### Requirement: Guided doctor matching
The system SHALL let a patient select or describe symptoms and healthcare concerns and then suggest doctors using deterministic specialty-matching rules implemented in the backend, without calling an external AI service.

#### Scenario: Symptom-based suggestions
- **WHEN** a patient selects symptoms or describes healthcare concerns
- **THEN** the system suggests doctors using deterministic specialty-matching rules and no external service

#### Scenario: No external service dependency
- **WHEN** doctor matching runs
- **THEN** the system performs matching locally without calling any external AI or directory service
