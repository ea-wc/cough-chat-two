# Data model

The PostgreSQL schema is defined in `apps/api/prisma/schema.prisma` and accessed via Prisma ORM.

> This page is generated from the Prisma schema. Regenerate with `pnpm docs:generate`.

```mermaid
erDiagram
    User {
        String id
        String email
        String passwordHash
        Role role
        UserStatus status
        DateTime createdAt
        DateTime updatedAt
    }
    PatientProfile {
        String id
        String userId
        String firstName
        String lastName
        DateTime birthday
        Float weightKg
        Float heightCm
        String phone
        String address
        String medicalHistory
        DateTime createdAt
        DateTime updatedAt
    }
    DoctorProfile {
        String id
        String userId
        String firstName
        String lastName
        String bio
        String specialization
        String licenseNumber
        DoctorApprovalStatus approvalStatus
        DateTime createdAt
        DateTime updatedAt
    }
    Availability {
        String id
        String doctorId
        DateTime startAt
        DateTime endAt
        SlotStatus status
        DateTime createdAt
    }
    Appointment {
        String id
        String patientId
        String doctorId
        String availabilityId
        DateTime startAt
        DateTime endAt
        AppointmentStatus status
        String symptoms
        DateTime createdAt
        DateTime updatedAt
    }
    Consultation {
        String id
        String appointmentId
        ConsultationState state
        String notes
        String summary
        DateTime startedAt
        DateTime endedAt
        DateTime createdAt
        DateTime updatedAt
    }
    Prescription {
        String id
        String consultationId
        String patientId
        String doctorId
        String medication
        String dosage
        String instructions
        DateTime issuedAt
    }
    Notification {
        String id
        String userId
        NotificationType type
        String title
        String message
        Boolean read
        DateTime createdAt
    }
    AuditLog {
        String id
        String adminId
        String action
        String affectedRecord
        String reason
        DateTime timestamp
    }

    PatientProfile ||--o{ User : "user"
    DoctorProfile ||--o{ User : "user"
    Availability ||--o{ DoctorProfile : "doctor"
    Appointment ||--o{ User : "patient"
    Appointment ||--o{ User : "doctor"
    Appointment ||--o{ Availability : "availability"
    Consultation ||--o{ Appointment : "appointment"
    Prescription ||--o{ Consultation : "consultation"
    Prescription ||--o{ User : "patient"
    Prescription ||--o{ User : "doctor"
    Notification ||--o{ User : "user"
    AuditLog ||--o{ User : "admin"
```
