import { lazy } from 'react';
import { Route, Switch } from 'wouter';
import LoginPage from './pages/login-page';

const Dashboard = lazy(() => import('./pages/dashboard'));
const NotFound = lazy(() => import('./pages/not-found'));

export default function Page() {
  return (
    <Switch>
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/signin" component={LoginPage} />
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}
