import { Layout } from '@/app/components/layout';
import { clientRoutes } from '@/shared/routes';
import { type ReactNode } from 'react';
import { Redirect, useLocation } from 'wouter';
import { useCurrentUser } from '../hooks';

export function RequireUser({ children }: { children: ReactNode }) {
  const { data: currentUser } = useCurrentUser();
  const [location] = useLocation();

  if (currentUser === null)
    return (
      <Redirect to={clientRoutes.signin} state={{ from: location }} replace />
    );

  return <Layout>{children}</Layout>;
}
