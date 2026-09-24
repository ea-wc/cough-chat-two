'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface AdminUser {
  id: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  patientProfile?: { firstName: string; lastName: string } | null;
  doctorProfile?: { firstName: string; lastName: string } | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [query, setQuery] = useState('');

  const load = useCallback((q?: string) => {
    api<AdminUser[]>(`/admin/users${q ? `?q=${encodeURIComponent(q)}` : ''}`).then(setUsers);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function setStatus(id: string, status: string, reason?: string) {
    await api(`/admin/users/${id}`, { method: 'PATCH', body: { status, reason } });
    load(query);
  }

  function name(u: AdminUser) {
    const p = u.patientProfile ?? u.doctorProfile;
    return p ? `${p.firstName} ${p.lastName}` : '—';
  }

  const statusBadge = (s: string) =>
    s === 'ACTIVE' ? 'badge-green' : s === 'SUSPENDED' ? 'badge-amber' : 'badge-red';

  return (
    <div className="container page">
      <div className="page-head">
        <div>
          <h1>User management</h1>
          <p className="muted">Search and manage patient and doctor accounts.</p>
        </div>
      </div>

      <form
        className="row"
        style={{ marginBottom: 24 }}
        onSubmit={(e) => {
          e.preventDefault();
          load(query);
        }}
      >
        <input
          placeholder="Search by email…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14 }}
        />
        <button className="btn btn-secondary" type="submit">
          Search
        </button>
      </form>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{name(u)}</td>
                <td>{u.email}</td>
                <td>
                  <span className="badge badge-blue">{u.role}</span>
                </td>
                <td>
                  <span className={`badge ${statusBadge(u.status)}`}>{u.status}</span>
                </td>
                <td>
                  <div className="row">
                    {u.status !== 'ACTIVE' && (
                      <button className="btn btn-sm btn-secondary" onClick={() => setStatus(u.id, 'ACTIVE')}>
                        Activate
                      </button>
                    )}
                    {u.status !== 'SUSPENDED' && (
                      <button className="btn btn-sm btn-secondary" onClick={() => setStatus(u.id, 'SUSPENDED', 'Admin action')}>
                        Suspend
                      </button>
                    )}
                    {u.status !== 'DEACTIVATED' && (
                      <button className="btn btn-sm btn-danger" onClick={() => setStatus(u.id, 'DEACTIVATED', 'Admin action')}>
                        Deactivate
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
