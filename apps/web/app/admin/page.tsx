'use client';

import { useEffect, useState } from 'react';
import { api } from '../lib/api';

interface Dashboard {
  users: { patients: number; doctors: number; admins: number; total: number };
  appointments: Record<string, number>;
  consultations: Record<string, number>;
}

export default function AdminDashboard() {
  const [data, setData] = useState<Dashboard | null>(null);

  useEffect(() => {
    api<Dashboard>('/admin/dashboard').then(setData);
  }, []);

  if (!data) return <div className="container page">Loading…</div>;

  const stats = [
    { label: 'Patients', value: data.users.patients },
    { label: 'Doctors', value: data.users.doctors },
    { label: 'Admins', value: data.users.admins },
    { label: 'Total users', value: data.users.total },
    { label: 'Scheduled appointments', value: data.appointments.SCHEDULED ?? 0 },
    { label: 'Completed consultations', value: data.consultations.COMPLETED ?? 0 },
  ];

  return (
    <div className="container page">
      <div className="page-head">
        <div>
          <h1>Operational dashboard</h1>
          <p className="muted">Database-derived counts across the platform.</p>
        </div>
      </div>

      <div className="grid grid-3">
        {stats.map((s) => (
          <div className="card stat" key={s.label}>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-2" style={{ marginTop: 24 }}>
        <div className="card">
          <h3>Appointments by status</h3>
          {Object.entries(data.appointments).map(([k, v]) => (
            <div className="row space-between" key={k} style={{ borderBottom: '1px solid var(--border)', padding: '6px 0' }}>
              <span>{k}</span>
              <strong>{v}</strong>
            </div>
          ))}
        </div>
        <div className="card">
          <h3>Consultations by state</h3>
          {Object.entries(data.consultations).map(([k, v]) => (
            <div className="row space-between" key={k} style={{ borderBottom: '1px solid var(--border)', padding: '6px 0' }}>
              <span>{k}</span>
              <strong>{v}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
