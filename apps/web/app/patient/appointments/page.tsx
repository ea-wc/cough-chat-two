'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { api, formatDateTime, initials } from '../../lib/api';
import type { Appointment, DoctorProfile } from '../../lib/types';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState('');
  const [rescheduling, setRescheduling] = useState<string | null>(null);
  const [slots, setSlots] = useState<DoctorProfile | null>(null);

  const load = useCallback(() => {
    api<Appointment[]>('/patients/me/appointments').then(setAppointments);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function cancel(id: string) {
    setError('');
    try {
      await api(`/appointments/${id}/cancel`, { method: 'POST' });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Cancel failed');
    }
  }

  async function openReschedule(appt: Appointment) {
    setError('');
    setRescheduling(appt.id);
    const doctor = await api<DoctorProfile>(`/doctors/${appt.doctor?.doctorProfile?.id}`);
    setSlots(doctor);
  }

  async function reschedule(appt: Appointment, availabilityId: string) {
    setError('');
    try {
      await api(`/appointments/${appt.id}/reschedule`, { method: 'POST', body: { availabilityId } });
      setRescheduling(null);
      setSlots(null);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Reschedule failed');
    }
  }

  const statusBadge = (s: string) =>
    s === 'SCHEDULED' ? 'badge-green' : s === 'CANCELLED' ? 'badge-red' : 'badge-blue';

  return (
    <div className="container page">
      <div className="page-head">
        <div>
          <h1>Appointments</h1>
          <p className="muted">Book, reschedule, or cancel consultations.</p>
        </div>
        <Link href="/patient/discover" className="btn btn-primary">
          New appointment
        </Link>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="grid">
        {appointments.length === 0 && <p className="muted">No appointments yet.</p>}
        {appointments.map((a) => (
          <div className="card" key={a.id}>
            <div className="row space-between">
              <div className="row">
                <span className="avatar">{initials(a.doctor?.doctorProfile?.firstName, a.doctor?.doctorProfile?.lastName)}</span>
                <div>
                  <strong>
                    Dr. {a.doctor?.doctorProfile?.firstName} {a.doctor?.doctorProfile?.lastName}
                  </strong>
                  <div className="small muted">
                    {a.doctor?.doctorProfile?.specialization} · {formatDateTime(a.startAt)}
                  </div>
                </div>
              </div>
              <span className={`badge ${statusBadge(a.status)}`}>{a.status}</span>
            </div>

            {a.symptoms && (
              <p className="small muted" style={{ margin: '12px 0 0' }}>
                Reason: {a.symptoms}
              </p>
            )}

            <div className="row" style={{ marginTop: 16 }}>
              {a.consultation && (
                <Link className="btn btn-sm btn-secondary" href={`/patient/consultation/${a.consultation.id}`}>
                  Open consultation
                </Link>
              )}
              {a.status === 'SCHEDULED' && (
                <>
                  <button className="btn btn-sm btn-secondary" onClick={() => openReschedule(a)}>
                    Reschedule
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => cancel(a.id)}>
                    Cancel
                  </button>
                </>
              )}
            </div>

            {rescheduling === a.id && slots && (
              <div style={{ marginTop: 16, padding: 16, background: 'var(--bg)', borderRadius: 10 }}>
                <p className="small muted">Pick a new time:</p>
                <div className="grid grid-3">
                  {slots.availabilities?.map((slot) => (
                    <button key={slot.id} className="btn btn-sm btn-secondary" onClick={() => reschedule(a, slot.id)}>
                      {formatDateTime(slot.startAt)}
                    </button>
                  ))}
                </div>
                <button className="btn btn-sm" style={{ marginTop: 12 }} onClick={() => setRescheduling(null)}>
                  Close
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
