# fly-io-deployment Specification

## Purpose
Deploys the full telehealth stack to Fly.io as a single self-contained container with a persistent database and public HTTPS access.

## Requirements

### Requirement: Single-container deployment
The system SHALL deploy to Fly.io as a single container that runs the Next.js web app, the NestJS API, and PostgreSQL together.

#### Scenario: Stack runs in one container
- **WHEN** the container starts
- **THEN** PostgreSQL, the API, and the web app all run and the web app is the external entry point

### Requirement: Public HTTPS access
The system SHALL be reachable by end users over HTTPS through a single public entry point.

#### Scenario: Web app served over HTTPS
- **WHEN** a visitor opens the deployed application URL
- **THEN** the landing page is served and API calls succeed through the same origin

### Requirement: Persistent database
The system SHALL persist PostgreSQL data across container restarts via a Fly volume.

#### Scenario: Data survives restart
- **WHEN** the container restarts
- **THEN** previously stored accounts and records remain available

### Requirement: API reachable via the web
The system SHALL route browser API requests through the web app so the API stays internal and unexposed.

#### Scenario: Browser calls the API through the web
- **WHEN** the web app makes an API request under `/api`
- **THEN** the request is proxied to the internal API and the response is returned
