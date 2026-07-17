import { PublicLayout } from '@/components/public-layout';
import type { ReactNode } from 'react';
import { Redirect } from 'wouter';
import { useCurrentUser } from '../hooks';

export function RequireGuest({ children }: { children: ReactNode }) {
  const { data: currentUser } = useCurrentUser();

  if (currentUser) return <Redirect to="/" replace />;

  return <PublicLayout>{children}</PublicLayout>;
}
