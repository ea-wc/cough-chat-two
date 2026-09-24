export default function PrivacyPage() {
  return (
    <div className="container page" style={{ maxWidth: 720 }}>
      <h1>Privacy Policy</h1>
      <p className="muted">Last updated: {new Date().toISOString().slice(0, 10)}</p>
      <div className="card" style={{ marginTop: 16 }}>
        <h3>Data we collect</h3>
        <p>
          For the purposes of this prototype, we collect the account and profile information you
          provide (name, contact details, and any profile fields) and store it in the application
          database.
        </p>
        <h3>How we use it</h3>
        <p>
          Data is used solely to demonstrate the product&apos;s features — doctor discovery,
          appointment booking, and consultation records. It is not shared with any third party.
        </p>
        <h3>Storage</h3>
        <p>
          All data is stored in the application&apos;s own PostgreSQL database. No external analytics,
          tracking, or marketing services are used.
        </p>
        <h3>Security</h3>
        <p>
          Passwords are hashed, and access to records is restricted by role. As this is a prototype,
          do not provide real personal health information.
        </p>
      </div>
    </div>
  );
}
