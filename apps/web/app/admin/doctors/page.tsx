'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface AdminDoctor {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
  bio?: string | null;
  approvalStatus: string;
  user?: { email: string; status: string };
}

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<AdminDoctor[]>([]);

  const load = useCallback(() => {
    api<AdminDoctor[]>('/admin/doctors').then(setDoctors);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function review(id: string, approvalStatus: string) {
    await api(`/admin/doctors/${id}`, { method: 'PATCH', body: { approvalStatus } });
    load();
  }

  const statusBadge = (s: string) =>
    s === 'APPROVED' ? 'badge-green' : s === 'REJECTED' ? 'badge-red' : 'badge-amber';

  return (
    <div className="container page">
      <div className="page-head">
        <div>
          <h1>Doctor profile review</h1>
          <p className="muted">Approve, reject, or update doctor profiles.</p>
        </div>
      </div>

      <div className="grid grid-2">
        {doctors.map((d) => (
          <div className="card" key={d.id}>
            <div className="row space-between">
              <div>
                <h3 style={{ margin: 0 }}>
                  Dr. {d.firstName} {d.lastName}
                </h3>
                <span className="badge badge-blue">{d.specialization}</span>
              </div>
              <span className={`badge ${statusBadge(d.approvalStatus)}`}>{d.approvalStatus}</span>
            </div>
            {d.bio && (
              <p className="small muted" style={{ margin: '12px 0' }}>
                {d.bio}
              </p>
            )}
            <div className="small muted">Account: {d.user?.email} ({d.user?.status})</div>
            <div className="row" style={{ marginTop: 16 }}>
              {d.approvalStatus !== 'APPROVED' && (
                <button className="btn btn-sm btn-primary" onClick={() => review(d.id, 'APPROVED')}>
                  Approve
                </button>
              )}
              {d.approvalStatus !== 'REJECTED' && (
                <button className="btn btn-sm btn-danger" onClick={() => review(d.id, 'REJECTED')}>
                  Reject
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
