'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useAuth } from '../lib/auth';
import type { Role } from '../lib/types';

function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [role, setRole] = useState<Role>(params.get('role') === 'doctor' ? 'DOCTOR' : 'PATIENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({
        email,
        password,
        role,
        firstName,
        lastName,
        ...(role === 'DOCTOR' ? { specialization } : {}),
      });
      router.push(`/${role.toLowerCase()}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="card form-card" onSubmit={onSubmit}>
      <h2>Create an account</h2>
      <p className="muted small">Register as a patient or a doctor.</p>
      {error && <div className="error-banner">{error}</div>}

      <div className="field">
        <label>I am a…</label>
        <div className="row">
          <button
            type="button"
            className={`btn ${role === 'PATIENT' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setRole('PATIENT')}
          >
            Patient
          </button>
          <button
            type="button"
            className={`btn ${role === 'DOCTOR' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setRole('DOCTOR')}
          >
            Doctor
          </button>
        </div>
      </div>

      <div className="field">
        <label htmlFor="firstName">First name</label>
        <input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
      </div>
      <div className="field">
        <label htmlFor="lastName">Last name</label>
        <input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
      </div>
      {role === 'DOCTOR' && (
        <div className="field">
          <label htmlFor="specialization">Specialization</label>
          <input
            id="specialization"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            placeholder="e.g. Cardiology"
            required
          />
        </div>
      )}
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
        />
        <span className="small muted">At least 8 characters.</span>
      </div>

      <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%' }}>
        {loading ? 'Creating account…' : 'Register'}
      </button>
      <p className="small muted" style={{ textAlign: 'center', marginTop: 16 }}>
        Already have an account? <Link href="/login">Sign in</Link>
      </p>
    </form>
  );
}

export default function RegisterPage() {
  return (
    <div className="container">
      <Suspense>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
