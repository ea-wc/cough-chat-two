'use client';

import { useState } from 'react';
import { api, formatDateTime, initials } from '../../lib/api';
import type { Appointment, DoctorProfile } from '../../lib/types';

interface MatchResult {
  specialties: string[];
  doctors: DoctorProfile[];
}

export default function MatchPage() {
  const [description, setDescription] = useState('');
  const [result, setResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookedId, setBookedId] = useState('');

  async function match(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api<MatchResult>('/doctors/match', {
        method: 'POST',
        body: { description },
      });
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Matching failed');
    } finally {
      setLoading(false);
    }
  }

  async function book(doctor: DoctorProfile) {
    const slot = doctor.availabilities?.[0];
    if (!slot) return;
    try {
      await api<Appointment>('/appointments', { method: 'POST', body: { availabilityId: slot.id } });
      setBookedId(doctor.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed');
    }
  }

  return (
    <div className="container page">
      <div className="page-head">
        <div>
          <h1>Match me with a doctor</h1>
          <p className="muted">Describe your symptoms or concerns and we&apos;ll suggest a specialist.</p>
        </div>
      </div>

      <form className="card" onSubmit={match} style={{ maxWidth: 640 }}>
        <div className="field">
          <label>How can we help?</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. I've had a persistent cough and mild fever for a few days…"
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Matching…' : 'Find doctors'}
        </button>
        {error && <div className="error-banner" style={{ marginTop: 12 }}>{error}</div>}
      </form>

      {result && (
        <div style={{ marginTop: 32 }}>
          <p className="muted">
            {result.specialties.length > 0 ? (
              <>Suggested specialties: {result.specialties.join(', ')}</>
            ) : (
              <>No specific specialty matched — here are our general doctors.</>
            )}
          </p>
          <div className="grid grid-2" style={{ marginTop: 16 }}>
            {result.doctors.map((d) => (
              <div className="card" key={d.id}>
                <div className="row space-between">
                  <div className="row">
                    <span className="avatar">{initials(d.firstName, d.lastName)}</span>
                    <div>
                      <h3 style={{ margin: 0 }}>
                        Dr. {d.firstName} {d.lastName}
                      </h3>
                      <span className="badge badge-blue">{d.specialization}</span>
                    </div>
                  </div>
                  {d.matchScore != null && d.matchScore > 0 && (
                    <span className="badge badge-green">Match</span>
                  )}
                </div>
                {d.nextAvailability && (
                  <p className="small muted" style={{ margin: '12px 0 0' }}>
                    Next available: {formatDateTime(d.nextAvailability)}
                  </p>
                )}
                <div style={{ marginTop: 16 }}>
                  {bookedId === d.id ? (
                    <span className="badge badge-green">Booked!</span>
                  ) : d.availabilities && d.availabilities.length > 0 ? (
                    <button className="btn btn-sm btn-primary" onClick={() => book(d)}>
                      Book next slot
                    </button>
                  ) : (
                    <span className="small muted">No slots available</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
