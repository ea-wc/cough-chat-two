'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, formatDateTime } from '../lib/api';
import type { Notification } from '../lib/types';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const load = useCallback(() => {
    api<Notification[]>('/notifications').then(setNotifications);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function markRead(id: string) {
    await api(`/notifications/${id}/read`, { method: 'POST' });
    load();
  }

  return (
    <div className="container page" style={{ maxWidth: 720 }}>
      <div className="page-head">
        <div>
          <h1>Notifications</h1>
          <p className="muted">Booking, cancellation, and schedule updates.</p>
        </div>
      </div>

      <div className="grid">
        {notifications.length === 0 && <p className="muted">No notifications.</p>}
        {notifications.map((n) => (
          <div className="card" key={n.id} style={{ padding: 16 }}>
            <div className="row space-between">
              <div style={{ flex: 1 }}>
                <div className="row" style={{ gap: 8 }}>
                  {!n.read && <span className="badge badge-blue">New</span>}
                  <strong>{n.title}</strong>
                </div>
                <p className="muted" style={{ margin: '8px 0 0' }}>
                  {n.message}
                </p>
                <div className="small muted" style={{ marginTop: 4 }}>
                  {formatDateTime(n.createdAt)}
                </div>
              </div>
              {!n.read && !n.id.startsWith('upcoming-') && (
                <button className="btn btn-sm btn-secondary" onClick={() => markRead(n.id)}>
                  Mark read
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
