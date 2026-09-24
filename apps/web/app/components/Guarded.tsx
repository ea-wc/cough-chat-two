'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../lib/auth';
import type { Role } from '../lib/types';

export default function Guarded({ roles, children }: { roles: Role[]; children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
    } else if (!roles.includes(user.role)) {
      router.replace(`/${user.role.toLowerCase()}`);
    }
  }, [loading, user, roles, router]);

  if (loading) {
    return <div className="container page">Loading…</div>;
  }
  if (!user || !roles.includes(user.role)) {
    return <div className="container page">Redirecting…</div>;
  }
  return <>{children}</>;
}
