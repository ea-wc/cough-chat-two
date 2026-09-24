'use client';

import { useEffect, useState } from 'react';
import { api, formatDateTime } from '../../lib/api';

interface AuditEntry {
  id: string;
  action: string;
  affectedRecord: string;
  reason?: string | null;
  timestamp: string;
  admin?: { email: string };
}

export default function AdminAuditPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);

  useEffect(() => {
    api<AuditEntry[]>('/admin/audit').then(setEntries);
  }, []);

  return (
    <div className="container page">
      <div className="page-head">
        <div>
          <h1>Audit log</h1>
          <p className="muted">Trace of administrator actions.</p>
        </div>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Admin</th>
              <th>Action</th>
              <th>Record</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 && (
              <tr>
                <td colSpan={5} className="muted">
                  No audit entries yet.
                </td>
              </tr>
            )}
            {entries.map((e) => (
              <tr key={e.id}>
                <td>{formatDateTime(e.timestamp)}</td>
                <td>{e.admin?.email}</td>
                <td>{e.action}</td>
                <td>{e.affectedRecord}</td>
                <td>{e.reason ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
