import type { ReactNode } from 'react';
import { Redirect } from 'wouter';
import { useCurrentUser } from '../hooks';

type RequireGuestProps = {
  children: ReactNode;
};

export default function RequireGuest({ children }: RequireGuestProps) {
  const { data: currentUser } = useCurrentUser();

  if (currentUser) return <Redirect to="/" replace />;

  return children;
}
