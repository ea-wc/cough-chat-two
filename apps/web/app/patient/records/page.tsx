'use client';

import { useEffect, useState } from 'react';
import { api, formatDateTime, initials } from '../../lib/api';
import type { Appointment, Prescription } from '../../lib/types';

export default function RecordsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  useEffect(() => {
    api<Appointment[]>('/patients/me/appointments').then(setAppointments);
    api<Prescription[]>('/patients/me/prescriptions').then(setPrescriptions);
  }, []);

  const withNotes = appointments.filter((a) => a.consultation?.notes || a.consultation?.summary);

  return (
    <div className="container page">
      <div className="page-head">
        <div>
          <h1>Medical records</h1>
          <p className="muted">Your consultation notes and prescriptions.</p>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>Prescriptions</h3>
          {prescriptions.length === 0 ? (
            <p className="muted">No prescriptions.</p>
          ) : (
            <div className="grid">
              {prescriptions.map((p) => (
                <div key={p.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <strong>{p.medication}</strong> <span className="muted">— {p.dosage}</span>
                  {p.instructions && <div className="small muted">{p.instructions}</div>}
                  <div className="small muted">Issued {formatDateTime(p.issuedAt)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3>Consultation notes</h3>
          {withNotes.length === 0 ? (
            <p className="muted">No consultation notes yet.</p>
          ) : (
            <div className="grid">
              {withNotes.map((a) => (
                <div key={a.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <div className="row">
                    <span className="avatar" style={{ width: 32, height: 32, fontSize: 13 }}>
                      {initials(a.doctor?.doctorProfile?.firstName, a.doctor?.doctorProfile?.lastName)}
                    </span>
                    <div>
                      <strong>
                        Dr. {a.doctor?.doctorProfile?.firstName} {a.doctor?.doctorProfile?.lastName}
                      </strong>
                      <div className="small muted">{formatDateTime(a.startAt)}</div>
                    </div>
                  </div>
                  {a.consultation?.summary && <p style={{ margin: '8px 0 0' }}>{a.consultation.summary}</p>}
                  {a.consultation?.notes && (
                    <p className="small muted" style={{ whiteSpace: 'pre-wrap', margin: '8px 0 0' }}>
                      {a.consultation.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
