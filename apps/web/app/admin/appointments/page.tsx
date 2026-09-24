'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, formatDateTime } from '../../lib/api';

interface AdminAppointment {
  id: string;
  startAt: string;
  status: string;
  symptoms?: string | null;
  patient?: { email: string; patientProfile?: { firstName: string; lastName: string } | null };
  doctor?: { email: string; doctorProfile?: { firstName: string; lastName: string } | null };
  consultation?: { state: string } | null;
}

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);

  const load = useCallback(() => {
    api<AdminAppointment[]>('/admin/appointments').then(setAppointments);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function cancel(id: string) {
    await api(`/admin/appointments/${id}/cancel`, { method: 'POST' });
    load();
  }

  const statusBadge = (s: string) =>
    s === 'SCHEDULED' ? 'badge-green' : s === 'CANCELLED' ? 'badge-red' : 'badge-blue';

  return (
    <div className="container page">
      <div className="page-head">
        <div>
          <h1>Appointment oversight</h1>
          <p className="muted">View all appointments and consultation states.</p>
        </div>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Status</th>
              <th>Consultation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.id}>
                <td>{formatDateTime(a.startAt)}</td>
                <td>
                  {a.patient?.patientProfile
                    ? `${a.patient.patientProfile.firstName} ${a.patient.patientProfile.lastName}`
                    : a.patient?.email}
                </td>
                <td>
                  {a.doctor?.doctorProfile
                    ? `Dr. ${a.doctor.doctorProfile.firstName} ${a.doctor.doctorProfile.lastName}`
                    : a.doctor?.email}
                </td>
                <td>
                  <span className={`badge ${statusBadge(a.status)}`}>{a.status}</span>
                </td>
                <td>
                  <span className="badge">{a.consultation?.state ?? '—'}</span>
                </td>
                <td>
                  {a.status === 'SCHEDULED' && (
                    <button className="btn btn-sm btn-danger" onClick={() => cancel(a.id)}>
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
