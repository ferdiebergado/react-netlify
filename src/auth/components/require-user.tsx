import Layout from '@/components/layout';
import type { ReactNode } from 'react';
import { Redirect, useLocation } from 'wouter';
import { useCurrentUser } from '../hooks';

type RequireUserProps = {
  children: ReactNode;
};

export default function RequireUser({ children }: RequireUserProps) {
  const { data: currentUser } = useCurrentUser();
  const [location] = useLocation();

  if (currentUser === null) return <Redirect to="/signin" state={{ from: location }} replace />;

  return <Layout>{children}</Layout>;
}
