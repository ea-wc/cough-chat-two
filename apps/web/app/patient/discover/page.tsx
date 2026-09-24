'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, formatDateTime, initials } from '../../lib/api';
import type { Appointment, DoctorProfile } from '../../lib/types';

export default function DiscoverPage() {
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<DoctorProfile | null>(null);
  const [symptoms, setSymptoms] = useState('');
  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = useCallback((q?: string) => {
    const url = q ? `/doctors/search?q=${encodeURIComponent(q)}` : '/doctors';
    api<DoctorProfile[]>(url).then(setDoctors);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    load(query);
  }

  async function openDoctor(id: string) {
    const d = await api<DoctorProfile>(`/doctors/${id}`);
    setSelected(d);
    setMessage('');
    setError('');
  }

  async function book(slotId: string) {
    setBooking(true);
    setError('');
    try {
      await api<Appointment>('/appointments', {
        method: 'POST',
        body: { availabilityId: slotId, symptoms: symptoms || undefined },
      });
      setMessage('Appointment booked!');
      if (selected) await openDoctor(selected.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Booking failed');
    } finally {
      setBooking(false);
    }
  }

  return (
    <div className="container page">
      <div className="page-head">
        <div>
          <h1>Find a doctor</h1>
          <p className="muted">Browse specialists and book an available time.</p>
        </div>
      </div>

      <form className="row" onSubmit={onSearch} style={{ marginBottom: 24 }}>
        <input
          className="field-input"
          placeholder="Search by name or specialization…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14 }}
        />
        <button className="btn btn-secondary" type="submit">
          Search
        </button>
      </form>

      {selected ? (
        <div className="card">
          <div className="row space-between">
            <div className="row">
              <span className="avatar">{initials(selected.firstName, selected.lastName)}</span>
              <div>
                <h2 style={{ margin: 0 }}>
                  Dr. {selected.firstName} {selected.lastName}
                </h2>
                <span className="badge badge-blue">{selected.specialization}</span>
              </div>
            </div>
            <button className="btn btn-sm btn-secondary" onClick={() => setSelected(null)}>
              Back
            </button>
          </div>
          {selected.bio && <p className="muted">{selected.bio}</p>}

          {message && <div className="success-banner">{message}</div>}
          {error && <div className="error-banner">{error}</div>}

          <div className="field" style={{ maxWidth: 440, marginTop: 12 }}>
            <label>Reason for visit (optional)</label>
            <input value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="e.g. persistent cough" />
          </div>

          <h3>Available times</h3>
          {!selected.availabilities || selected.availabilities.length === 0 ? (
            <p className="muted">No available slots.</p>
          ) : (
            <div className="grid grid-3">
              {selected.availabilities.map((slot) => (
                <button
                  key={slot.id}
                  className="btn btn-secondary"
                  onClick={() => book(slot.id)}
                  disabled={booking}
                  style={{ justifyContent: 'space-between' }}
                >
                  <span>{formatDateTime(slot.startAt)}</span>
                  <span className="badge badge-green">Available</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-2">
          {doctors.map((d) => (
            <div className="card" key={d.id}>
              <div className="row">
                <span className="avatar">{initials(d.firstName, d.lastName)}</span>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0 }}>
                    Dr. {d.firstName} {d.lastName}
                  </h3>
                  <span className="badge badge-blue">{d.specialization}</span>
                </div>
              </div>
              {d.bio && (
                <p className="muted small" style={{ margin: '12px 0' }}>
                  {d.bio}
                </p>
              )}
              <div className="row space-between">
                <span className="small muted">{d.availabilities?.length ?? 0} slots available</span>
                <button className="btn btn-sm btn-primary" onClick={() => openDoctor(d.id)}>
                  View & book
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
