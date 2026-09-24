'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, formatDateTime } from '../../lib/api';
import type { Availability } from '../../lib/types';

export default function SchedulePage() {
  const [slots, setSlots] = useState<Availability[]>([]);
  const [startAt, setStartAt] = useState('');
  const [duration, setDuration] = useState('60');
  const [error, setError] = useState('');

  const load = useCallback(() => {
    api<Availability[]>('/doctors/me/availability').then(setSlots);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const start = new Date(startAt);
    const end = new Date(start.getTime() + Number(duration) * 60 * 1000);
    try {
      await api('/doctors/me/availability', {
        method: 'POST',
        body: { startAt: start.toISOString(), endAt: end.toISOString() },
      });
      setStartAt('');
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create slot');
    }
  }

  async function remove(id: string) {
    await api(`/doctors/me/availability/${id}`, { method: 'DELETE' });
    load();
  }

  const statusBadge = (s: string) =>
    s === 'AVAILABLE' ? 'badge-green' : s === 'BOOKED' ? 'badge-blue' : 'badge-amber';

  return (
    <div className="container page">
      <div className="page-head">
        <div>
          <h1>Availability</h1>
          <p className="muted">Create and manage your consultation slots.</p>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>Add a slot</h3>
          <form onSubmit={create}>
            {error && <div className="error-banner">{error}</div>}
            <div className="field">
              <label>Start time</label>
              <input type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} required />
            </div>
            <div className="field">
              <label>Duration (minutes)</label>
              <select value={duration} onChange={(e) => setDuration(e.target.value)}>
                <option value="30">30 minutes</option>
                <option value="60">60 minutes</option>
              </select>
            </div>
            <button className="btn btn-primary" type="submit">
              Add slot
            </button>
          </form>
        </div>

        <div className="card">
          <h3>Your slots</h3>
          <div className="grid">
            {slots.length === 0 && <p className="muted">No slots yet.</p>}
            {slots.map((s) => (
              <div key={s.id} className="row space-between" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                <div>
                  <div>{formatDateTime(s.startAt)}</div>
                  <span className={`badge ${statusBadge(s.status)}`}>{s.status}</span>
                </div>
                {s.status === 'AVAILABLE' && (
                  <button className="btn btn-sm btn-danger" onClick={() => remove(s.id)}>
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
