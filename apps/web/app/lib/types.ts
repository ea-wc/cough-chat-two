export type Role = 'PATIENT' | 'DOCTOR' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  role: Role;
  status?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface PatientProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  birthday?: string | null;
  weightKg?: number | null;
  heightCm?: number | null;
  phone?: string | null;
  address?: string | null;
  medicalHistory?: string | null;
}

export interface DoctorProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  bio?: string | null;
  specialization: string;
  approvalStatus?: string;
  user?: { email: string };
  availabilities?: Availability[];
  nextAvailability?: string | null;
  matchScore?: number;
}

export interface Availability {
  id: string;
  doctorId: string;
  startAt: string;
  endAt: string;
  status: string;
}

export interface Consultation {
  id: string;
  appointmentId: string;
  state: string;
  notes?: string | null;
  summary?: string | null;
  startedAt?: string | null;
  endedAt?: string | null;
  prescriptions?: Prescription[];
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  startAt: string;
  endAt: string;
  status: string;
  symptoms?: string | null;
  consultation?: Consultation | null;
  doctor?: { doctorProfile?: DoctorProfile; email?: string };
  patient?: { patientProfile?: PatientProfile; email?: string };
}

export interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  instructions?: string | null;
  issuedAt: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
