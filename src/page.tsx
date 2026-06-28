import { lazy } from 'react';
import { Route, Switch } from 'wouter';
import RequireGuest from './auth/components/require-guest';
import RequireUser from './auth/components/require-user';
import SigninPage from './pages/signin-page';

const Dashboard = lazy(() => import('./pages/dashboard'));
const NotFound = lazy(() => import('./pages/not-found'));

export default function Page() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/signin">
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
