'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, formatDateTime, initials } from '../lib/api';
import { useAuth } from '../lib/auth';

interface Workspace {
  id: string;
  state: string;
  notes?: string | null;
  summary?: string | null;
  prescriptions: { id: string; medication: string; dosage: string; instructions?: string | null; issuedAt: string }[];
  appointment: {
    id: string;
    startAt: string;
    endAt: string;
    status: string;
    symptoms?: string | null;
    doctor: { email: string; doctorProfile?: { firstName: string; lastName: string; specialization: string } };
    patient: { email: string; patientProfile?: { firstName: string; lastName: string } };
  };
}

const STATES = ['SCHEDULED', 'JOINED', 'IN_PROGRESS', 'COMPLETED'] as const;
const STATE_LABEL: Record<string, string> = {
  SCHEDULED: 'Scheduled',
  JOINED: 'Joined',
  IN_PROGRESS: 'In progress',
  COMPLETED: 'Completed',
};

export default function ConsultationWorkspace({ id }: { id: string }) {
  const { user } = useAuth();
  const [ws, setWs] = useState<Workspace | null>(null);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState('');
  const [summary, setSummary] = useState('');
  const [medication, setMedication] = useState('');
  const [dosage, setDosage] = useState('');
  const [instructions, setInstructions] = useState('');

  const load = useCallback(() => {
    api<Workspace>(`/consultations/${id}`)
      .then((w) => {
        setWs(w);
        setNotes(w.notes ?? '');
        setSummary(w.summary ?? '');
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load consultation'));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const isDoctor = user?.role === 'DOCTOR';

  async function setState(state: string) {
    setError('');
    try {
      await api(`/consultations/${id}/state`, { method: 'POST', body: { state } });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update state');
    }
  }

  async function saveNotes(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await api(`/consultations/${id}/notes`, { method: 'POST', body: { notes, summary } });
      setMedication('');
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save notes');
    }
  }

  async function addPrescription(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await api(`/consultations/${id}/prescriptions`, {
        method: 'POST',
        body: { medication, dosage, instructions: instructions || undefined },
      });
      setMedication('');
      setDosage('');
      setInstructions('');
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add prescription');
    }
  }

  if (!ws) return <div className="container page">Loading consultation…</div>;

  const { appointment } = ws;
  const doctor = appointment.doctor.doctorProfile;
  const patient = appointment.patient.patientProfile;

  return (
    <div className="container page">
      <div className="page-head">
        <div>
          <h1>Consultation</h1>
          <p className="muted">
            {doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Doctor'} · {patient ? `${patient.firstName} ${patient.lastName}` : 'Patient'}
          </p>
        </div>
        <span className="badge badge-blue">{STATE_LABEL[ws.state] ?? ws.state}</span>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="grid grid-2">
        <div className="card">
          <h3>Appointment context</h3>
          <div className="row space-between">
            <span className="small muted">Time</span>
            <span>{formatDateTime(appointment.startAt)}</span>
          </div>
          <div className="row space-between" style={{ marginTop: 8 }}>
            <span className="small muted">Doctor</span>
            <span>
              {doctor ? `Dr. ${doctor.firstName} ${doctor.lastName} (${doctor.specialization})` : '—'}
            </span>
          </div>
          {appointment.symptoms && (
            <div className="row space-between" style={{ marginTop: 8 }}>
              <span className="small muted">Reason</span>
              <span>{appointment.symptoms}</span>
            </div>
          )}

          {isDoctor && (
            <div style={{ marginTop: 20 }}>
              <p className="small muted">Update state</p>
              <div className="row">
                {STATES.map((s) => (
                  <button
                    key={s}
                    className={`btn btn-sm ${ws.state === s ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setState(s)}
                  >
                    {STATE_LABEL[s]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <h3>Notes & summary</h3>
          {isDoctor ? (
            <form onSubmit={saveNotes}>
              <div className="field">
                <label>Consultation notes</label>
                <textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
              <div className="field">
                <label>Summary</label>
                <input value={summary} onChange={(e) => setSummary(e.target.value)} />
              </div>
              <button className="btn btn-primary" type="submit">
                Save notes
              </button>
            </form>
          ) : (
            <>
              {ws.summary && <p>{ws.summary}</p>}
              {ws.notes ? (
                <p className="muted" style={{ whiteSpace: 'pre-wrap' }}>
                  {ws.notes}
                </p>
              ) : (
                <p className="muted">No notes recorded yet.</p>
              )}
            </>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3>Prescriptions</h3>
        {ws.prescriptions.length === 0 ? (
          <p className="muted">No prescriptions.</p>
        ) : (
          <div className="grid">
            {ws.prescriptions.map((p) => (
              <div key={p.id} className="row space-between" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                <div>
                  <strong>{p.medication}</strong> <span className="muted">— {p.dosage}</span>
                  {p.instructions && <div className="small muted">{p.instructions}</div>}
                </div>
                <span className="small muted">{formatDateTime(p.issuedAt)}</span>
              </div>
            ))}
          </div>
        )}

        {isDoctor && (
          <form className="row" onSubmit={addPrescription} style={{ marginTop: 16, alignItems: 'flex-end' }}>
            <div className="field" style={{ margin: 0, flex: 1 }}>
              <label>Medication</label>
              <input value={medication} onChange={(e) => setMedication(e.target.value)} required />
            </div>
            <div className="field" style={{ margin: 0, flex: 1 }}>
              <label>Dosage</label>
              <input value={dosage} onChange={(e) => setDosage(e.target.value)} required />
            </div>
            <div className="field" style={{ margin: 0, flex: 1 }}>
              <label>Instructions</label>
              <input value={instructions} onChange={(e) => setInstructions(e.target.value)} />
            </div>
            <button className="btn btn-secondary" type="submit">
              Add
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
