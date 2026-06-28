import { QueryClientProvider, useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import SplashScreen from './components/splash-screen';
import { TooltipProvider } from './components/ui/tooltip';
import { queryClient } from './lib/query-client';
import Page from './page';
import Fallback from './pages/fallback';

function App() {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      FallbackComponent={Fallback}
      // onError={(error, info) => {
      //   // Log the error to your error reporting service
      // }}
      onReset={reset}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Suspense fallback={<SplashScreen />}>
            <Page />
          </Suspense>
        </TooltipProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
