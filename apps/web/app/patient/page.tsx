'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { api, formatDateTime, initials } from '../lib/api';
import type { Appointment, PatientProfile } from '../lib/types';

export default function PatientDashboard() {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    birthday: '',
    weightKg: '',
    heightCm: '',
    phone: '',
    address: '',
    medicalHistory: '',
  });

  useEffect(() => {
    api<PatientProfile>('/patients/me').then(setProfile);
    api<Appointment[]>('/patients/me/appointments').then(setAppointments);
  }, []);

  useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.firstName ?? '',
        lastName: profile.lastName ?? '',
        birthday: profile.birthday?.slice(0, 10) ?? '',
        weightKg: profile.weightKg != null ? String(profile.weightKg) : '',
        heightCm: profile.heightCm != null ? String(profile.heightCm) : '',
        phone: profile.phone ?? '',
        address: profile.address ?? '',
        medicalHistory: profile.medicalHistory ?? '',
      });
    }
  }, [profile]);

  const update = useCallback((key: string, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }, []);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await api('/patients/me', {
      method: 'PATCH',
      body: {
        firstName: form.firstName,
        lastName: form.lastName,
        birthday: form.birthday || undefined,
        weightKg: form.weightKg ? Number(form.weightKg) : undefined,
        heightCm: form.heightCm ? Number(form.heightCm) : undefined,
        phone: form.phone,
        address: form.address,
        medicalHistory: form.medicalHistory,
      },
    });
    setSaving(false);
    setSaved(true);
  }

  const upcoming = appointments.filter(
    (a) => a.status === 'SCHEDULED' && new Date(a.startAt) > new Date(),
  );

  return (
    <div className="container page">
      <div className="page-head">
        <div>
          <h1>Welcome, {profile ? profile.firstName : '…'}</h1>
          <p className="muted">Your health hub.</p>
        </div>
        <Link href="/patient/discover" className="btn btn-primary">
          Book a consultation
        </Link>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>Your profile</h3>
          <form onSubmit={saveProfile}>
            {saved && <div className="success-banner">Profile saved.</div>}
            <div className="grid grid-2" style={{ gap: 12 }}>
              <div className="field">
                <label>First name</label>
                <input value={form.firstName} onChange={(e) => update('firstName', e.target.value)} />
              </div>
              <div className="field">
                <label>Last name</label>
                <input value={form.lastName} onChange={(e) => update('lastName', e.target.value)} />
              </div>
              <div className="field">
                <label>Birthday</label>
                <input type="date" value={form.birthday} onChange={(e) => update('birthday', e.target.value)} />
              </div>
              <div className="field">
                <label>Phone</label>
                <input value={form.phone} onChange={(e) => update('phone', e.target.value)} />
              </div>
              <div className="field">
                <label>Weight (kg)</label>
                <input type="number" value={form.weightKg} onChange={(e) => update('weightKg', e.target.value)} />
              </div>
              <div className="field">
                <label>Height (cm)</label>
                <input type="number" value={form.heightCm} onChange={(e) => update('heightCm', e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label>Address</label>
              <input value={form.address} onChange={(e) => update('address', e.target.value)} />
            </div>
            <div className="field">
              <label>Medical history</label>
              <textarea
                rows={3}
                value={form.medicalHistory}
                onChange={(e) => update('medicalHistory', e.target.value)}
              />
            </div>
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save profile'}
            </button>
          </form>
        </div>

        <div>
          <div className="card">
            <h3>Upcoming appointments</h3>
            {upcoming.length === 0 ? (
              <p className="muted">No upcoming appointments.</p>
            ) : (
              <div className="grid" style={{ gap: 12 }}>
                {upcoming.map((a) => (
                  <div key={a.id} className="row space-between" style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                    <div className="row">
                      <span className="avatar">{initials(a.doctor?.doctorProfile?.firstName, a.doctor?.doctorProfile?.lastName)}</span>
                      <div>
                        <strong>
                          Dr. {a.doctor?.doctorProfile?.firstName} {a.doctor?.doctorProfile?.lastName}
                        </strong>
                        <div className="small muted">{formatDateTime(a.startAt)}</div>
                      </div>
                    </div>
                    {a.consultation && (
                      <Link className="btn btn-sm btn-secondary" href={`/patient/consultation/${a.consultation.id}`}>
                        Join
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div style={{ marginTop: 16 }}>
              <Link href="/patient/appointments">View all appointments →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
