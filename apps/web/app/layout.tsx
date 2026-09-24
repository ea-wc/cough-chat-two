import type { Metadata } from 'next';
import Link from 'next/link';
import { Geist, Geist_Mono } from 'next/font/google';
import Nav from './components/Nav';
import { AuthProvider } from './lib/auth';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'TeleHealth — Online Doctor Consultations',
  description:
    'A telehealth platform to find a doctor, book a consultation, and connect online.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <AuthProvider>
          <Nav />
          <main>{children}</main>
          <footer className="container" style={{ padding: '40px 24px 64px', color: 'var(--muted)', fontSize: 13 }}>
            <div className="divider" />
            <p>
              TeleHealth is a <strong>fictional prototype</strong> for demonstration purposes only. It is not a
              real medical service and does not provide medical advice, diagnosis, or treatment.
            </p>
            <div className="row" style={{ gap: 16 }}>
              <Link href="/terms">Terms</Link>
              <Link href="/privacy">Privacy</Link>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
