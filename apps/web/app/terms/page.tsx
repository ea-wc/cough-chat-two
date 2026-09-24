export default function TermsPage() {
  return (
    <div className="container page" style={{ maxWidth: 720 }}>
      <h1>Terms of Service</h1>
      <p className="muted">Last updated: {new Date().toISOString().slice(0, 10)}</p>
      <div className="card" style={{ marginTop: 16 }}>
        <h3>Fictional prototype</h3>
        <p>
          TeleHealth is a demonstration prototype and is not a licensed medical service. It does not
          provide medical advice, diagnosis, or treatment. Do not rely on this application for real
          healthcare needs.
        </p>
        <h3>Accounts</h3>
        <p>
          Accounts and data you create here are fictional and used only to demonstrate the product.
          You agree not to submit real personal health information.
        </p>
        <h3>Acceptable use</h3>
        <p>
          You agree to use the service lawfully and not to interfere with its operation or other
          users&apos; access.
        </p>
        <h3>Changes</h3>
        <p>These terms may be updated at any time as the prototype evolves.</p>
      </div>
    </div>
  );
}
