'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../lib/auth';

const PATIENT_LINKS = [
  { href: '/patient', label: 'Dashboard' },
  { href: '/patient/discover', label: 'Find doctors' },
  { href: '/patient/match', label: 'Match me' },
  { href: '/patient/appointments', label: 'Appointments' },
  { href: '/patient/records', label: 'Records' },
];

const DOCTOR_LINKS = [
  { href: '/doctor', label: 'Dashboard' },
  { href: '/doctor/schedule', label: 'Availability' },
  { href: '/doctor/appointments', label: 'Appointments' },
];

const ADMIN_LINKS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/doctors', label: 'Doctors' },
  { href: '/admin/appointments', label: 'Appointments' },
  { href: '/admin/audit', label: 'Audit' },
];

export default function Nav() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const links = !user
    ? []
    : user.role === 'PATIENT'
      ? PATIENT_LINKS
      : user.role === 'DOCTOR'
        ? DOCTOR_LINKS
        : ADMIN_LINKS;

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href={user ? `/${user.role.toLowerCase()}` : '/'} className="brand">
          <span className="brand-dot" />
          TeleHealth
        </Link>
        <div className="nav-links">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={pathname.startsWith(l.href) ? 'active' : ''}>
              {l.label}
            </Link>
          ))}
          {user && (
            <>
              <Link href="/notifications" className={pathname.startsWith('/notifications') ? 'active' : ''}>
                Notifications
              </Link>
              <button className="nav-link-btn" onClick={logout}>
                Sign out
              </button>
            </>
          )}
          {!user && (
            <>
              <Link href="/login" className={pathname === '/login' ? 'active' : ''}>
                Sign in
              </Link>
              <Link href="/register" className={pathname === '/register' ? 'active' : ''}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
