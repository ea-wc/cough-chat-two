import Link from 'next/link';

const FEATURES = [
  {
    title: 'Find the right doctor',
    body: 'Browse specialists and get matched to a doctor based on your symptoms and concerns.',
  },
  {
    title: 'Book in seconds',
    body: 'See real availability and book, reschedule, or cancel consultations without the phone call.',
  },
  {
    title: 'Connect online',
    body: 'Join a secure consultation workspace where your doctor records notes and prescriptions.',
  },
  {
    title: 'Your records, in one place',
    body: 'Appointment history, consultation notes, and prescriptions — all accessible to you.',
  },
];

const STEPS = [
  { title: 'Register', body: 'Create a patient or doctor account in under a minute.' },
  { title: 'Match & book', body: 'Describe your concern, get matched, and pick a time that works.' },
  { title: 'Consult', body: 'Join your consultation and receive notes and prescriptions.' },
];

export default function Home() {
  return (
    <div>
      <section className="hero container">
        <h1>Quality healthcare, from wherever you are.</h1>
        <p>
          TeleHealth connects you with trusted doctors online. Register, find a specialist, book a
          consultation, and get care — all in one place.
        </p>
        <div className="hero-actions">
          <Link href="/register" className="btn btn-primary">
            Get started
          </Link>
          <Link href="/login" className="btn btn-secondary">
            Sign in
          </Link>
        </div>
      </section>

      <section className="section container">
        <h2>Everything you need for a consultation</h2>
        <div className="grid grid-2" style={{ marginTop: 24 }}>
          {FEATURES.map((f) => (
            <div className="card" key={f.title}>
              <h3>{f.title}</h3>
              <p className="muted" style={{ margin: 0 }}>
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="section container">
        <h2>How it works</h2>
        <div className="grid grid-3" style={{ marginTop: 24 }}>
          {STEPS.map((s, i) => (
            <div className="card" key={s.title}>
              <div className="badge badge-blue" style={{ marginBottom: 12 }}>
                Step {i + 1}
              </div>
              <h3>{s.title}</h3>
              <p className="muted" style={{ margin: 0 }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
          <h2>Ready to see a doctor?</h2>
          <p className="muted">Register as a patient to book your first consultation.</p>
          <div className="row" style={{ justifyContent: 'center', marginTop: 16 }}>
            <Link href="/register" className="btn btn-primary">
              Register as a patient
            </Link>
            <Link href="/register?role=doctor" className="btn btn-secondary">
              I&apos;m a doctor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
