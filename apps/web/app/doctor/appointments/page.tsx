'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { api, formatDateTime, initials } from '../../lib/api';
import type { Appointment } from '../../lib/types';

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const load = useCallback(() => {
    api<Appointment[]>('/doctors/me/appointments').then(setAppointments);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const statusBadge = (s: string) =>
    s === 'SCHEDULED' ? 'badge-green' : s === 'CANCELLED' ? 'badge-red' : 'badge-blue';

  return (
    <div className="container page">
      <div className="page-head">
        <div>
          <h1>Appointments</h1>
          <p className="muted">Your patient consultations.</p>
        </div>
      </div>

      <div className="grid">
        {appointments.length === 0 && <p className="muted">No appointments yet.</p>}
        {appointments.map((a) => (
          <div className="card" key={a.id}>
            <div className="row space-between">
              <div className="row">
                <span className="avatar">{initials(a.patient?.patientProfile?.firstName, a.patient?.patientProfile?.lastName)}</span>
                <div>
                  <strong>
                    {a.patient?.patientProfile?.firstName} {a.patient?.patientProfile?.lastName}
                  </strong>
                  <div className="small muted">{formatDateTime(a.startAt)}</div>
                </div>
              </div>
              <span className={`badge ${statusBadge(a.status)}`}>{a.status}</span>
            </div>
            {a.symptoms && (
              <p className="small muted" style={{ margin: '12px 0 0' }}>
                Reason: {a.symptoms}
              </p>
            )}
            {a.consultation && (
              <div style={{ marginTop: 16 }}>
                <Link className="btn btn-sm btn-primary" href={`/doctor/consultation/${a.consultation.id}`}>
                  Open consultation
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
