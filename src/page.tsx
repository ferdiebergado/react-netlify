import { lazy } from 'react';
import { Route, Switch } from 'wouter';
import { clientRoutes } from '../shared/routes';
import { RequireGuest } from './auth/components/require-guest';
import { SigninPage } from './pages/signin-page';

const RequireUser = lazy(() =>
  import('./auth/components/require-user').then((m) => ({
    default: m.RequireUser,
  })),
);
const Dashboard = lazy(() =>
  import('./pages/dashboard').then((m) => ({ default: m.Dashboard })),
);
const NotFound = lazy(() =>
  import('./pages/not-found').then((m) => ({ default: m.PageNotFound })),
);

export function Page() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path={clientRoutes.signin}>
        <RequireGuest>
          <SigninPage />
        </RequireGuest>
      </Route>

      {/* Protected Routes */}
      <Route path="/">
        <RequireUser>
          <Dashboard />
        </RequireUser>
      </Route>

      {/* Catch-all Route */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}
